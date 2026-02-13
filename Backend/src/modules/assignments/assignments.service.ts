import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateAssignmentDto,
  UpdateAssignmentDto,
  SubmitAssignmentDto,
  GradeAssignmentDto,
} from '../courses/dto/assignment.dto';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  // ========== ASSIGNMENT CRUD ==========

  async createAssignment(itemId: string, dto: CreateAssignmentDto) {
    // Verify item is an assignment
    const item = await this.prisma.sectionItem.findUnique({
      where: { id: itemId },
    });

    if (!item || item.type !== 'ASSIGNMENT') {
      throw new NotFoundException('Assignment item not found');
    }

    return this.prisma.assignment.create({
      data: {
        item_id: itemId,
        ...dto,
        allowed_file_types: dto.allowed_file_types
          ? JSON.stringify(dto.allowed_file_types)
          : null,
        deadline: dto.deadline ? new Date(dto.deadline) : null,
      },
      include: {
        item: {
          include: {
            section: true,
          },
        },
      },
    });
  }

  async updateAssignment(assignmentId: string, dto: UpdateAssignmentDto) {
    const data: any = { ...dto };

    if (dto.allowed_file_types) {
      data.allowed_file_types = JSON.stringify(dto.allowed_file_types);
    }
    if (dto.deadline) {
      data.deadline = new Date(dto.deadline);
    }

    return this.prisma.assignment.update({
      where: { id: assignmentId },
      data,
      include: {
        item: true,
      },
    });
  }

  async getAssignment(assignmentId: string) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        item: {
          include: {
            section: {
              include: {
                course: true,
              },
            },
          },
        },
        submissions: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
            grader: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { submitted_at: 'desc' },
        },
      },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    // Parse allowed_file_types
    if (assignment.allowed_file_types) {
      try {
        (assignment as any).allowed_file_types = JSON.parse(
          assignment.allowed_file_types,
        );
      } catch (e) {
        // Keep as string if parsing fails
      }
    }

    return assignment;
  }

  // ========== ASSIGNMENT SUBMISSIONS ==========

  async submitAssignment(
    assignmentId: string,
    studentId: string,
    dto: SubmitAssignmentDto,
  ) {
    const assignment = await this.prisma.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    // Check if submission already exists
    const existingSubmission = await this.prisma.assignmentSubmission.findFirst(
      {
        where: {
          assignment_id: assignmentId,
          student_id: studentId,
        },
      },
    );

    if (existingSubmission) {
      // Update existing submission
      return this.prisma.assignmentSubmission.update({
        where: { id: existingSubmission.id },
        data: {
          ...dto,
          submitted_at: new Date(),
          grade: null, // Reset grade on resubmission
          feedback: null,
          graded_by: null,
          graded_at: null,
        },
      });
    }

    // Create new submission
    return this.prisma.assignmentSubmission.create({
      data: {
        assignment_id: assignmentId,
        student_id: studentId,
        ...dto,
      },
    });
  }

  async gradeSubmission(
    submissionId: string,
    graderId: string,
    dto: GradeAssignmentDto,
  ) {
    const submission = await this.prisma.assignmentSubmission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: true,
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    // Check if submission is late
    let finalGrade = dto.grade;
    if (submission.assignment.deadline) {
      const deadline = new Date(submission.assignment.deadline);
      const submittedAt = new Date(submission.submitted_at);

      if (
        submittedAt > deadline &&
        submission.assignment.late_penalty_percentage > 0
      ) {
        const penalty =
          (dto.grade * submission.assignment.late_penalty_percentage) / 100;
        finalGrade = Math.max(0, dto.grade - penalty);
      }
    }

    return this.prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        grade: finalGrade,
        feedback: dto.feedback,
        graded_by: graderId,
        graded_at: new Date(),
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        grader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getSubmissions(assignmentId: string, studentId?: string) {
    const where: any = { assignment_id: assignmentId };
    if (studentId) {
      where.student_id = studentId;
    }

    return this.prisma.assignmentSubmission.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        grader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignment: {
          select: {
            deadline: true,
            late_penalty_percentage: true,
          },
        },
      },
      orderBy: { submitted_at: 'desc' },
    });
  }

  async getSubmission(submissionId: string) {
    const submission = await this.prisma.assignmentSubmission.findUnique({
      where: { id: submissionId },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        grader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignment: true,
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    return submission;
  }
}

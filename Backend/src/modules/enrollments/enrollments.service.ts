import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CompletionsService } from '../completions/completions.service';

@Injectable()
export class EnrollmentsService {
  constructor(
    private prisma: PrismaService,
    private completionsService: CompletionsService,
  ) { }

  async findOne(studentId: string, courseId: string) {
    return this.prisma.enrollment.findUnique({
      where: {
        student_id_course_id: {
          student_id: studentId,
          course_id: courseId,
        },
      },
    });
  }

  async findMyEnrollments(studentId: string) {
    return this.prisma.enrollment.findMany({
      where: { student_id: studentId },
      include: {
        course: {
          include: { instructor: { include: { user: true } } },
        },
      },
    });
  }

  async checkEnrollment(studentId: string, courseId: string): Promise<boolean> {
    const enrollment = await this.findOne(studentId, courseId);
    return !!enrollment && enrollment.status === 'active';
  }

  async create(userId: string, courseId: string) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const existing = await this.findOne(userId, courseId);
    if (existing) {
      if (existing.status !== 'active') {
        return this.prisma.enrollment.update({
          where: { id: existing.id },
          data: { status: 'active', enrolled_at: new Date() },
        });
      }
      return existing;
    }

    return this.prisma.enrollment.create({
      data: {
        student_id: userId,
        course_id: courseId,
        status: 'active',
      },
    });
  }

  // Admin methods
  async findAll(search?: string, status?: string) {
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { course: { title: { contains: search, mode: 'insensitive' } } },
      ];
    }

    return this.prisma.enrollment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar_url: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { enrolled_at: 'desc' },
    });
  }

  async getStats() {
    const totalEnrollments = await this.prisma.enrollment.count();
    const activeEnrollments = await this.prisma.enrollment.count({
      where: { status: 'active' },
    });
    const completedEnrollments = await this.prisma.enrollment.count({
      where: { status: 'completed' },
    });

    // Get enrollments from this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const thisMonthEnrollments = await this.prisma.enrollment.count({
      where: {
        enrolled_at: {
          gte: startOfMonth,
        },
      },
    });

    // Calculate growth (compare to last month)
    const startOfLastMonth = new Date(startOfMonth);
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);

    const lastMonthEnrollments = await this.prisma.enrollment.count({
      where: {
        enrolled_at: {
          gte: startOfLastMonth,
          lt: startOfMonth,
        },
      },
    });

    const growth =
      lastMonthEnrollments > 0
        ? ((thisMonthEnrollments - lastMonthEnrollments) /
          lastMonthEnrollments) *
        100
        : 0;

    return {
      total: totalEnrollments,
      active: activeEnrollments,
      completed: completedEnrollments,
      thisMonth: thisMonthEnrollments,
      growth: Math.round(growth),
    };
  }

  async adminEnroll(studentEmail: string, courseId: string) {
    // Find student by email
    const student = await this.prisma.user.findUnique({
      where: { email: studentEmail },
    });

    if (!student) {
      throw new NotFoundException('Student not found with this email');
    }

    // Check if course exists
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Check if already enrolled
    const existing = await this.findOne(student.id, courseId);
    if (existing) {
      throw new BadRequestException(
        'Student is already enrolled in this course',
      );
    }

    // TODO: Send confirmation email to student
    // this.mailService.sendEnrollmentConfirmation(student.email, course.title);

    return this.prisma.enrollment.create({
      data: {
        student_id: student.id,
        course_id: courseId,
        status: 'active',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async bulkEnroll(studentIds: string[], courseIds: string[]) {
    const results = {
      total: studentIds.length * courseIds.length,
      success: 0,
      alreadyEnrolled: 0,
      failed: 0,
      errors: [] as { studentId: string; courseId: string; error: any }[],
    };

    for (const studentId of studentIds) {
      for (const courseId of courseIds) {
        try {
          const existing = await this.findOne(studentId, courseId);
          if (existing) {
            results.alreadyEnrolled++;
            continue;
          }

          await this.prisma.enrollment.create({
            data: {
              student_id: studentId,
              course_id: courseId,
              status: 'active',
            },
          });

          // Fetch details for email (placeholder)
          // const student = await this.prisma.user.findUnique({ where: { id: studentId } });
          // const course = await this.prisma.course.findUnique({ where: { id: courseId } });
          // TODO: Send confirmation email to student
          // if (student && course) {
          //   this.mailService.sendEnrollmentConfirmation(student.email, course.title);
          // }

          results.success++;
        } catch (error) {
          console.error(`Failed to enroll student ${studentId} in course ${courseId}`, error);
          results.failed++;
          results.errors.push({ studentId, courseId, error: error.message });
        }
      }
    }

    return results;
  }

  async updateStatus(id: string, status: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    return this.prisma.enrollment.update({
      where: { id },
      data: { status },
    });
  }

  async remove(id: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    return this.prisma.enrollment.delete({
      where: { id },
    });
  }

  // Course completion management methods
  async getCourseStudents(courseId: string) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { course_id: courseId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar_url: true,
          },
        },
      },
      orderBy: { enrolled_at: 'desc' },
    });

    // Map to include all necessary fields
    return {
      students: enrollments.map((enrollment) => ({
        id: enrollment.user.id,
        enrollment_id: enrollment.id,
        name: enrollment.user.name,
        email: enrollment.user.email,
        avatar_url: enrollment.user.avatar_url,
        enrolled_at: enrollment.enrolled_at,
        status: enrollment.status,
        progress_percentage: (enrollment as any).progress_percentage || 0,
        completed_at: (enrollment as any).completed_at,
        last_activity_at: (enrollment as any).last_activity_at,
        // TODO: Calculate these from progress tracking
        lessons_completed: 0,
        total_lessons: 0,
        certificate_issued: false,
      })),
    };
  }

  async bulkComplete(dto: { enrollment_ids: string[]; completion_date?: string }) {
    const completionDate = dto.completion_date ? new Date(dto.completion_date) : new Date();

    const result = await this.prisma.enrollment.updateMany({
      where: {
        id: { in: dto.enrollment_ids },
      },
      data: {
        status: 'completed',
        completed_at: completionDate,
        progress_percentage: 100,
      },
    });

    // TODO: Issue certificates if course has certificates enabled
    // This would require fetching the course and checking certificate_enabled
    // Then calling the completions service to issue certificates

    return {
      success: true,
      updated: result.count,
      message: `Successfully marked ${result.count} enrollment(s) as complete`,
    };
  }

  async updateCompletionDate(enrollmentId: string, dto: { completion_date: string }) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    return this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { completed_at: new Date(dto.completion_date) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async manualComplete(enrollmentId: string, dto: { completion_date?: string }) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id: enrollmentId },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    const completionDate = dto.completion_date ? new Date(dto.completion_date) : new Date();

    // 1. Update Enrollment
    const updated = await this.prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        status: 'completed',
        completed_at: completionDate,
        progress_percentage: 100,
      },
      include: {
        user: true,
        course: true,
      },
    });

    // 2. Trigger completion logic via CompletionsService
    const completionResult = await this.completionsService.markComplete(updated.student_id, updated.course_id, 'ADMIN');

    // If date was custom, ensure CourseProgress/Certificate match that date
    if (dto.completion_date) {
      await this.updateCompletionDate(enrollmentId, { completion_date: dto.completion_date });
    }

    return {
      ...updated,
      certificate_issued: !!completionResult.certificate,
    };
  }

  async bulkUpdateDates(dto: { enrollment_ids: string[]; enrollment_date?: string; completion_date?: string }) {
    const updates: any = {};
    if (dto.enrollment_date) {
      updates.enrolled_at = new Date(dto.enrollment_date);
    }
    if (dto.completion_date) {
      updates.completed_at = new Date(dto.completion_date);
    }

    if (Object.keys(updates).length === 0) {
      return { success: true, updated: 0, message: 'No dates provided for update' };
    }

    const result = await this.prisma.enrollment.updateMany({
      where: {
        id: { in: dto.enrollment_ids },
      },
      data: updates,
    });

    // If completion date updated, sync with CourseProgress and Certificate
    if (dto.completion_date) {
      const enrollments = await this.prisma.enrollment.findMany({
        where: { id: { in: dto.enrollment_ids } },
        select: { student_id: true, course_id: true },
      });

      const newDate = new Date(dto.completion_date);

      for (const enrollment of enrollments) {
        // Update CourseProgress
        await this.prisma.courseProgress.updateMany({
          where: {
            student_id: enrollment.student_id,
            course_id: enrollment.course_id,
          },
          data: { updated_at: newDate },
        });

        // Update Certificate
        await this.prisma.certificate.updateMany({
          where: {
            student_id: enrollment.student_id,
            course_id: enrollment.course_id,
          },
          data: { issued_at: newDate },
        });
      }
    }

    return {
      success: true,
      updated: result.count,
      message: `Successfully updated dates for ${result.count} enrollment(s)`,
    };
  }

  async bulkIncomplete(dto: { enrollment_ids: string[] }) {
    // 1. Update Enrollments to active, progress 0, no completion date
    const result = await this.prisma.enrollment.updateMany({
      where: {
        id: { in: dto.enrollment_ids },
      },
      data: {
        status: 'active',
        completed_at: null,
        progress_percentage: 0,
      },
    });

    // 2. Fetch enrollment details to find related CourseProgress/Certificates
    const enrollments = await this.prisma.enrollment.findMany({
      where: { id: { in: dto.enrollment_ids } },
      select: { student_id: true, course_id: true },
    });

    for (const enrollment of enrollments) {
      // 3. Reset CourseProgress
      await this.prisma.courseProgress.updateMany({
        where: {
          student_id: enrollment.student_id,
          course_id: enrollment.course_id,
        },
        data: {
          completed: false,
          progress_percentage: 0,
          updated_at: new Date(),
        },
      });

      // 4. Delete existing certificates
      await this.prisma.certificate.deleteMany({
        where: {
          student_id: enrollment.student_id,
          course_id: enrollment.course_id,
        },
      });
    }

    return {
      success: true,
      updated: result.count,
      message: `Successfully marked ${result.count} enrollment(s) as incomplete and reset progress`,
    };
  }
}

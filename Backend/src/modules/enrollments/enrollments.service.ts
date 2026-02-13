import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EnrollmentsService {
  constructor(private prisma: PrismaService) {}

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
}

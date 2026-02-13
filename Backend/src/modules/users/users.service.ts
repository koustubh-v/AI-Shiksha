import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        ...rest,
        password_hash: hashedPassword,
        role: rest.role || 'STUDENT',
      },
    });
  }

  // ... (keeping other methods same until findAll)

  async getStudentDashboardStats(userId: string) {
    const enrolledCount = await this.prisma.enrollment.count({
      where: { student_id: userId, status: 'active' },
    });

    const hoursLearnedAgg = await this.prisma.lessonProgress.aggregate({
      where: { student_id: userId },
      _sum: { watched_seconds: true },
    });
    const hours = Math.round(
      (hoursLearnedAgg._sum.watched_seconds || 0) / 3600,
    );

    const certificates = await this.prisma.certificate.count({
      where: { student_id: userId },
    });

    const inProgress = await this.prisma.enrollment.findMany({
      where: { student_id: userId, status: 'active' },
      include: {
        course: {
          include: {
            instructor: { include: { user: true } },
          },
        },
      },
      take: 3,
      orderBy: { enrolled_at: 'desc' },
    });

    const progressList = await Promise.all(
      inProgress.map(async (enrollment) => {
        const progress = await this.prisma.courseProgress.findUnique({
          where: {
            student_id_course_id: {
              student_id: userId,
              course_id: enrollment.course_id,
            },
          },
        });
        return {
          id: enrollment.course.id,
          title: enrollment.course.title,
          instructor: enrollment.course.instructor.user.name,
          progress: progress ? progress.progress_percentage : 0,
          image:
            enrollment.course.thumbnail_url ||
            'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=120&h=80&fit=crop',
        };
      }),
    );

    return {
      stats: [
        {
          label: 'Courses Enrolled',
          value: enrolledCount.toString(),
          icon: 'BookOpen',
          gradient: 'from-primary/15 to-primary/5',
          iconColor: 'text-primary',
        },
        {
          label: 'Hours Learned',
          value: hours.toString(),
          icon: 'Clock',
          gradient: 'from-accent/15 to-accent/5',
          iconColor: 'text-accent',
        },
        {
          label: 'Certificates',
          value: certificates.toString(),
          icon: 'Trophy',
          gradient: 'from-chart-3/15 to-chart-3/5',
          iconColor: 'text-chart-3',
        },
      ],
      inProgressCourses: progressList,
      upcomingDeadlines: [
        { title: 'Complete Profile', course: 'Onboarding', dueIn: 'Soon' },
      ],
    };
  }

  async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findAll(role?: string) {
    const where = role ? { role: role.toUpperCase() as any } : {};
    return this.prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true,
        avatar_url: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async delete(id: string): Promise<User> {
    // Prevent deletion of the last admin
    const userToDelete = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!userToDelete) {
      throw new Error('User not found');
    }

    if (userToDelete.role === 'ADMIN') {
      const adminCount = await this.prisma.user.count({
        where: { role: 'ADMIN' },
      });

      if (adminCount <= 1) {
        throw new Error('Cannot delete the last admin user');
      }
    }

    return this.prisma.user.delete({
      where: { id },
    });
  }

  async getStudentStats() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Total students
    const totalStudents = await this.prisma.user.count({
      where: { role: 'STUDENT' },
    });

    // Active learners (students with at least one active enrollment)
    const activeStudentsIds = await this.prisma.enrollment.findMany({
      where: {
        status: 'active',
      },
      select: {
        student_id: true,
      },
      distinct: ['student_id'],
    });

    const activeStudents = activeStudentsIds.length;

    // Average completion across all students
    const courseProgressData = await this.prisma.courseProgress.aggregate({
      _avg: {
        progress_percentage: true,
      },
    });

    const avgCompletion = Math.round(
      courseProgressData._avg.progress_percentage || 0,
    );

    // New students this month
    const newThisMonth = await this.prisma.user.count({
      where: {
        role: 'STUDENT',
        created_at: {
          gte: firstDayOfMonth,
        },
      },
    });

    return {
      totalStudents,
      activeStudents,
      avgCompletion,
      newThisMonth,
    };
  }

  async getTeacherStats() {
    // Get only instructors (not admins)
    const instructors = await this.prisma.instructorProfile.findMany({
      include: {
        user: true,
        courses: {
          include: {
            _count: {
              select: { enrollments: true },
            },
            payments: {
              where: {
                payment_status: 'completed',
              },
            },
            reviews: {
              select: { rating: true },
            },
          },
        },
      },
    });

    // Filter out admins
    const nonAdminInstructors = instructors.filter(
      (i) => i.user.role === 'INSTRUCTOR',
    );

    const totalTeachers = nonAdminInstructors.length;

    const totalCourses = nonAdminInstructors.reduce(
      (sum, instructor) => sum + instructor.courses.length,
      0,
    );

    const totalRevenue = nonAdminInstructors.reduce(
      (sum, instructor) =>
        sum +
        instructor.courses.reduce(
          (courseSum, course) =>
            courseSum +
            course.payments.reduce(
              (paymentSum, payment) => paymentSum + payment.amount,
              0,
            ),
          0,
        ),
      0,
    );

    // Calculate average rating across all courses
    let totalRatingSum = 0;
    let totalRatingCount = 0;

    nonAdminInstructors.forEach((instructor) => {
      instructor.courses.forEach((course) => {
        const courseRatingSum = course.reviews.reduce(
          (sum, review) => sum + review.rating,
          0,
        );
        totalRatingSum += courseRatingSum;
        totalRatingCount += course.reviews.length;
      });
    });

    const avgRating =
      totalRatingCount > 0
        ? parseFloat((totalRatingSum / totalRatingCount).toFixed(1))
        : 0;

    return {
      totalTeachers,
      totalCourses,
      totalRevenue,
      avgRating,
    };
  }
}

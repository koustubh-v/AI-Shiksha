import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInstructorDto } from './dto/create-instructor.dto';
import { UpdateInstructorDto } from './dto/update-instructor.dto';
import { UserRole } from '../users/dto/create-user.dto';

@Injectable()
export class InstructorsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createInstructorDto: CreateInstructorDto) {
    // Check if user exists and upgrade role if needed?
    // Or assume user must apply?
    // Let's just create the profile.

    // Check if profile exists
    const existing = await this.prisma.instructorProfile.findUnique({
      where: { user_id: userId },
    });
    if (existing) {
      throw new BadRequestException('Instructor profile already exists');
    }

    // Update user role to INSTRUCTOR if not already?
    await this.prisma.user.update({
      where: { id: userId },
      data: { role: UserRole.INSTRUCTOR },
    });

    return this.prisma.instructorProfile.create({
      data: {
        user_id: userId,
        ...createInstructorDto,
      },
      include: { user: true },
    });
  }

  async findAll() {
    return this.prisma.instructorProfile.findMany({
      include: { user: true },
    });
  }

  async findOne(id: string) {
    const instructor = await this.prisma.instructorProfile.findUnique({
      where: { id },
      include: { user: true, courses: true },
    });
    if (!instructor) throw new NotFoundException('Instructor not found');
    return instructor;
  }

  async findByUserId(userId: string) {
    return this.prisma.instructorProfile.findUnique({
      where: { user_id: userId },
      include: { user: true, courses: true },
    });
  }

  async update(id: string, updateInstructorDto: UpdateInstructorDto) {
    return this.prisma.instructorProfile.update({
      where: { id },
      data: updateInstructorDto,
    });
  }

  async getDashboardStats(userId: string) {
    const instructor = await this.prisma.instructorProfile.findUnique({
      where: { user_id: userId },
      include: { courses: true },
    });

    if (!instructor) {
      throw new BadRequestException('Instructor profile not found');
    }

    const courseIds = instructor.courses.map((c) => c.id);

    const totalStudents = await this.prisma.enrollment.count({
      where: { course_id: { in: courseIds } },
    });

    const totalRevenue = await this.prisma.payment.aggregate({
      where: {
        course_id: { in: courseIds },
        payment_status: 'completed',
      },
      _sum: { amount: true },
    });

    // Calculate rating
    // This requires aggregation on reviews for these courses
    const reviews = await this.prisma.review.aggregate({
      where: { course_id: { in: courseIds } },
      _avg: { rating: true },
    });

    // Top Courses
    const courses = await this.prisma.course.findMany({
      where: { instructor_id: instructor.id },
      include: {
        _count: { select: { enrollments: true } },
        payments: true,
      },
      take: 5,
    });

    const topCourses = courses
      .map((c) => {
        const revenue = c.payments.reduce((sum, p) => sum + p.amount, 0);
        return {
          title: c.title,
          students: c._count.enrollments,
          revenue: `$${revenue.toLocaleString()}`,
          rating: 4.8, // Mocking rating per course for now as aggregation is complex here
        };
      })
      .sort((a, b) => b.students - a.students)
      .slice(0, 3);

    // Recent Activity (Mocked for now as we need a unified activity log)
    const recentActivity = [
      {
        action: 'New enrollment',
        course: courses[0]?.title || 'Course',
        time: '2 hours ago',
      },
      { action: 'Payout processed', course: '$450.00', time: '1 day ago' },
    ];

    return {
      stats: [
        {
          label: 'Total Revenue',
          value: `$${(totalRevenue._sum.amount || 0).toLocaleString()}`,
          change: '+0%',
          icon: 'DollarSign',
          gradient: 'from-primary/15 to-primary/5',
          iconColor: 'text-primary',
        },
        {
          label: 'Total Students',
          value: totalStudents.toString(),
          change: '+0%',
          icon: 'Users',
          gradient: 'from-accent/15 to-accent/5',
          iconColor: 'text-accent',
        },
        {
          label: 'Active Courses',
          value: instructor.courses.length.toString(),
          icon: 'BookOpen',
          gradient: 'from-chart-3/15 to-chart-3/5',
          iconColor: 'text-chart-3',
        },
        {
          label: 'Avg. Rating',
          value: (reviews._avg.rating || 0).toFixed(1),
          icon: 'Star',
          gradient: 'from-chart-4/15 to-chart-4/5',
          iconColor: 'text-chart-4',
        },
      ],
      topCourses,
      recentActivity,
    };
  }

  async findAllWithStats() {
    const instructors = await this.prisma.instructorProfile.findMany({
      include: {
        user: true,
        courses: {
          include: {
            _count: { select: { enrollments: true } },
            payments: true,
            reviews: { select: { rating: true } },
          },
        },
      },
    });

    return instructors.map((instructor) => {
      const totalCourses = instructor.courses.length;
      const totalStudents = instructor.courses.reduce(
        (sum, c) => sum + c._count.enrollments,
        0,
      );
      const totalRevenue = instructor.courses.reduce(
        (sum, c) => sum + c.payments.reduce((psum, p) => psum + p.amount, 0),
        0,
      );

      let totalRatingSum = 0;
      let totalRatingCount = 0;
      instructor.courses.forEach((c) => {
        const courseRatingSum = c.reviews.reduce((sum, r) => sum + r.rating, 0);
        totalRatingSum += courseRatingSum;
        totalRatingCount += c.reviews.length;
      });
      const averageRating =
        totalRatingCount > 0
          ? (totalRatingSum / totalRatingCount).toFixed(1)
          : '0.0';

      return {
        id: instructor.id,
        name: instructor.user.name,
        email: instructor.user.email,
        courses: totalCourses,
        students: totalStudents,
        revenue: totalRevenue,
        rating: parseFloat(averageRating),
        status: 'verified', // Mocking status
        avatar: instructor.user.avatar_url,
      };
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) { }

  async getPlatformStats(franchiseId?: string) {
    // Build where clause for franchise scoping
    const franchiseWhere = franchiseId ? { franchise_id: franchiseId } : {};

    const totalUsers = await this.prisma.user.count({ where: franchiseId ? { franchise_id: franchiseId } : {} });
    const activeCourses = await (this.prisma as any).course.count({
      where: { status: 'PUBLISHED', ...franchiseWhere },
    });

    const totalRevenueResult = await this.prisma.payment.aggregate({
      where: franchiseWhere,
      _sum: { amount: true },
    });
    const totalRevenue = totalRevenueResult._sum.amount || 0;

    // Calculate real completion rate
    const totalProgress = await this.prisma.courseProgress.count();
    const completedProgress = await this.prisma.courseProgress.count({
      where: { completed: true },
    });
    const completionRate =
      totalProgress > 0
        ? Math.round((completedProgress / totalProgress) * 100)
        : 0;

    return [
      {
        label: 'Total Users',
        value: totalUsers.toLocaleString(),
        change: '+0%',
        icon: 'Users',
        gradient: 'from-primary/15 to-primary/5',
        iconColor: 'text-primary',
      },
      {
        label: 'Active Courses',
        value: activeCourses.toLocaleString(),
        change: '+0%',
        icon: 'BookOpen',
        gradient: 'from-accent/15 to-accent/5',
        iconColor: 'text-accent',
      },
      {
        label: 'Total Revenue',
        value: `$${totalRevenue.toLocaleString()}`,
        change: '+0%',
        icon: 'DollarSign',
        gradient: 'from-chart-3/15 to-chart-3/5',
        iconColor: 'text-chart-3',
      },
      {
        label: 'Completion Rate',
        value: `${completionRate}%`,
        change: '+0%',
        icon: 'TrendingUp',
        gradient: 'from-chart-4/15 to-chart-4/5',
        iconColor: 'text-chart-4',
      },
    ];
  }


  async getUserGrowth(franchiseId?: string) {
    // Group users by month created
    const whereClause: any = {};
    if (franchiseId) {
      whereClause.franchise_id = franchiseId;
    }

    const users = await this.prisma.user.findMany({
      where: whereClause,
      select: { created_at: true, role: true },
    });

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const currentMonth = new Date().getMonth();
    // Show last 6 months
    const result: { month: string; students: number; teachers: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(currentMonth - i);
      const monthName = months[d.getMonth()];
      const usersInMonth = users.filter(
        (u) =>
          u.created_at.getMonth() === d.getMonth() &&
          u.created_at.getFullYear() === d.getFullYear(),
      );

      result.push({
        month: monthName,
        students: usersInMonth.filter((u) => u.role === 'STUDENT').length,
        teachers: usersInMonth.filter((u) => u.role === 'INSTRUCTOR').length,
      });
    }
    return result;
  }

  async getRevenueData(franchiseId?: string) {
    // Raw query might be better for aggregation but using JS for simplicity with small data
    const whereClause: any = {};
    if (franchiseId) {
      whereClause.franchise_id = franchiseId;
    }

    const payments = await this.prisma.payment.findMany({
      where: whereClause,
      select: { created_at: true, amount: true },
    });

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const currentMonth = new Date().getMonth();
    // Show last 6 months
    const result: { month: string; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(currentMonth - i);
      const monthName = months[d.getMonth()];
      const paymentsInMonth = payments.filter(
        (p) =>
          p.created_at.getMonth() === d.getMonth() &&
          p.created_at.getFullYear() === d.getFullYear(),
      );

      const revenue = paymentsInMonth.reduce((sum, p) => sum + p.amount, 0);

      result.push({
        month: monthName,
        revenue: revenue,
      });
    }
    return result;
  }

  async getPendingActions(franchiseId?: string) {
    const pendingActions: any[] = [];
    const franchiseWhere = franchiseId ? { franchise_id: franchiseId } : {};

    // Check for draft courses
    const draftCourses = await (this.prisma as any).course.findMany({
      where: { status: 'DRAFT', ...franchiseWhere },
      take: 5,
      include: { instructor: { include: { user: true } } },
    });

    const draftActions = draftCourses.map((c) => ({
      title: `Course Approval: ${c.title}`,
      priority: 'high',
      href: `/admin/courses/${c.id}`,
      status: 'draft',
      teacher: c.instructor?.user?.name || 'Unknown',
    }));
    pendingActions.push(...draftActions);

    // Check for unverified instructors
    const unverifiedInstructors = await this.prisma.instructorProfile.findMany({
      where: { verified: false, user: franchiseWhere }, // Filter by user franchise
      take: 5,
      include: { user: true },
    });

    const verifyActions = unverifiedInstructors.map((i) => ({
      title: `Verify Instructor: ${i.user.name}`,
      priority: 'medium',
      href: `/admin/users/${i.user.id}`,
      status: 'pending',
      user: i.user.name,
    }));
    pendingActions.push(...verifyActions);

    return pendingActions;
  }
}


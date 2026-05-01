import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  private buildDateFilter(startDate?: string, endDate?: string) {
    const filter: any = {};
    if (startDate && startDate !== 'undefined' && startDate !== 'null') {
      const d = new Date(startDate);
      if (!isNaN(d.getTime())) filter.gte = d;
    }
    if (endDate && endDate !== 'undefined' && endDate !== 'null') {
      const d = new Date(endDate + 'T23:59:59Z');
      if (!isNaN(d.getTime())) filter.lte = d;
    }
    return Object.keys(filter).length > 0 ? filter : undefined;
  }

  // ──────────────────────────────────────────────────────────────
  // STUDENT REPORT
  // ──────────────────────────────────────────────────────────────
  async getStudentReport(
    franchiseId: string | undefined,
    startDate?: string,
    endDate?: string,
    courseId?: string,
  ) {
    const fWhere = franchiseId ? { franchise_id: franchiseId } : {};
    const dateFilter = this.buildDateFilter(startDate, endDate);

    const totalStudents = await this.prisma.user.count({
      where: { role: 'STUDENT', ...fWhere },
    });

    const newStudents = await this.prisma.user.count({
      where: {
        role: 'STUDENT',
        ...fWhere,
        ...(dateFilter ? { created_at: dateFilter } : {}),
      },
    });

    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        ...fWhere,
        ...(courseId ? { course_id: courseId } : {}),
        ...(dateFilter ? { enrolled_at: dateFilter } : {}),
      },
      include: {
        user: { select: { id: true, name: true, email: true, created_at: true } },
        course: { select: { id: true, title: true } },
      },
      orderBy: { enrolled_at: 'desc' },
    });

    const courseGroups: Record<string, { courseName: string; count: number }> = {};
    enrollments.forEach((e) => {
      if (!courseGroups[e.course_id]) {
        courseGroups[e.course_id] = { courseName: e.course.title, count: 0 };
      }
      courseGroups[e.course_id].count++;
    });

    const uniqueStudents = new Set(enrollments.map((e) => e.student_id)).size;

    return {
      summary: {
        totalStudents,
        newRegistrations: newStudents,
        activeStudents: uniqueStudents,
        avgCoursesPerStudent:
          uniqueStudents > 0 ? (enrollments.length / uniqueStudents).toFixed(1) : 0,
      },
      students: enrollments.map((e) => ({
        id: e.user.id,
        name: e.user.name,
        email: e.user.email,
        joinDate: e.user.created_at,
        course: e.course.title,
        courseId: e.course_id,
        enrolledAt: e.enrolled_at,
        status: e.status,
        progress: e.progress_percentage,
      })),
      studentsByCourse: Object.entries(courseGroups).map(([id, v]) => ({
        courseId: id,
        ...v,
      })),
    };
  }

  // ──────────────────────────────────────────────────────────────
  // COURSE REPORT
  // ──────────────────────────────────────────────────────────────
  async getCourseReport(
    franchiseId: string | undefined,
    startDate?: string,
    endDate?: string,
    courseId?: string,
  ) {
    const fWhere = franchiseId ? { franchise_id: franchiseId } : {};
    const dateFilter = this.buildDateFilter(startDate, endDate);

    const courses = await (this.prisma as any).course.findMany({
      where: {
        ...fWhere,
        ...(courseId ? { id: courseId } : {}),
      },
      include: {
        enrollments: {
          where: dateFilter ? { enrolled_at: dateFilter } : {},
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        course_progress: true,
        sections: {
          include: {
            items: {
              where: { type: 'LECTURE' },
              include: { sectionItemProgresses: true },
            },
          },
        },
      },
    });

    const courseData = courses.map((course: any) => {
      const total = course.enrollments.length;
      const completed = course.course_progress.filter((p: any) => p.completed).length;
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

      let totalSlots = 0;
      let completedSlots = 0;
      course.sections.forEach((sec: any) => {
        sec.items.forEach((item: any) => {
          totalSlots += item.sectionItemProgresses.length;
          completedSlots += item.sectionItemProgresses.filter((p: any) => p.completed).length;
        });
      });
      const lecturePct = totalSlots > 0 ? Math.round((completedSlots / totalSlots) * 100) : 0;

      return {
        courseId: course.id,
        courseName: course.title,
        totalEnrollments: total,
        completionRate,
        lectureCompletionPct: lecturePct,
        students: course.enrollments.map((e: any) => ({
          id: e.user.id,
          name: e.user.name,
          email: e.user.email,
          enrolledAt: e.enrolled_at,
          progress: e.progress_percentage,
          status: e.status,
          completedAt: e.completed_at,
        })),
      };
    });

    const totEnrollments = courseData.reduce((s: number, c: any) => s + c.totalEnrollments, 0);
    const avgCompletion =
      courseData.length > 0
        ? Math.round(
            courseData.reduce((s: number, c: any) => s + c.completionRate, 0) / courseData.length,
          )
        : 0;

    return {
      summary: {
        totalEnrollments: totEnrollments,
        avgCompletionRate: avgCompletion,
        activeCourses: courses.length,
        avgLectureCompletion:
          courseData.length > 0
            ? Math.round(
                courseData.reduce((s: number, c: any) => s + c.lectureCompletionPct, 0) /
                  courseData.length,
              )
            : 0,
      },
      courses: courseData,
    };
  }

  // ──────────────────────────────────────────────────────────────
  // ASSESSMENT REPORT
  // ──────────────────────────────────────────────────────────────
  async getAssessmentReport(
    franchiseId: string | undefined,
    startDate?: string,
    endDate?: string,
    courseId?: string,
  ) {
    const fWhere = franchiseId ? { franchise_id: franchiseId } : {};
    const dateFilter = this.buildDateFilter(startDate, endDate);

    const quizSubmissions = await this.prisma.quizSubmission.findMany({
      where: {
        quiz: { ...fWhere },
        ...(dateFilter ? { submitted_at: dateFilter } : {}),
        ...(courseId
          ? {
              quiz: {
                ...fWhere,
                section_items: { some: { section: { course_id: courseId } } },
              },
            }
          : {}),
      },
      include: {
        quiz: { select: { title: true } },
        student: { select: { name: true, email: true } },
      },
      orderBy: { submitted_at: 'desc' },
    });

    const assignmentSubmissions = await this.prisma.assignmentSubmission.findMany({
      where: {
        student: fWhere,
        ...(dateFilter ? { submitted_at: dateFilter } : {}),
      },
      include: {
        assignment: {
          include: {
            item: {
              select: {
                title: true,
                section: {
                  select: {
                    course_id: true,
                    course: { select: { title: true, franchise_id: true } },
                  },
                },
              },
            },
          },
        },
        student: { select: { name: true, email: true } },
      },
      orderBy: { submitted_at: 'desc' },
    });

    const filtered = courseId
      ? assignmentSubmissions.filter(
          (s) => s.assignment.item.section.course_id === courseId,
        )
      : assignmentSubmissions;

    const total = quizSubmissions.length;
    const passed = quizSubmissions.filter((s) => s.passed).length;

    return {
      summary: {
        totalQuizAttempts: total,
        passRate: total > 0 ? Math.round((passed / total) * 100) : 0,
        failRate: total > 0 ? Math.round(((total - passed) / total) * 100) : 0,
        assignmentSubmissions: filtered.length,
        pendingEvaluations: filtered.filter((s) => s.grade === null).length,
      },
      quizSubmissions: quizSubmissions.map((s) => ({
        id: s.id,
        studentName: s.student.name,
        studentEmail: s.student.email,
        quizTitle: s.quiz.title,
        score: s.score,
        passed: s.passed,
        timeTaken: s.time_taken_minutes,
        submittedAt: s.submitted_at,
      })),
      assignmentSubmissions: filtered.map((s) => ({
        id: s.id,
        studentName: s.student.name,
        studentEmail: s.student.email,
        assignmentTitle: s.assignment.item.title,
        courseName: s.assignment.item.section.course.title,
        grade: s.grade,
        graded: s.grade !== null,
        submittedAt: s.submitted_at,
        gradedAt: s.graded_at,
      })),
    };
  }

  // ──────────────────────────────────────────────────────────────
  // REVENUE REPORT (Razorpay + Admin Manual Enrollments combined)
  // ──────────────────────────────────────────────────────────────
  async getRevenueReport(
    franchiseId: string | undefined,
    startDate?: string,
    endDate?: string,
    courseId?: string,
    paymentMethod?: string,
  ) {
    const fWhere = franchiseId ? { franchise_id: franchiseId } : {};
    const dateFilter = this.buildDateFilter(startDate, endDate);

    const payments = await this.prisma.payment.findMany({
      where: {
        ...fWhere,
        ...(courseId ? { course_id: courseId } : {}),
        ...(dateFilter ? { created_at: dateFilter } : {}),
        ...(paymentMethod ? { payment_provider: paymentMethod } : {}),
      },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
        coupon: { select: { code: true, discount_value: true, discount_type: true } },
      },
      orderBy: { created_at: 'desc' },
    });

    const successful = payments.filter(
      (p) => p.payment_status === 'success' || p.payment_status === 'completed',
    );
    const failed = payments.filter((p) => p.payment_status === 'failed');
    const withCoupon = payments.filter((p) => p.coupon_id !== null);

    const totalRevenue = successful.reduce((s, p) => s + p.amount, 0);

    const courseSales: Record<string, { courseName: string; sales: number; revenue: number }> = {};
    successful.forEach((p) => {
      if (!courseSales[p.course_id]) {
        courseSales[p.course_id] = { courseName: p.course.title, sales: 0, revenue: 0 };
      }
      courseSales[p.course_id].sales++;
      courseSales[p.course_id].revenue += p.amount;
    });

    return {
      summary: {
        totalRevenue,
        totalTransactions: payments.length,
        successfulTransactions: successful.length,
        failedPayments: failed.length,
        couponUsage: withCoupon.length,
      },
      transactions: payments.map((p) => ({
        id: p.id,
        studentName: p.user.name,
        studentEmail: p.user.email,
        course: p.course.title,
        amount: p.amount,
        currency: p.currency,
        status: p.payment_status,
        method: p.payment_provider,
        couponCode: p.coupon?.code || null,
        couponDiscount: p.coupon?.discount_value || null,
        transactionId: p.transaction_id,
        createdAt: p.created_at,
      })),
      courseSales: Object.values(courseSales),
    };
  }
}

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';

@Injectable()
export class RazorpayService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  private async resolveFranchiseId(franchiseId?: string) {
    if (franchiseId) return franchiseId;
    const defaultFranchise = await this.prisma.franchise.findFirst({ orderBy: { created_at: 'asc' } });
    if (!defaultFranchise) throw new BadRequestException('No franchise found');
    return defaultFranchise.id;
  }

  async getSettings(franchiseId: string) {
    const resolvedId = await this.resolveFranchiseId(franchiseId);
    const settings = await this.prisma.razorpaySetting.findUnique({
      where: { franchise_id: resolvedId },
    });
    
    if (!settings) {
      return this.prisma.razorpaySetting.create({
        data: {
          franchise_id: resolvedId,
          key_id: '',
          key_secret: '',
          webhook_secret: '',
          currency: 'INR',
          is_enabled: false,
        }
      });
    }
    
    return settings;
  }

  async updateSettings(franchiseId: string, data: any) {
    const resolvedId = await this.resolveFranchiseId(franchiseId);
    return this.prisma.razorpaySetting.upsert({
      where: { franchise_id: resolvedId },
      create: {
        franchise_id: resolvedId,
        key_id: data.key_id || '',
        key_secret: data.key_secret || '',
        webhook_secret: data.webhook_secret || '',
        currency: data.currency || 'INR',
        is_enabled: data.is_enabled ?? false,
      },
      update: {
        key_id: data.key_id,
        key_secret: data.key_secret,
        webhook_secret: data.webhook_secret,
        currency: data.currency,
        is_enabled: data.is_enabled,
      },
    });
  }

  async createOrder(franchiseId: string, userId: string, data: { courseIds: string[]; amount: number; couponId?: string }) {
    const resolvedId = await this.resolveFranchiseId(franchiseId);
    const settings = await this.getSettings(resolvedId);
    
    if (!settings.is_enabled || !settings.key_id || !settings.key_secret) {
      throw new BadRequestException('Razorpay is not configured for this franchise');
    }

    const razorpay = new Razorpay({
      key_id: settings.key_id,
      key_secret: settings.key_secret,
    });

    // Handle free orders (100% discount coupons)
    if (data.amount < 1) {
      const orderId = `order_free_${Date.now()}_${userId.slice(0, 8)}`;
      await this.prisma.payment.createMany({
        data: data.courseIds.map((courseId) => ({
          user_id: userId,
          course_id: courseId,
          amount: 0,
          currency: settings.currency,
          payment_provider: 'free',
          payment_status: 'payment_pending', // Will be verified shortly by verifyPayment or immediately. We can keep it pending to follow flow.
          order_id: orderId,
          franchise_id: franchiseId,
          coupon_id: data.couponId || null,
        })),
      });

      return {
        orderId: orderId,
        amount: 0,
        currency: settings.currency,
        keyId: settings.key_id,
        isFree: true,
      };
    }

    const options = {
      amount: Math.round(data.amount * 100), // paise
      currency: settings.currency,
      receipt: `rcpt_${Date.now()}_${userId.slice(0, 8)}`,
    };

    try {
      const order = await razorpay.orders.create(options);

      const amountPerCourse = data.amount / data.courseIds.length;
      await this.prisma.payment.createMany({
        data: data.courseIds.map((courseId) => ({
          user_id: userId,
          course_id: courseId,
          amount: amountPerCourse,
          currency: settings.currency,
          payment_provider: 'razorpay',
          payment_status: 'payment_pending',
          order_id: order.id,
          franchise_id: resolvedId,
          coupon_id: data.couponId || null,
        })),
      });

      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: settings.key_id,
      };
    } catch (error) {
      throw new BadRequestException('Failed to create Razorpay order: ' + error?.message);
    }
  }

  async verifyPayment(franchiseId: string, data: { paymentId: string; orderId: string; signature: string }) {
    const resolvedId = await this.resolveFranchiseId(franchiseId);
    const settings = await this.getSettings(resolvedId);
    
    if (!settings.key_secret) {
      throw new BadRequestException('Razorpay configuration missing');
    }

    if (data.signature !== 'free_signature') {
      const generatedSignature = crypto
        .createHmac('sha256', settings.key_secret)
        .update(`${data.orderId}|${data.paymentId}`)
        .digest('hex');

      if (generatedSignature !== data.signature) {
        await this.prisma.payment.updateMany({
          where: { order_id: data.orderId, franchise_id: resolvedId },
          data: { payment_status: 'failed' }
        });
        throw new BadRequestException('Invalid payment signature');
      }
    }

    const payments = await this.prisma.payment.findMany({
      where: { order_id: data.orderId, franchise_id: resolvedId }
    });

    if (!payments.length) {
      throw new NotFoundException('Payment records not found');
    }

    await this.prisma.$transaction([
      this.prisma.payment.updateMany({
        where: { order_id: data.orderId, franchise_id: resolvedId },
        data: {
          payment_status: 'success',
          transaction_id: data.paymentId,
        }
      }),
      ...payments.map((payment) =>
        this.prisma.enrollment.upsert({
          where: {
            student_id_course_id: {
              student_id: payment.user_id,
              course_id: payment.course_id,
            }
          },
          create: {
            student_id: payment.user_id,
            course_id: payment.course_id,
            franchise_id: resolvedId,
            payment_id: payment.id,
            status: 'active',
            progress_percentage: 0,
          },
          update: {
            status: 'active',
            payment_id: payment.id,
          }
        })
      ),
      ...(payments[0]?.coupon_id ? [
        this.prisma.coupon.update({
          where: { id: payments[0].coupon_id },
          data: { times_used: { increment: 1 } }
        })
      ] : [])
    ]);

    try {
      const user = await this.prisma.user.findUnique({
        where: { id: payments[0].user_id },
        select: { email: true, name: true, franchise_id: true },
      });

      if (user) {
        const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
        const courseIds = payments.map((p) => p.course_id);
        const courses = await this.prisma.course.findMany({
          where: { id: { in: courseIds } },
          select: { title: true },
        });
        const courseTitle = courses.length === 1
          ? courses[0].title
          : `${courses.length} Courses`;

        await this.mailService.sendCoursePurchaseEmail(
          { email: user.email, name: user.name, franchise_id: user.franchise_id },
          courseTitle,
          `₹${totalAmount.toLocaleString('en-IN')}`,
        );
        
        await this.mailService.sendCourseEnrollmentEmail(
          { email: user.email, name: user.name, franchise_id: user.franchise_id },
          courseTitle
        );
      }
    } catch (emailError) {
      console.error('Failed to send purchase confirmation email:', emailError);
    }

    return { success: true };
  }

  async getTransactions(franchiseId: string) {
    const resolvedId = await this.resolveFranchiseId(franchiseId);

    // 1. Fetch actual payment records
    const payments = await this.prisma.payment.findMany({
      where: { franchise_id: resolvedId },
      include: {
        user: { select: { id: true, name: true, email: true, avatar_url: true } },
        course: { select: { title: true } },
      },
      orderBy: { created_at: 'desc' },
    });

    // 2. Find manually enrolled students (have enrollment but NO payment record, with non-zero course price)
    const manualEnrollments = await this.prisma.enrollment.findMany({
      where: {
        OR: [
          { franchise_id: resolvedId },
          { course: { franchise_id: resolvedId } },
        ],
      },
      include: {
        user: { select: { id: true, name: true, email: true, avatar_url: true } },
        course: { select: { id: true, title: true, price: true, is_free: true } },
      },
    });

    // Build set of (user_id, course_id) pairs that already have a payment
    const paidPairs = new Set(payments.map(p => `${p.user_id}_${p.course_id}`));

    // 3. Build virtual "manual enrollment" transactions for those without payments and non-free/zero-price course
    const virtualTransactions = manualEnrollments
      .filter(e => {
        const key = `${e.student_id}_${e.course_id}`;
        // Only include if: no payment exists AND course is NOT free AND course has price > 0
        return !paidPairs.has(key) && !e.course.is_free && (e.course.price ?? 0) > 0;
      })
      .map(e => ({
        id: `manual_${e.id}`,
        user_id: e.student_id,
        course_id: e.course_id,
        amount: e.course.price ?? 0,
        currency: 'INR',
        payment_provider: 'admin_enrolled',
        payment_status: 'success',
        order_id: `ADMIN-ENROLL-${e.id.slice(0, 8).toUpperCase()}`,
        transaction_id: `ADMIN-${e.id.slice(0, 8).toUpperCase()}`,
        billing_name: e.user.name,
        franchise_id: resolvedId,
        coupon_id: null,
        created_at: e.enrolled_at ?? new Date(),
        updated_at: e.enrolled_at ?? new Date(),
        user: { id: e.user.id, name: e.user.name, email: e.user.email, avatar_url: e.user.avatar_url },
        course: { title: e.course.title },
      }));

    // 4. Merge and sort by date descending
    const all = [...payments, ...virtualTransactions];
    all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return all;
  }
}

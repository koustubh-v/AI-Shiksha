import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async submitFeedback(studentId: string, content: string, franchiseId?: string | null) {
    return this.prisma.studentFeedback.create({
      data: {
        student_id: studentId,
        content,
        franchise_id: franchiseId,
      },
    });
  }

  async getAdminFeedback(franchiseId?: string | null) {
    const where: any = {};
    if (franchiseId) {
      where.franchise_id = franchiseId;
    }
    
    return this.prisma.studentFeedback.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar_url: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async updateFeedbackStatus(id: string, status: string, franchiseId?: string | null) {
    const feedback = await this.prisma.studentFeedback.findUnique({ where: { id } });
    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    if (franchiseId && feedback.franchise_id !== franchiseId) {
      throw new ForbiddenException('You do not have access to this feedback record.');
    }

    return this.prisma.studentFeedback.update({
      where: { id },
      data: { status },
    });
  }
}

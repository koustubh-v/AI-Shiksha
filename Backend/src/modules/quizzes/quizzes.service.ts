import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateQuizDto,
  UpdateQuizDto,
  CreateQuizQuestionDto,
  UpdateQuizQuestionDto,
  ReorderQuestionsDto,
  SubmitQuizDto,
} from '../courses/dto/quiz.dto';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) {}

  // ========== QUIZ CRUD ==========

  async createQuiz(itemId: string, dto: CreateQuizDto) {
    // Verify item is a quiz
    const item = await this.prisma.sectionItem.findUnique({
      where: { id: itemId },
    });

    if (!item || item.type !== 'QUIZ') {
      throw new NotFoundException('Quiz item not found');
    }

    return this.prisma.quiz.create({
      data: {
        item_id: itemId,
        ...dto,
      },
      include: {
        questions: {
          orderBy: { order_index: 'asc' },
        },
      },
    });
  }

  async updateQuiz(quizId: string, dto: UpdateQuizDto) {
    return this.prisma.quiz.update({
      where: { id: quizId },
      data: dto,
      include: {
        questions: {
          orderBy: { order_index: 'asc' },
        },
      },
    });
  }

  async getQuiz(quizId: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { order_index: 'asc' },
        },
        item: {
          include: {
            section: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return quiz;
  }

  // ========== QUESTION CRUD ==========

  async addQuestion(quizId: string, dto: CreateQuizQuestionDto) {
    return this.prisma.quizQuestion.create({
      data: {
        quiz_id: quizId,
        ...dto,
        options: dto.options ? JSON.stringify(dto.options) : null,
        correct_answers: dto.correct_answers
          ? JSON.stringify(dto.correct_answers)
          : null,
      },
    });
  }

  async updateQuestion(questionId: string, dto: UpdateQuizQuestionDto) {
    const data: any = { ...dto };

    if (dto.options) {
      data.options = JSON.stringify(dto.options);
    }
    if (dto.correct_answers) {
      data.correct_answers = JSON.stringify(dto.correct_answers);
    }

    return this.prisma.quizQuestion.update({
      where: { id: questionId },
      data,
    });
  }

  async deleteQuestion(questionId: string) {
    return this.prisma.quizQuestion.delete({
      where: { id: questionId },
    });
  }

  async reorderQuestions(dto: ReorderQuestionsDto) {
    await this.prisma.$transaction(
      dto.question_orders.map((order) =>
        this.prisma.quizQuestion.update({
          where: { id: order.id },
          data: { order_index: order.order_index },
        }),
      ),
    );

    return { success: true };
  }

  // ========== QUIZ SUBMISSION & GRADING ==========

  async submitQuiz(quizId: string, studentId: string, dto: SubmitQuizDto) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { order_index: 'asc' },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    // Check attempts limit
    if (quiz.attempts_allowed > 0) {
      const previousAttempts = await this.prisma.quizSubmission.count({
        where: {
          quiz_id: quizId,
          student_id: studentId,
        },
      });

      if (previousAttempts >= quiz.attempts_allowed) {
        throw new BadRequestException('Maximum attempts reached');
      }
    }

    // Auto-grade if enabled
    let score: number | null = null;
    let passed = false;

    if (quiz.auto_grade) {
      const gradeResult = this.gradeQuiz(quiz.questions, dto.answers);
      score = gradeResult.score;
      passed = score >= quiz.passing_score;
    }

    const submission = await this.prisma.quizSubmission.create({
      data: {
        quiz_id: quizId,
        student_id: studentId,
        answers: JSON.stringify(dto.answers),
        score,
        passed,
        time_taken_minutes: dto.time_taken_minutes,
      },
    });

    return {
      ...submission,
      answers: dto.answers,
    };
  }

  private gradeQuiz(questions: any[], studentAnswers: Record<string, any>) {
    let totalPoints = 0;
    let earnedPoints = 0;

    questions.forEach((question) => {
      totalPoints += question.points;

      const studentAnswer = studentAnswers[question.id];
      const correctAnswers = question.correct_answers
        ? JSON.parse(question.correct_answers)
        : [];

      let isCorrect = false;

      switch (question.type) {
        case 'MCQ':
        case 'TRUE_FALSE':
          isCorrect = studentAnswer === correctAnswers[0];
          break;
        case 'MULTIPLE':
          // Check if arrays match
          isCorrect =
            Array.isArray(studentAnswer) &&
            studentAnswer.length === correctAnswers.length &&
            studentAnswer.every((ans: any) => correctAnswers.includes(ans));
          break;
        case 'FILL_BLANK':
          isCorrect = correctAnswers.some(
            (correct: string) =>
              studentAnswer?.toLowerCase().trim() ===
              correct.toLowerCase().trim(),
          );
          break;
        case 'DESCRIPTIVE':
        case 'CODE':
          // These require manual grading
          isCorrect = false;
          break;
      }

      if (isCorrect) {
        earnedPoints += question.points;
      }
    });

    const score =
      totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

    return { score, earnedPoints, totalPoints };
  }

  async getSubmissions(quizId: string, studentId?: string) {
    const where: any = { quiz_id: quizId };
    if (studentId) {
      where.student_id = studentId;
    }

    const submissions = await this.prisma.quizSubmission.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { submitted_at: 'desc' },
    });

    return submissions.map((sub) => ({
      ...sub,
      answers: sub.answers ? JSON.parse(sub.answers) : {},
    }));
  }
}

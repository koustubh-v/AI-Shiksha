import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CompletionsService {
    constructor(private prisma: PrismaService) { }

    // Get all course completions with student and course info
    async findAll(search?: string) {
        const where: any = {
            completed: true,
        };

        // Add search filter if provided
        if (search) {
            where.OR = [
                { user: { name: { contains: search, mode: 'insensitive' } } },
                { user: { email: { contains: search, mode: 'insensitive' } } },
                { course: { title: { contains: search, mode: 'insensitive' } } },
            ];
        }

        const completions = await this.prisma.courseProgress.findMany({
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
                        certificate_enabled: true,
                        certificate_title: true,
                    },
                },
            },
            orderBy: {
                updated_at: 'desc',
            },
        });

        // Enrich with certificate data
        const enriched = await Promise.all(
            completions.map(async (completion) => {
                const certificate = await this.prisma.certificate.findFirst({
                    where: {
                        student_id: completion.student_id,
                        course_id: completion.course_id,
                    },
                });

                return {
                    id: completion.id,
                    student: completion.user,
                    course: completion.course,
                    completed_at: completion.updated_at,
                    progress_percentage: completion.progress_percentage,
                    certificate_issued: !!certificate,
                    certificate_id: certificate?.id,
                    certificate_url: certificate?.certificate_url,
                };
            }),
        );

        return enriched;
    }

    // Get completion statistics
    async getStats() {
        const totalCompletions = await this.prisma.courseProgress.count({
            where: { completed: true },
        });

        const certificatesIssued = await this.prisma.certificate.count();

        // Calculate average score (placeholder - would need quiz/assessment system)
        const avgScore = 86;

        // Completions this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const thisMonth = await this.prisma.courseProgress.count({
            where: {
                completed: true,
                updated_at: {
                    gte: startOfMonth,
                },
            },
        });

        return {
            total_completions: totalCompletions,
            certificates_issued: certificatesIssued,
            avg_score: avgScore,
            this_month: thisMonth,
        };
    }

    // Manually mark course as complete and auto-issue certificate
    async markComplete(studentId: string, courseId: string, adminUserId: string) {
        // Verify student exists
        const student = await this.prisma.user.findUnique({
            where: { id: studentId },
        });

        if (!student) {
            throw new NotFoundException('Student not found');
        }

        // Verify course exists
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            throw new NotFoundException('Course not found');
        }

        // Check if student is enrolled
        const enrollment = await this.prisma.enrollment.findFirst({
            where: {
                student_id: studentId,
                course_id: courseId,
            },
        });

        if (!enrollment) {
            throw new BadRequestException('Student is not enrolled in this course');
        }

        // Update or create course progress
        const progress = await this.prisma.courseProgress.upsert({
            where: {
                student_id_course_id: {
                    student_id: studentId,
                    course_id: courseId,
                },
            },
            update: {
                completed: true,
                progress_percentage: 100,
                updated_at: new Date(),
            },
            create: {
                student_id: studentId,
                course_id: courseId,
                completed: true,
                progress_percentage: 100,
            },
            include: {
                user: true,
                course: true,
            },
        });

        // Auto-issue certificate if enabled

        let certificate: any = null;
        if (course.certificate_enabled) {
            // Check if certificate already exists
            const existingCert = await this.prisma.certificate.findFirst({
                where: {
                    student_id: studentId,
                    course_id: courseId,
                },
            });

            if (!existingCert) {
                certificate = await this.prisma.certificate.create({
                    data: {
                        student_id: studentId,
                        course_id: courseId,
                        issued_at: new Date(),
                        certificate_url: `/api/certificates/${studentId}/${courseId}.pdf`,
                    },
                });
            } else {
                certificate = existingCert;
            }
        }

        return {
            progress,
            certificate,
            message: certificate
                ? 'Course marked as complete and certificate issued'
                : 'Course marked as complete',
        };
    }

    // Issue certificate for a completed course
    async issueCertificate(studentId: string, courseId: string) {
        // Verify completion
        const progress = await this.prisma.courseProgress.findFirst({
            where: {
                student_id: studentId,
                course_id: courseId,
                completed: true,
            },
            include: {
                user: true,
                course: true,
            },
        });

        if (!progress) {
            throw new BadRequestException('Course not completed by this student');
        }

        if (!progress.course.certificate_enabled) {
            throw new BadRequestException('Certificates are not enabled for this course');
        }

        // Check if certificate already exists
        const existing = await this.prisma.certificate.findFirst({
            where: {
                student_id: studentId,
                course_id: courseId,
            },
        });

        if (existing) {
            return {
                certificate: existing,
                message: 'Certificate already issued',
            };
        }

        // Create certificate
        const certificate = await this.prisma.certificate.create({
            data: {
                student_id: studentId,
                course_id: courseId,
                issued_at: new Date(),
                certificate_url: `/api/certificates/${studentId}/${courseId}.pdf`,
            },
        });

        return {
            certificate,
            message: 'Certificate issued successfully',
        };
    }
}

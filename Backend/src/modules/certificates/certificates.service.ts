import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PdfGeneratorService } from './pdf-generator.service';
import { Response } from 'express';

@Injectable()
export class CertificatesService {
    constructor(
        private prisma: PrismaService,
        private pdfGenerator: PdfGeneratorService,
    ) { }

    async getMyCertificates(userId: number, franchiseId?: string) {
        const whereClause: any = {
            student_id: userId.toString(),
        };
        if (franchiseId) {
            whereClause.franchise_id = franchiseId;
        }

        const certificates = await this.prisma.certificate.findMany({
            where: whereClause,
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        thumbnail_url: true,
                        instructor: {
                            select: {
                                user: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                issued_at: 'desc',
            },
        });

        // Format response to match frontend expectations
        return certificates.map((cert) => ({
            id: cert.id,
            courseId: cert.course.id,
            courseName: cert.course.title,
            courseSlug: cert.course.slug,
            instructor: cert.course.instructor.user.name,
            completedDate: cert.issued_at,
            credentialId: cert.certificate_number,
            thumbnail: cert.course.thumbnail_url || 'https://via.placeholder.com/800x600?text=Course',
            issueDate: cert.issued_at,
            certificateUrl: cert.certificate_url,
            qrValidationUrl: cert.qr_validation_url,
            studentName: cert.user.name,
        }));
    }

    async getCertificateById(certificateId: string, userId: number, franchiseId?: string) {
        const whereClause: any = {
            id: certificateId,
            student_id: userId.toString(),
        };
        if (franchiseId) {
            whereClause.franchise_id = franchiseId;
        }

        const certificate = await this.prisma.certificate.findFirst({
            where: whereClause,
            include: {
                course: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        thumbnail_url: true,
                        instructor: {
                            select: {
                                user: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        if (!certificate) {
            return null;
        }

        return {
            id: certificate.id,
            courseId: certificate.course.id,
            courseName: certificate.course.title,
            courseSlug: certificate.course.slug,
            instructor: certificate.course.instructor.user.name,
            completedDate: certificate.issued_at,
            credentialId: certificate.certificate_number,
            thumbnail: certificate.course.thumbnail_url || 'https://via.placeholder.com/800x600?text=Course',
            issueDate: certificate.issued_at,
            certificateUrl: certificate.certificate_url,
            qrValidationUrl: certificate.qr_validation_url,
            studentName: certificate.user.name,
        };
    }

    async downloadCertificateByCourse(courseId: string, userId: string, res: Response, franchiseId?: string) {
        // Find certificate by course and user
        const whereClause: any = {
            course_id: courseId,
            student_id: userId, // userId is string in schema? schema says student_id is String. Controller passes number?
            // Controller passes req.user.userId. In schema User.id is String (uuid).
            // Request.user.userId usually comes from JWT.
            // Let's ensure type safety.
        };

        if (franchiseId) {
            whereClause.OR = [
                { franchise_id: franchiseId },
                { course: { franchise_id: franchiseId } }
            ];
        }

        const certificate = await this.prisma.certificate.findFirst({
            where: whereClause,
            include: {
                course: {
                    select: {
                        title: true,
                    },
                },
                user: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        if (!certificate) {
            throw new NotFoundException('Certificate not found');
        }

        // Generate PDF
        const pdfBuffer = await this.pdfGenerator.generateCertificatePDF(certificate.id);

        // Set response headers
        const filename = `Certificate-${certificate.course.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${certificate.user.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', pdfBuffer.length);

        // Send PDF buffer
        res.send(pdfBuffer);
    }

    async downloadCertificate(certificateId: string, userId: number, res: Response, franchiseId?: string) {
        // Verify ownership
        const whereClause: any = {
            id: certificateId,
            student_id: userId.toString(),
        };
        if (franchiseId) {
            whereClause.franchise_id = franchiseId;
        }

        const certificate = await this.prisma.certificate.findFirst({
            where: whereClause,
            include: {
                course: {
                    select: {
                        title: true,
                    },
                },
                user: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        if (!certificate) {
            return null;
        }

        // Generate PDF
        const pdfBuffer = await this.pdfGenerator.generateCertificatePDF(certificateId);

        // Set response headers for file download
        const filename = `Certificate-${certificate.course.title.replace(/\s+/g, '-')}-${certificate.user.name.replace(/\s+/g, '-')}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Length', pdfBuffer.length);

        // Send PDF buffer
        res.send(pdfBuffer);
    }

    async validateCertificate(userId: string, courseSlug: string, franchiseId?: string) {
        // Find certificate by user ID and course slug
        const whereClause: any = {
            student_id: userId,
            course: {
                slug: courseSlug,
            },
        };
        if (franchiseId) {
            whereClause.OR = [
                { franchise_id: franchiseId },
                { course: { franchise_id: franchiseId } }
            ];
        }

        const certificate = await this.prisma.certificate.findFirst({
            where: whereClause,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                course: {
                    select: {
                        title: true,
                        slug: true,
                        instructor: {
                            select: {
                                user: {
                                    select: {
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!certificate) {
            return null;
        }

        const result = {
            valid: true,
            certificateNumber: certificate.certificate_number,
            studentName: certificate.user.name,
            courseName: certificate.course.title,
            completionDate: certificate.issued_at,
            instructor: certificate.course.instructor.user.name,
            issuedAt: certificate.issued_at,
            totalLearningTime: undefined as number | undefined,
        };

        // Fetch enrollment for total learning time
        const enrollment = await this.prisma.enrollment.findUnique({
            where: {
                student_id_course_id: {
                    student_id: userId,
                    course_id: certificate.course_id, // Accessing via course relation since course_id might not be top level selected
                },
            },
        });

        if (enrollment) {
            result.totalLearningTime = enrollment.total_learning_time;
        }

        return result;
    }
}

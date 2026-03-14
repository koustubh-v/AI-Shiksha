import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCertificateTemplateDto } from './dto/create-certificate-template.dto';
import { UpdateCertificateTemplateDto } from './dto/update-certificate-template.dto';

@Injectable()
export class CertificateTemplatesService {
    constructor(private prisma: PrismaService) { }

    async findAll(franchiseId: string) {
        let templates = await this.prisma.certificateTemplate.findMany({
            where: { franchise_id: franchiseId },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                _count: {
                    select: {
                        courses: true,
                    },
                },
            },
            orderBy: [
                { is_default: 'desc' },
                { created_at: 'desc' },
            ],
        });

        if (templates.length === 0) {
            await this.seedDefaultTemplates(franchiseId);
            templates = await this.prisma.certificateTemplate.findMany({
                where: { franchise_id: franchiseId },
                include: {
                    creator: { select: { id: true, name: true, email: true } },
                    _count: { select: { courses: true } },
                },
                orderBy: [
                    { is_default: 'desc' },
                    { created_at: 'desc' },
                ],
            });
        }

        return templates;
    }

    private async seedDefaultTemplates(franchiseId: string) {
        const defaultTemplates = [
            {
                name: "Classic Elegance",
                description: "A timeless, traditional certificate design with serif typography.",
                is_default: true,
                template_config: {
                    canvas: { width: 800, height: 600, backgroundColor: "#ffffff", orientation: "landscape" },
                    elements: [
                        { id: "t1", type: "text", content: "CERTIFICATE OF COMPLETION", x: 400, y: 120, style: { fontFamily: "serif", fontSize: 42, fontWeight: "bold", textAlign: "center", color: "#1a1a1a" } },
                        { id: "t2", type: "text", content: "THIS IS PROUDLY PRESENTED TO", x: 400, y: 190, style: { fontFamily: "sans-serif", fontSize: 16, color: "#666666", textAlign: "center", fontWeight: "600" } },
                        { id: "v1", type: "variable", content: "{student_name}", x: 400, y: 260, style: { fontFamily: "serif", fontSize: 48, fontWeight: "bold", color: "#d4af37", textAlign: "center", fontStyle: "italic" } },
                        { id: "t3", type: "text", content: "For successfully completing the course", x: 400, y: 340, style: { fontFamily: "sans-serif", fontSize: 16, color: "#666666", textAlign: "center" } },
                        { id: "v2", type: "variable", content: "{course_name}", x: 400, y: 390, style: { fontFamily: "serif", fontSize: 28, fontWeight: "bold", color: "#1a1a1a", textAlign: "center" } },
                        { id: "v3", type: "variable", content: "{issue_date}", x: 200, y: 500, style: { fontFamily: "sans-serif", fontSize: 14, color: "#333333", textAlign: "center", fontWeight: "bold" } },
                        { id: "t4", type: "text", content: "DATE", x: 200, y: 530, style: { fontFamily: "sans-serif", fontSize: 12, color: "#999999", textAlign: "center" } },
                        { id: "t5", type: "text", content: "INSTRUCTOR", x: 600, y: 530, style: { fontFamily: "sans-serif", fontSize: 12, color: "#999999", textAlign: "center" } }
                    ]
                }
            },
            {
                name: "Modern Tech",
                description: "Clean, minimalist design perfect for technology and coding courses.",
                is_default: false,
                template_config: {
                    canvas: { width: 800, height: 600, backgroundColor: "#f8fafc", orientation: "landscape" },
                    elements: [
                        { id: "t1", type: "text", content: "CERTIFIED GRADUATE", x: 400, y: 100, style: { fontFamily: "sans-serif", fontSize: 36, fontWeight: "bold", textAlign: "center", color: "#0f172a", letterSpacing: "4px" } },
                        { id: "t2", type: "text", content: "This certifies that", x: 400, y: 180, style: { fontFamily: "sans-serif", fontSize: 18, color: "#64748b", textAlign: "center" } },
                        { id: "v1", type: "variable", content: "{student_name}", x: 400, y: 250, style: { fontFamily: "sans-serif", fontSize: 42, fontWeight: "bold", color: "#3b82f6", textAlign: "center" } },
                        { id: "t3", type: "text", content: "has successfully mastered the requirements of", x: 400, y: 320, style: { fontFamily: "sans-serif", fontSize: 16, color: "#64748b", textAlign: "center" } },
                        { id: "v2", type: "variable", content: "{course_name}", x: 400, y: 380, style: { fontFamily: "sans-serif", fontSize: 24, fontWeight: "bold", color: "#0f172a", textAlign: "center" } },
                        { id: "t4", type: "text", content: "Date of Issue: ", x: 600, y: 520, style: { fontFamily: "sans-serif", fontSize: 14, color: "#64748b", textAlign: "right" } },
                        { id: "v3", type: "variable", content: "{issue_date}", x: 700, y: 520, style: { fontFamily: "sans-serif", fontSize: 14, color: "#0f172a", textAlign: "left", fontWeight: "bold" } }
                    ]
                }
            },
            {
                name: "Professional Minimalist",
                description: "Sleek and highly professional certificate suitable for business and management.",
                is_default: false,
                template_config: {
                    canvas: { width: 800, height: 600, backgroundColor: "#ffffff", orientation: "landscape" },
                    elements: [
                        { id: "t1", type: "text", content: "CERTIFICATE", x: 400, y: 130, style: { fontFamily: "sans-serif", fontSize: 40, fontWeight: "300", textAlign: "center", color: "#1e293b", letterSpacing: "8px" } },
                        { id: "t2", type: "text", content: "OF ACHIEVEMENT", x: 400, y: 170, style: { fontFamily: "sans-serif", fontSize: 14, fontWeight: "600", color: "#64748b", textAlign: "center", letterSpacing: "4px" } },
                        { id: "t3", type: "text", content: "AWARDED TO", x: 400, y: 240, style: { fontFamily: "sans-serif", fontSize: 12, color: "#94a3b8", textAlign: "center", letterSpacing: "2px" } },
                        { id: "v1", type: "variable", content: "{student_name}", x: 400, y: 300, style: { fontFamily: "serif", fontSize: 40, fontWeight: "normal", color: "#0f172a", textAlign: "center" } },
                        { id: "t4", type: "text", content: "FOR COMPLETING", x: 400, y: 360, style: { fontFamily: "sans-serif", fontSize: 12, color: "#94a3b8", textAlign: "center", letterSpacing: "2px" } },
                        { id: "v2", type: "variable", content: "{course_name}", x: 400, y: 410, style: { fontFamily: "sans-serif", fontSize: 20, fontWeight: "600", color: "#1e293b", textAlign: "center" } },
                        { id: "v3", type: "variable", content: "{issue_date}", x: 400, y: 520, style: { fontFamily: "sans-serif", fontSize: 14, color: "#64748b", textAlign: "center" } }
                    ]
                }
            }
        ];

        for (const template of defaultTemplates) {
            await this.prisma.certificateTemplate.create({
                data: {
                    ...template,
                    // Store as Prisma Json
                    template_config: template.template_config as any,
                    franchise_id: franchiseId
                }
            });
        }
    }

    async findOne(id: string, franchiseId: string) {
        const template = await this.prisma.certificateTemplate.findFirst({
            where: { id, franchise_id: franchiseId },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                courses: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });

        if (!template) {
            throw new NotFoundException('Certificate template not found');
        }

        return template;
    }

    async getDefault(franchiseId: string) {
        const defaultTemplate = await this.prisma.certificateTemplate.findFirst({
            where: { is_default: true, franchise_id: franchiseId },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        if (!defaultTemplate) {
            // Return a basic template if no default is set
            return {
                id: 'default',
                name: 'Default Certificate',
                description: 'Basic certificate template',
                is_default: true,
                template_config: {
                    layout: 'classic',
                    background_color: '#ffffff',
                    border_style: 'double',
                    border_color: '#000000',
                    title_text: 'Certificate of Completion',
                    title_font: 'Georgia',
                    title_color: '#1a1a1a',
                    body_font: 'Arial',
                    body_color: '#333333',
                },
                created_at: new Date(),
                updated_at: new Date(),
            };
        }

        return defaultTemplate;
    }

    async create(dto: CreateCertificateTemplateDto, userId: string, franchiseId: string) {
        // If this is set as default, unset all other defaults for this franchise
        if (dto.is_default) {
            await this.prisma.certificateTemplate.updateMany({
                where: { is_default: true, franchise_id: franchiseId },
                data: { is_default: false },
            });
        }

        return this.prisma.certificateTemplate.create({
            data: {
                name: dto.name,
                description: dto.description,
                template_config: dto.template_config as any,
                preview_image_url: dto.preview_image_url,
                is_default: dto.is_default || false,
                created_by: userId,
                franchise_id: franchiseId,
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async update(id: string, dto: UpdateCertificateTemplateDto, franchiseId: string) {
        const template = await this.findOne(id, franchiseId);

        // If setting as default, unset all other defaults in this franchise
        if (dto.is_default) {
            await this.prisma.certificateTemplate.updateMany({
                where: {
                    id: { not: id },
                    is_default: true,
                    franchise_id: franchiseId
                },
                data: { is_default: false },
            });
        }

        return this.prisma.certificateTemplate.update({
            where: { id: template.id },
            data: {
                name: dto.name,
                description: dto.description,
                template_config: dto.template_config as any,
                preview_image_url: dto.preview_image_url,
                is_default: dto.is_default,
            },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async delete(id: string, franchiseId: string) {
        const template = await this.findOne(id, franchiseId);

        // Check if template is in use
        const coursesUsingTemplate = await this.prisma.course.count({
            where: { certificate_template_id: id, franchise_id: franchiseId },
        });

        if (coursesUsingTemplate > 0) {
            throw new BadRequestException(
                `Cannot delete template: it is currently used by ${coursesUsingTemplate} course(s)`,
            );
        }

        await this.prisma.certificateTemplate.delete({
            where: { id: template.id },
        });

        return { message: 'Template deleted successfully' };
    }

    async setDefault(id: string, franchiseId: string) {
        const template = await this.findOne(id, franchiseId);

        // Unset all other defaults in this franchise
        await this.prisma.certificateTemplate.updateMany({
            where: {
                id: { not: id },
                is_default: true,
                franchise_id: franchiseId
            },
            data: { is_default: false },
        });

        // Set this template as default
        return this.prisma.certificateTemplate.update({
            where: { id: template.id },
            data: { is_default: true },
            include: {
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
}

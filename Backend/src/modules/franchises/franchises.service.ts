import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFranchiseDto } from './dto/create-franchise.dto';
import { UpdateFranchiseDto } from './dto/update-franchise.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class FranchisesService {
    constructor(private prisma: PrismaService) { }

    /**
     * List all franchises (SUPER_ADMIN only)
     */
    async findAll() {
        const franchises = await this.prisma.franchise.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                _count: {
                    select: { users: true, courses: true, enrollments: true },
                },
            },
        });
        return franchises;
    }

    /**
     * Get a single franchise by ID
     */
    async findOne(id: string) {
        const franchise = await this.prisma.franchise.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { users: true, courses: true, enrollments: true },
                },
            },
        });
        if (!franchise) throw new NotFoundException('Franchise not found');
        return franchise;
    }

    /**
     * Get branding info for a given domain (public endpoint)
     */
    async getBrandingByDomain(domain: string) {
        // Normalize domain (strip port for local dev)
        const normalizedDomain = domain.split(':')[0];

        const franchise = await this.prisma.franchise.findFirst({
            where: {
                OR: [
                    { domain: normalizedDomain },
                    { domain: domain },
                ],
                is_active: true,
            },
            select: {
                id: true,
                name: true,
                lms_name: true,
                logo_url: true,
                primary_color: true,
                support_email: true,
                domain_verified: true,
            },
        });

        if (!franchise) {
            // Return default branding if no franchise found
            return {
                id: null,
                name: 'AI Shiksha',
                lms_name: 'AI Shiksha',
                logo_url: null,
                primary_color: '#6366f1',
                support_email: null,
                domain_verified: false,
            };
        }

        return franchise;
    }

    /**
     * Create a new franchise and auto-create its FRANCHISE_ADMIN user
     */
    async create(dto: CreateFranchiseDto) {
        // Check domain uniqueness
        const existing = await this.prisma.franchise.findUnique({
            where: { domain: dto.domain },
        });
        if (existing) {
            throw new ConflictException(`Domain "${dto.domain}" is already registered`);
        }

        // Check admin email uniqueness
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.admin_email },
        });
        if (existingUser) {
            throw new ConflictException(`User with email "${dto.admin_email}" already exists`);
        }

        // Generate a temporary password for the franchise admin
        const tempPassword = this.generateTempPassword();
        const passwordHash = await bcrypt.hash(tempPassword, 10);

        // Create franchise and admin user in a transaction
        const result = await this.prisma.$transaction(async (tx) => {
            // Create franchise
            const franchise = await tx.franchise.create({
                data: {
                    name: dto.name,
                    lms_name: dto.lms_name,
                    domain: dto.domain,
                    logo_url: dto.logo_url,
                    primary_color: dto.primary_color || '#6366f1',
                    support_email: dto.support_email,
                    is_active: true,
                    domain_verified: false,
                },
            });

            // Create franchise admin user
            const adminUser = await tx.user.create({
                data: {
                    name: dto.admin_name,
                    email: dto.admin_email,
                    password_hash: passwordHash,
                    role: 'FRANCHISE_ADMIN',
                    franchise_id: franchise.id,
                },
            });

            return { franchise, adminUser, tempPassword };
        });

        return {
            franchise: result.franchise,
            admin: {
                id: result.adminUser.id,
                name: result.adminUser.name,
                email: result.adminUser.email,
                role: result.adminUser.role,
                temp_password: result.tempPassword,
                message: 'Franchise admin created. Please share the temporary password securely.',
            },
        };
    }

    /**
     * Update franchise details
     */
    async update(id: string, dto: UpdateFranchiseDto) {
        await this.findOne(id); // ensure exists

        if (dto.domain) {
            const existing = await this.prisma.franchise.findFirst({
                where: { domain: dto.domain, NOT: { id } },
            });
            if (existing) {
                throw new ConflictException(`Domain "${dto.domain}" is already taken`);
            }
        }

        return this.prisma.franchise.update({
            where: { id },
            data: dto,
        });
    }

    /**
     * Toggle franchise active status (suspend/activate)
     */
    async toggleSuspend(id: string) {
        const franchise = await this.findOne(id);
        return this.prisma.franchise.update({
            where: { id },
            data: { is_active: !franchise.is_active },
        });
    }

    /**
     * Get stats for a specific franchise (SUPER_ADMIN)
     */
    async getStats(id: string) {
        await this.findOne(id);

        const [userCount, courseCount, enrollmentCount, revenue] = await Promise.all([
            this.prisma.user.count({ where: { franchise_id: id } }),
            this.prisma.course.count({ where: { franchise_id: id } }),
            this.prisma.enrollment.count({ where: { franchise_id: id } }),
            this.prisma.payment.aggregate({
                where: { franchise_id: id, payment_status: 'completed' },
                _sum: { amount: true },
            }),
        ]);

        return {
            users: userCount,
            courses: courseCount,
            enrollments: enrollmentCount,
            revenue: revenue._sum.amount || 0,
        };
    }

    private generateTempPassword(): string {
        const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return password;
    }
}

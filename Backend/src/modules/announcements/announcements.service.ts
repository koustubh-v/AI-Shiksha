import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';

@Injectable()
export class AnnouncementsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, franchiseId: string | null, createAnnouncementDto: CreateAnnouncementDto) {
        return this.prisma.announcement.create({
            data: {
                title: createAnnouncementDto.title,
                content: createAnnouncementDto.content,
                is_active: createAnnouncementDto.is_active ?? true,
                created_by: userId,
                franchise_id: franchiseId,
            },
        });
    }

    async findAllForAdmin(franchiseId: string | null) {
        const whereClause: any = {};
        if (franchiseId) {
            whereClause.franchise_id = franchiseId;
        }

        return this.prisma.announcement.findMany({
            where: whereClause,
            include: {
                author: {
                    select: { name: true, avatar_url: true },
                },
            },
            orderBy: { created_at: 'desc' },
        });
    }

    async findActiveForStudent(franchiseId: string | null) {
        // Provide general announcements (null franchise_id) + student's franchise specific
        return this.prisma.announcement.findMany({
            where: {
                is_active: true,
                OR: [
                    { franchise_id: franchiseId },
                    { franchise_id: null },
                ]
            },
            include: {
                author: {
                    select: { name: true, avatar_url: true },
                },
            },
            orderBy: { created_at: 'desc' },
        });
    }

    async toggleStatus(id: string, franchiseId: string | null) {
        const announcement = await this.prisma.announcement.findUnique({
            where: { id },
        });

        if (!announcement) throw new NotFoundException('Announcement not found');

        if (franchiseId && announcement.franchise_id !== franchiseId) {
            throw new ForbiddenException('Access denied');
        }

        return this.prisma.announcement.update({
            where: { id },
            data: { is_active: !announcement.is_active },
        });
    }

    async remove(id: string, franchiseId: string | null) {
        const announcement = await this.prisma.announcement.findUnique({
            where: { id },
        });

        if (!announcement) throw new NotFoundException('Announcement not found');

        if (franchiseId && announcement.franchise_id !== franchiseId) {
            throw new ForbiddenException('Access denied');
        }

        return this.prisma.announcement.delete({
            where: { id },
        });
    }
}

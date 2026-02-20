import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) { }

  async create(createTagDto: CreateTagDto, franchiseId?: string | null) {
    const slug = createTagDto.name.toLowerCase().replace(/\s+/g, '-');

    // Check if tag with same name exists for this franchise
    const existing = await this.prisma.tag.findFirst({
      where: { slug, franchise_id: franchiseId ?? null },
    });

    if (existing) {
      throw new BadRequestException('Tag with this name already exists');
    }

    return this.prisma.tag.create({
      data: {
        ...createTagDto,
        slug,
        franchise_id: franchiseId ?? null,
      },
    });
  }

  async findAll(franchiseId?: string | null) {
    // Super admin (franchiseId === undefined): sees system tags (franchise_id: null)
    // Franchise admin: sees their franchise's tags
    const where: any = {};
    if (franchiseId !== undefined) {
      where.franchise_id = franchiseId;
    } else {
      where.franchise_id = null;
    }

    return this.prisma.tag.findMany({
      where,
      include: {
        _count: {
          select: { courses: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string, franchiseId?: string | null) {
    const where: any = { id };
    if (franchiseId !== undefined) {
      where.franchise_id = franchiseId;
    }

    const tag = await this.prisma.tag.findFirst({
      where,
      include: {
        courses: {
          include: {
            course: {
              include: {
                instructor: { include: { user: true } },
              },
            },
          },
        },
      },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return tag;
  }

  async remove(id: string, franchiseId?: string | null) {
    const where: any = { id };
    if (franchiseId !== undefined) {
      where.franchise_id = franchiseId;
    }

    const tag = await this.prisma.tag.findFirst({ where });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return this.prisma.tag.delete({
      where: { id },
    });
  }
}

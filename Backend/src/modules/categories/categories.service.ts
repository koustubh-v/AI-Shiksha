import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) { }

  async create(createCategoryDto: CreateCategoryDto, franchiseId?: string | null) {
    const slug = createCategoryDto.name.toLowerCase().replace(/\s+/g, '-');

    // Check if category with same name already exists for this franchise
    const existing = await this.prisma.category.findFirst({
      where: { slug, franchise_id: franchiseId ?? null },
    });

    if (existing) {
      throw new BadRequestException('Category with this name already exists');
    }

    return this.prisma.category.create({
      data: {
        ...createCategoryDto,
        slug,
        franchise_id: franchiseId ?? null,
      },
    });
  }

  async findAll(franchiseId?: string | null) {
    // If franchiseId is provided: show only this franchise's categories
    // If undefined (super admin): show only system categories (franchise_id: null)
    const where: any = {};
    if (franchiseId !== undefined) {
      where.franchise_id = franchiseId;  // shows franchise-specific OR null for system
    } else {
      where.franchise_id = null;  // super admin sees system (global) categories
    }

    return this.prisma.category.findMany({
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

    const category = await this.prisma.category.findFirst({
      where,
      include: {
        courses: {
          include: {
            instructor: { include: { user: true } },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, updateCategoryDto: CreateCategoryDto, franchiseId?: string | null) {
    const where: any = { id };
    if (franchiseId !== undefined) {
      where.franchise_id = franchiseId;
    }

    const category = await this.prisma.category.findFirst({ where });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const slug = updateCategoryDto.name.toLowerCase().replace(/\s+/g, '-');

    return this.prisma.category.update({
      where: { id },
      data: {
        ...updateCategoryDto,
        slug,
      },
    });
  }

  async remove(id: string, franchiseId?: string | null) {
    const where: any = { id };
    if (franchiseId !== undefined) {
      where.franchise_id = franchiseId;
    }

    const category = await this.prisma.category.findFirst({ where });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }
}

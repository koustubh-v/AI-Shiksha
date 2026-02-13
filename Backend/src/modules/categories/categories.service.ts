import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const slug = createCategoryDto.name.toLowerCase().replace(/\s+/g, '-');

    // Check if category with same name exists
    const existing = await (this.prisma as any).category.findUnique({
      where: { slug },
    });

    if (existing) {
      throw new BadRequestException('Category with this name already exists');
    }

    return (this.prisma as any).category.create({
      data: {
        ...createCategoryDto,
        slug,
      },
    });
  }

  async findAll() {
    return (this.prisma as any).category.findMany({
      include: {
        _count: {
          select: { courses: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const category = await (this.prisma as any).category.findUnique({
      where: { id },
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

  async update(id: string, updateCategoryDto: CreateCategoryDto) {
    const category = await (this.prisma as any).category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const slug = updateCategoryDto.name.toLowerCase().replace(/\s+/g, '-');

    return (this.prisma as any).category.update({
      where: { id },
      data: {
        ...updateCategoryDto,
        slug,
      },
    });
  }

  async remove(id: string) {
    const category = await (this.prisma as any).category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return (this.prisma as any).category.delete({
      where: { id },
    });
  }
}

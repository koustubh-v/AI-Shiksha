import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateSectionDto,
  UpdateSectionDto,
  ReorderSectionsDto,
} from '../courses/dto/section.dto';
import {
  CreateSectionItemDto,
  UpdateSectionItemDto,
  ReorderItemsDto,
  CreateLectureContentDto,
  UpdateLectureContentDto,
} from '../courses/dto/section-item.dto';

@Injectable()
export class SectionsService {
  constructor(private prisma: PrismaService) {}

  // ========== SECTION CRUD ==========

  async createSection(courseId: string, dto: CreateSectionDto) {
    return this.prisma.courseSection.create({
      data: {
        course_id: courseId,
        ...dto,
      },
      include: {
        items: {
          orderBy: { order_index: 'asc' },
        },
      },
    });
  }

  async updateSection(sectionId: string, dto: UpdateSectionDto) {
    return this.prisma.courseSection.update({
      where: { id: sectionId },
      data: dto,
      include: {
        items: {
          orderBy: { order_index: 'asc' },
        },
      },
    });
  }

  async deleteSection(sectionId: string) {
    // Cascade delete will handle items
    return this.prisma.courseSection.delete({
      where: { id: sectionId },
    });
  }

  async reorderSections(courseId: string, dto: ReorderSectionsDto) {
    // Update multiple sections with new order
    await this.prisma.$transaction(
      dto.section_orders.map((order) =>
        this.prisma.courseSection.update({
          where: { id: order.id },
          data: { order_index: order.order_index },
        }),
      ),
    );

    return { success: true };
  }

  async getSectionsByCourse(courseId: string) {
    return this.prisma.courseSection.findMany({
      where: { course_id: courseId },
      orderBy: { order_index: 'asc' },
      include: {
        items: {
          orderBy: { order_index: 'asc' },
          include: {
            lecture_content: true,
            quiz: {
              include: {
                questions: {
                  orderBy: { order_index: 'asc' },
                },
              },
            },
            assignment: true,
          },
        },
      },
    });
  }

  // ========== SECTION ITEM CRUD ==========

  async createItem(sectionId: string, dto: CreateSectionItemDto) {
    return this.prisma.sectionItem.create({
      data: {
        section_id: sectionId,
        ...dto,
      },
      include: {
        lecture_content: true,
        quiz: true,
        assignment: true,
      },
    });
  }

  async updateItem(itemId: string, dto: UpdateSectionItemDto) {
    return this.prisma.sectionItem.update({
      where: { id: itemId },
      data: dto,
      include: {
        lecture_content: true,
        quiz: true,
        assignment: true,
      },
    });
  }

  async deleteItem(itemId: string) {
    return this.prisma.sectionItem.delete({
      where: { id: itemId },
    });
  }

  async reorderItems(dto: ReorderItemsDto) {
    await this.prisma.$transaction(
      dto.item_orders.map((order) =>
        this.prisma.sectionItem.update({
          where: { id: order.id },
          data: { order_index: order.order_index },
        }),
      ),
    );

    return { success: true };
  }

  // ========== LECTURE CONTENT CRUD ==========

  async createLectureContent(itemId: string, dto: CreateLectureContentDto) {
    // Verify item is a lecture
    const item = await this.prisma.sectionItem.findUnique({
      where: { id: itemId },
    });

    if (!item || item.type !== 'LECTURE') {
      throw new NotFoundException('Lecture item not found');
    }

    return this.prisma.lectureContent.create({
      data: {
        item_id: itemId,
        ...dto,
        // Convert JSON if needed
        text_content: dto.text_content
          ? JSON.stringify(dto.text_content)
          : null,
      },
    });
  }

  async updateLectureContent(itemId: string, dto: UpdateLectureContentDto) {
    return this.prisma.lectureContent.update({
      where: { item_id: itemId },
      data: {
        ...dto,
        text_content: dto.text_content
          ? JSON.stringify(dto.text_content)
          : undefined,
      },
    });
  }

  async getLectureContent(itemId: string) {
    const content = await this.prisma.lectureContent.findUnique({
      where: { item_id: itemId },
    });

    if (!content) {
      throw new NotFoundException('Lecture content not found');
    }

    // Parse JSON if text_content exists
    if (content.text_content) {
      try {
        (content as any).text_content = JSON.parse(content.text_content);
      } catch (e) {
        // Keep as string if parsing fails
      }
    }

    return content;
  }
}

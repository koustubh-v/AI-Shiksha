import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../enums/role.enum';
import { SectionsService } from './sections.service';
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
import { User } from '../../common/decorators/user.decorator';

@Controller()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SectionsController {
  constructor(private sectionsService: SectionsService) { }

  // ========== SECTIONS ==========

  @Post('courses/:courseId/sections')
  @Roles(Role.INSTRUCTOR, Role.ADMIN, Role.FRANCHISE_ADMIN)
  createSection(
    @Param('courseId') courseId: string,
    @Body() dto: CreateSectionDto,
  ) {
    return this.sectionsService.createSection(courseId, dto);
  }

  @Patch('sections/:sectionId')
  @Roles(Role.INSTRUCTOR, Role.ADMIN, Role.FRANCHISE_ADMIN)
  updateSection(
    @Param('sectionId') sectionId: string,
    @Body() dto: UpdateSectionDto,
  ) {
    return this.sectionsService.updateSection(sectionId, dto);
  }

  @Delete('sections/:sectionId')
  @Roles(Role.INSTRUCTOR, Role.ADMIN, Role.FRANCHISE_ADMIN)
  deleteSection(@Param('sectionId') sectionId: string) {
    return this.sectionsService.deleteSection(sectionId);
  }

  @Post('courses/:courseId/sections/reorder')
  @Roles(Role.INSTRUCTOR, Role.ADMIN, Role.FRANCHISE_ADMIN)
  reorderSections(
    @Param('courseId') courseId: string,
    @Body() dto: ReorderSectionsDto,
  ) {
    return this.sectionsService.reorderSections(courseId, dto);
  }

  @Get('courses/:courseId/sections')
  getSections(@Param('courseId') courseId: string) {
    return this.sectionsService.getSectionsByCourse(courseId);
  }

  // ========== SECTION ITEMS ==========

  @Post('sections/:sectionId/items')
  @Roles(Role.INSTRUCTOR, Role.ADMIN, Role.FRANCHISE_ADMIN)
  createItem(
    @Param('sectionId') sectionId: string,
    @Body() dto: CreateSectionItemDto,
  ) {
    return this.sectionsService.createItem(sectionId, dto);
  }

  @Patch('items/:itemId')
  @Roles(Role.INSTRUCTOR, Role.ADMIN, Role.FRANCHISE_ADMIN)
  updateItem(
    @Param('itemId') itemId: string,
    @Body() dto: UpdateSectionItemDto,
  ) {
    return this.sectionsService.updateItem(itemId, dto);
  }

  @Delete('items/:itemId')
  @Roles(Role.INSTRUCTOR, Role.ADMIN, Role.FRANCHISE_ADMIN)
  deleteItem(@Param('itemId') itemId: string) {
    return this.sectionsService.deleteItem(itemId);
  }

  @Post('items/reorder')
  @Roles(Role.INSTRUCTOR, Role.ADMIN, Role.FRANCHISE_ADMIN)
  reorderItems(@Body() dto: ReorderItemsDto) {
    return this.sectionsService.reorderItems(dto);
  }

  // Get item by slugs (course slug + lesson slug) - for SEO-friendly URLs
  @Get('courses/:courseSlug/lessons/:lessonSlug')
  getItemBySlug(
    @Param('courseSlug') courseSlug: string,
    @Param('lessonSlug') lessonSlug: string,
    @User() user: any,
  ) {
    return this.sectionsService.findItemBySlug(courseSlug, lessonSlug, user?.userId);
  }

  // ========== LECTURE CONTENT ==========

  @Post('items/:itemId/content')
  @Roles(Role.INSTRUCTOR, Role.ADMIN, Role.FRANCHISE_ADMIN)
  createLectureContent(
    @Param('itemId') itemId: string,
    @Body() dto: CreateLectureContentDto,
  ) {
    return this.sectionsService.createLectureContent(itemId, dto);
  }

  @Patch('items/:itemId/content')
  @Roles(Role.INSTRUCTOR, Role.ADMIN, Role.FRANCHISE_ADMIN)
  updateLectureContent(
    @Param('itemId') itemId: string,
    @Body() dto: UpdateLectureContentDto,
  ) {
    return this.sectionsService.updateLectureContent(itemId, dto);
  }

  @Get('items/:itemId/content')
  getLectureContent(@Param('itemId') itemId: string) {
    return this.sectionsService.getLectureContent(itemId);
  }
}

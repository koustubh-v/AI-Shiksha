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

@Controller()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SectionsController {
  constructor(private sectionsService: SectionsService) { }

  // ========== SECTIONS ==========

  @Post('courses/:courseId/sections')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  createSection(
    @Param('courseId') courseId: string,
    @Body() dto: CreateSectionDto,
  ) {
    return this.sectionsService.createSection(courseId, dto);
  }

  @Patch('sections/:sectionId')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  updateSection(
    @Param('sectionId') sectionId: string,
    @Body() dto: UpdateSectionDto,
  ) {
    return this.sectionsService.updateSection(sectionId, dto);
  }

  @Delete('sections/:sectionId')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  deleteSection(@Param('sectionId') sectionId: string) {
    return this.sectionsService.deleteSection(sectionId);
  }

  @Post('courses/:courseId/sections/reorder')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
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
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  createItem(
    @Param('sectionId') sectionId: string,
    @Body() dto: CreateSectionItemDto,
  ) {
    return this.sectionsService.createItem(sectionId, dto);
  }

  @Patch('items/:itemId')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  updateItem(
    @Param('itemId') itemId: string,
    @Body() dto: UpdateSectionItemDto,
  ) {
    return this.sectionsService.updateItem(itemId, dto);
  }

  @Delete('items/:itemId')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  deleteItem(@Param('itemId') itemId: string) {
    return this.sectionsService.deleteItem(itemId);
  }

  @Post('items/reorder')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  reorderItems(@Body() dto: ReorderItemsDto) {
    return this.sectionsService.reorderItems(dto);
  }

  // ========== LECTURE CONTENT ==========

  @Post('items/:itemId/content')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  createLectureContent(
    @Param('itemId') itemId: string,
    @Body() dto: CreateLectureContentDto,
  ) {
    return this.sectionsService.createLectureContent(itemId, dto);
  }

  @Patch('items/:itemId/content')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
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

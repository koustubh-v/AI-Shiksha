import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../enums/role.enum';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.INSTRUCTOR, Role.ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new course' })
  create(@Request() req, @Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.create(req.user.userId, createCourseDto, req.user.franchise_id);
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.INSTRUCTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List instructor courses' })
  findMyCourses(@Request() req) {
    return this.coursesService.findMyCourses(req.user.userId, req.user.franchise_id);
  }

  @Get('admin/all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all courses (Admin)' })
  findAllAdmin(@Request() req) {
    return this.coursesService.findAll(true, req.user.franchise_id);
  }

  @Get()
  @ApiOperation({ summary: 'List all published courses' })
  findAll(@Request() req) {
    // For public access, we might need tenant context from middleware if not logged in
    // TenantMiddleware injects franchiseId into request object directly
    const franchiseId = req.user?.franchise_id || req['franchise_id'];
    return this.coursesService.findAll(false, franchiseId);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get course by slug (published only)' })
  findBySlug(@Param('slug') slug: string, @Request() req) {
    const franchiseId = req.user?.franchise_id || req['franchise_id'];
    return this.coursesService.findBySlug(slug, franchiseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course details' })
  findOne(@Param('id') id: string, @Request() req) {
    const franchiseId = req.user?.franchise_id || req['franchise_id'];
    return this.coursesService.findOne(id, franchiseId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update course' })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(
      id,
      updateCourseDto,
      req.user.userId,
      req.user.role,
      req.user.franchise_id
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete course' })
  remove(@Request() req, @Param('id') id: string) {
    return this.coursesService.remove(id, req.user.userId, req.user.franchise_id);
  }

  // ========== APPROVAL WORKFLOW ==========

  @Post(':id/submit-approval')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.INSTRUCTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit course for admin approval' })
  submitForApproval(@Request() req, @Param('id') id: string) {
    return this.coursesService.submitForApproval(id, req.user.userId, req.user.franchise_id);
  }

  @Post(':id/approve')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Approve course (Admin only)' })
  approveCourse(@Request() req, @Param('id') id: string) {
    return this.coursesService.approveCourse(id, req.user.userId, req.user.franchise_id);
  }

  @Post(':id/reject')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject course with feedback (Admin only)' })
  rejectCourse(
    @Request() req,
    @Param('id') id: string,
    @Body() body: { rejection_reason: string },
  ) {
    return this.coursesService.rejectCourse(
      id,
      req.user.userId,
      body.rejection_reason,
      req.user.franchise_id
    );
  }

  @Post(':id/publish')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish course' })
  publishCourse(@Request() req, @Param('id') id: string) {
    return this.coursesService.publishCourse(id, req.user.userId, req.user.franchise_id);
  }

  @Get('pending-approval/list')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get courses pending approval (Admin only)' })
  getPendingApproval(@Request() req) {
    return this.coursesService.getPendingApproval(req.user.franchise_id);
  }
}


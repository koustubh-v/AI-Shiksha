import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../enums/role.enum';

@ApiTags('Enrollments')
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) { }

  // Student endpoints
  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my enrollments' })
  findMyEnrollments(@Request() req) {
    return this.enrollmentsService.findMyEnrollments(req.user.userId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enroll in a course' })
  create(@Request() req, @Body('courseId') courseId: string) {
    return this.enrollmentsService.create(req.user.userId, courseId);
  }

  @Get(':courseId/check')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if enrolled in a course' })
  check(@Request() req, @Param('courseId') courseId: string) {
    return this.enrollmentsService.checkEnrollment(req.user.userId, courseId);
  }

  // Admin endpoints
  @Get('stats')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get enrollment statistics (Admin only)' })
  getStats() {
    return this.enrollmentsService.getStats();
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all enrollments (Admin only)' })
  findAll(@Query('search') search?: string, @Query('status') status?: string) {
    return this.enrollmentsService.findAll(search, status);
  }

  @Post('admin/enroll')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Manually enroll a student (Admin only)' })
  adminEnroll(
    @Body('studentEmail') studentEmail: string,
    @Body('courseId') courseId: string,
  ) {
    return this.enrollmentsService.adminEnroll(studentEmail, courseId);
  }

  @Post('admin/bulk-enroll')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk enroll students in courses (Admin only)' })
  bulkEnroll(
    @Body('studentIds') studentIds: string[],
    @Body('courseIds') courseIds: string[],
  ) {
    return this.enrollmentsService.bulkEnroll(studentIds, courseIds);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update enrollment status (Admin only)' })
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.enrollmentsService.updateStatus(id, status);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete enrollment (Admin only)' })
  remove(@Param('id') id: string) {
    return this.enrollmentsService.remove(id);
  }

  // Course completion management endpoints
  // IMPORTANT: These specific routes must come BEFORE parameterized routes
  @Get('course/:courseId/students')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all students enrolled in a course with progress (Admin/Instructor only)' })
  getCourseStudents(@Param('courseId') courseId: string) {
    return this.enrollmentsService.getCourseStudents(courseId);
  }

  @Post('bulk-complete')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark multiple enrollments as complete (Admin only)' })
  bulkComplete(@Body() dto: any) {
    return this.enrollmentsService.bulkComplete(dto);
  }

  @Post(':enrollmentId/complete')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Manually mark an enrollment as complete (Admin only)' })
  manualComplete(
    @Param('enrollmentId') enrollmentId: string,
    @Body() dto: any,
  ) {
    return this.enrollmentsService.manualComplete(enrollmentId, dto);
  }

  @Patch(':enrollmentId/completion-date')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update completion date for an enrollment (Admin only)' })
  updateCompletionDate(
    @Param('enrollmentId') enrollmentId: string,
    @Body() dto: any,
  ) {
    return this.enrollmentsService.updateCompletionDate(enrollmentId, dto);
  }

  @Post('admin/bulk-update-dates')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk update enrollment and completion dates (Admin only)' })
  bulkUpdateDates(@Body() dto: any) {
    return this.enrollmentsService.bulkUpdateDates(dto);
  }

  @Post('admin/bulk-incomplete')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk mark enrollments as incomplete and reset progress (Admin only)' })
  bulkIncomplete(@Body() dto: any) {
    return this.enrollmentsService.bulkIncomplete(dto);
  }
}

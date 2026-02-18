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
    return this.enrollmentsService.findMyEnrollments(req.user.userId, req.user.franchise_id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enroll in a course' })
  create(@Request() req, @Body('courseId') courseId: string) {
    return this.enrollmentsService.create(req.user.userId, courseId, req.user.franchise_id);
  }

  @Get(':courseId/check')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if enrolled in a course' })
  check(@Request() req, @Param('courseId') courseId: string) {
    // Check implies existing enrollment, no strict franchise check needed here usually, but good to be safe
    return this.enrollmentsService.checkEnrollment(req.user.userId, courseId);
  }

  @Post(':courseId/accept-terms')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accept terms and conditions for a course' })
  acceptTerms(@Request() req, @Param('courseId') courseId: string) {
    return this.enrollmentsService.acceptTerms(req.user.userId, courseId);
  }

  // Admin endpoints
  @Get('stats')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get enrollment statistics (Admin only)' })
  getStats(@Request() req) {
    return this.enrollmentsService.getStats(req.user.franchise_id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all enrollments (Admin only)' })
  findAll(@Request() req, @Query('search') search?: string, @Query('status') status?: string) {
    return this.enrollmentsService.findAll(search, status, req.user.franchise_id);
  }

  @Post('admin/enroll')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Manually enroll a student (Admin only)' })
  adminEnroll(
    @Request() req,
    @Body('studentEmail') studentEmail: string,
    @Body('courseId') courseId: string,
  ) {
    return this.enrollmentsService.adminEnroll(studentEmail, courseId, req.user.franchise_id);
  }

  @Post('admin/bulk-enroll')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk enroll students in courses (Admin only)' })
  bulkEnroll(
    @Request() req,
    @Body('studentIds') studentIds: string[],
    @Body('courseIds') courseIds: string[],
  ) {
    return this.enrollmentsService.bulkEnroll(studentIds, courseIds, req.user.franchise_id);
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update enrollment status (Admin only)' })
  updateStatus(@Request() req, @Param('id') id: string, @Body('status') status: string) {
    return this.enrollmentsService.updateStatus(id, status, req.user.franchise_id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete enrollment (Admin only)' })
  remove(@Request() req, @Param('id') id: string) {
    return this.enrollmentsService.remove(id, req.user.franchise_id);
  }

  // Course completion management endpoints
  // IMPORTANT: These specific routes must come BEFORE parameterized routes
  @Get('course/:courseId/students')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.INSTRUCTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all students enrolled in a course with progress (Admin/Instructor only)' })
  getCourseStudents(@Request() req, @Param('courseId') courseId: string) {
    return this.enrollmentsService.getCourseStudents(courseId, req.user.franchise_id);
  }

  @Post('bulk-complete')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark multiple enrollments as complete (Admin only)' })
  bulkComplete(@Request() req, @Body() dto: any) {
    return this.enrollmentsService.bulkComplete(dto, req.user.franchise_id);
  }

  @Post(':enrollmentId/complete')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Manually mark an enrollment as complete (Admin only)' })
  manualComplete(
    @Request() req,
    @Param('enrollmentId') enrollmentId: string,
    @Body() dto: any,
  ) {
    return this.enrollmentsService.manualComplete(enrollmentId, dto, req.user.franchise_id);
  }

  @Patch(':enrollmentId/completion-date')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update completion date for an enrollment (Admin only)' })
  updateCompletionDate(
    @Request() req,
    @Param('enrollmentId') enrollmentId: string,
    @Body() dto: any,
  ) {
    return this.enrollmentsService.updateCompletionDate(enrollmentId, dto, req.user.franchise_id);
  }

  @Post('admin/bulk-update-dates')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk update enrollment and completion dates (Admin only)' })
  bulkUpdateDates(@Request() req, @Body() dto: any) {
    return this.enrollmentsService.bulkUpdateDates(dto, req.user.franchise_id);
  }

  @Post('admin/bulk-incomplete')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk mark enrollments as incomplete and reset progress (Admin only)' })
  bulkIncomplete(@Request() req, @Body() dto: any) {
    return this.enrollmentsService.bulkIncomplete(dto, req.user.franchise_id);
  }
}

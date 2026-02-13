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
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

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
}

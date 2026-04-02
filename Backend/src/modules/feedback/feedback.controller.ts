import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../enums/role.enum';
import { FeedbackService } from './feedback.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Feedback')
@Controller('feedback')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  @Roles(Role.STUDENT, Role.ADMIN, Role.INSTRUCTOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit feedback (Student)' })
  submitFeedback(@Request() req, @Body('content') content: string) {
    return this.feedbackService.submitFeedback(
      req.user.userId,
      content,
      req.user.franchise_id,
    );
  }

  @Get('admin')
  @Roles(Role.ADMIN, Role.FRANCHISE_ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all feedback (Admin)' })
  getAdminFeedback(@Request() req) {
    const isSuperAdmin = req.user?.role === Role.SUPER_ADMIN;
    const franchiseId = isSuperAdmin ? undefined : (req.user?.franchise_id || null);
    return this.feedbackService.getAdminFeedback(franchiseId);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.FRANCHISE_ADMIN, Role.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update feedback status (Admin)' })
  updateFeedbackStatus(
    @Request() req,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    const isSuperAdmin = req.user?.role === Role.SUPER_ADMIN;
    const franchiseId = isSuperAdmin ? undefined : (req.user?.franchise_id || null);
    return this.feedbackService.updateFeedbackStatus(id, status, franchiseId);
  }
}

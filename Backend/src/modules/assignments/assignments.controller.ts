import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../enums/role.enum';
import { AssignmentsService } from './assignments.service';
import {
  CreateAssignmentDto,
  UpdateAssignmentDto,
  SubmitAssignmentDto,
  GradeAssignmentDto,
} from '../courses/dto/assignment.dto';

@Controller()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class AssignmentsController {
  constructor(private assignmentsService: AssignmentsService) {}

  // ========== ASSIGNMENT CRUD ==========

  @Post('items/:itemId/assignment')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  createAssignment(
    @Param('itemId') itemId: string,
    @Body() dto: CreateAssignmentDto,
  ) {
    return this.assignmentsService.createAssignment(itemId, dto);
  }

  @Patch('assignments/:assignmentId')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  updateAssignment(
    @Param('assignmentId') assignmentId: string,
    @Body() dto: UpdateAssignmentDto,
  ) {
    return this.assignmentsService.updateAssignment(assignmentId, dto);
  }

  @Get('assignments/:assignmentId')
  getAssignment(@Param('assignmentId') assignmentId: string) {
    return this.assignmentsService.getAssignment(assignmentId);
  }

  // ========== ASSIGNMENT SUBMISSIONS ==========

  @Post('assignments/:assignmentId/submit')
  @Roles(Role.STUDENT)
  submitAssignment(
    @Request() req,
    @Param('assignmentId') assignmentId: string,
    @Body() dto: SubmitAssignmentDto,
  ) {
    return this.assignmentsService.submitAssignment(
      assignmentId,
      req.user.userId,
      dto,
    );
  }

  @Post('submissions/:submissionId/grade')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  gradeSubmission(
    @Request() req,
    @Param('submissionId') submissionId: string,
    @Body() dto: GradeAssignmentDto,
  ) {
    return this.assignmentsService.gradeSubmission(
      submissionId,
      req.user.userId,
      dto,
    );
  }

  @Get('assignments/:assignmentId/submissions')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  getSubmissions(@Param('assignmentId') assignmentId: string) {
    return this.assignmentsService.getSubmissions(assignmentId);
  }

  @Get('assignments/:assignmentId/my-submissions')
  @Roles(Role.STUDENT)
  getMySubmissions(
    @Request() req,
    @Param('assignmentId') assignmentId: string,
  ) {
    return this.assignmentsService.getSubmissions(
      assignmentId,
      req.user.userId,
    );
  }

  @Get('submissions/:submissionId')
  getSubmission(@Param('submissionId') submissionId: string) {
    return this.assignmentsService.getSubmission(submissionId);
  }
}

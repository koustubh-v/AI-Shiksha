import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../enums/role.enum';
import { QuizzesService } from './quizzes.service';
import {
  CreateQuizDto,
  UpdateQuizDto,
  CreateQuizQuestionDto,
  UpdateQuizQuestionDto,
  ReorderQuestionsDto,
  SubmitQuizDto,
} from '../courses/dto/quiz.dto';

@Controller()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class QuizzesController {
  constructor(private quizzesService: QuizzesService) {}

  // ========== QUIZ CRUD ==========

  @Post('items/:itemId/quiz')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  createQuiz(@Param('itemId') itemId: string, @Body() dto: CreateQuizDto) {
    return this.quizzesService.createQuiz(itemId, dto);
  }

  @Patch('quizzes/:quizId')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  updateQuiz(@Param('quizId') quizId: string, @Body() dto: UpdateQuizDto) {
    return this.quizzesService.updateQuiz(quizId, dto);
  }

  @Get('quizzes/:quizId')
  getQuiz(@Param('quizId') quizId: string) {
    return this.quizzesService.getQuiz(quizId);
  }

  // ========== QUESTION CRUD ==========

  @Post('quizzes/:quizId/questions')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  addQuestion(
    @Param('quizId') quizId: string,
    @Body() dto: CreateQuizQuestionDto,
  ) {
    return this.quizzesService.addQuestion(quizId, dto);
  }

  @Patch('questions/:questionId')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  updateQuestion(
    @Param('questionId') questionId: string,
    @Body() dto: UpdateQuizQuestionDto,
  ) {
    return this.quizzesService.updateQuestion(questionId, dto);
  }

  @Delete('questions/:questionId')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  deleteQuestion(@Param('questionId') questionId: string) {
    return this.quizzesService.deleteQuestion(questionId);
  }

  @Post('quizzes/:quizId/questions/reorder')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  reorderQuestions(@Body() dto: ReorderQuestionsDto) {
    return this.quizzesService.reorderQuestions(dto);
  }

  // ========== QUIZ SUBMISSION ==========

  @Post('quizzes/:quizId/submit')
  @Roles(Role.STUDENT)
  submitQuiz(
    @Request() req,
    @Param('quizId') quizId: string,
    @Body() dto: SubmitQuizDto,
  ) {
    return this.quizzesService.submitQuiz(quizId, req.user.userId, dto);
  }

  @Get('quizzes/:quizId/submissions')
  @Roles(Role.INSTRUCTOR, Role.ADMIN)
  getSubmissions(@Param('quizId') quizId: string) {
    return this.quizzesService.getSubmissions(quizId);
  }

  @Get('quizzes/:quizId/my-submissions')
  @Roles(Role.STUDENT)
  getMySubmissions(@Request() req, @Param('quizId') quizId: string) {
    return this.quizzesService.getSubmissions(quizId, req.user.userId);
  }
}

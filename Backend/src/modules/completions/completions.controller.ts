import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { CompletionsService } from './completions.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../enums/role.enum';

@ApiTags('completions')
@Controller('completions')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class CompletionsController {
    constructor(private readonly completionsService: CompletionsService) { }

    @Get()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get all course completions (Admin only)' })
    @ApiQuery({ name: 'search', required: false, type: String })
    async findAll(@Query('search') search?: string) {
        return this.completionsService.findAll(search);
    }

    @Get('stats')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get completion statistics (Admin only)' })
    async getStats() {
        return this.completionsService.getStats();
    }

    @Post('manual')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Manually mark course as complete and auto-issue certificate (Admin only)' })
    async markComplete(
        @Body('student_id') studentId: string,
        @Body('course_id') courseId: string,
        @Request() req: any,
    ) {
        return this.completionsService.markComplete(studentId, courseId, req.user.id);
    }

    @Post('issue-certificate')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Issue certificate for completed course (Admin only)' })
    async issueCertificate(
        @Body('student_id') studentId: string,
        @Body('course_id') courseId: string,
    ) {
        return this.completionsService.issueCertificate(studentId, courseId);
    }
}

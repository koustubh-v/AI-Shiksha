import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../enums/role.enum';
import { ReportsService } from './reports.service';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('reports')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN, Role.FRANCHISE_ADMIN, Role.SUPER_ADMIN)
export class ReportsController {
  constructor(
    private readonly reportsService: ReportsService,
    private readonly prisma: PrismaService,
  ) {}

  private async resolveFranchiseId(req: any): Promise<string | undefined> {
    const user = req.user;
    // Super admin with no franchise_id sees their master franchise only (not all)
    const fId = user?.franchise_id || req.tenantId || req.tenantBranding?.id;
    if (!fId && user?.role === 'SUPER_ADMIN') {
      // Resolve master franchise (first in DB)
      const first = await this.prisma.franchise.findFirst({ orderBy: { created_at: 'asc' } });
      return first?.id;
    }
    return fId;
  }

  @Get('students')
  async getStudentReport(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('courseId') courseId?: string,
  ) {
    const franchiseId = await this.resolveFranchiseId(req);
    return this.reportsService.getStudentReport(franchiseId, startDate, endDate, courseId);
  }

  @Get('courses')
  async getCourseReport(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('courseId') courseId?: string,
  ) {
    const franchiseId = await this.resolveFranchiseId(req);
    return this.reportsService.getCourseReport(franchiseId, startDate, endDate, courseId);
  }

  @Get('assessments')
  async getAssessmentReport(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('courseId') courseId?: string,
  ) {
    const franchiseId = await this.resolveFranchiseId(req);
    return this.reportsService.getAssessmentReport(franchiseId, startDate, endDate, courseId);
  }

  @Get('revenue')
  async getRevenueReport(
    @Request() req,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('courseId') courseId?: string,
    @Query('paymentMethod') paymentMethod?: string,
  ) {
    const franchiseId = await this.resolveFranchiseId(req);
    return this.reportsService.getRevenueReport(
      franchiseId,
      startDate,
      endDate,
      courseId,
      paymentMethod,
    );
  }
}

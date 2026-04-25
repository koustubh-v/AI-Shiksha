import { Controller, Get, Put, Body, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../enums/role.enum';
import { UpdateAiSettingsDto } from './dto/update-ai-settings.dto';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN, Role.FRANCHISE_ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  private async resolveFranchiseId(req: any) {
    let franchiseId = req.user?.franchise_id || req.tenantId || req.tenantBranding?.id;
    if (!franchiseId) {
      const defaultFranchise = await this.adminService.getFirstFranchise();
      if (defaultFranchise) {
        franchiseId = defaultFranchise.id;
      }
    }
    return franchiseId;
  }

  @Get('stats')
  async getStats(@Request() req) {
    const franchiseId = await this.resolveFranchiseId(req);
    return this.adminService.getPlatformStats(franchiseId);
  }

  @Get('analytics/user-growth')
  async getUserGrowth(@Request() req) {
    const franchiseId = await this.resolveFranchiseId(req);
    return this.adminService.getUserGrowth(franchiseId);
  }

  @Get('analytics/revenue')
  async getRevenue(@Request() req) {
    const franchiseId = await this.resolveFranchiseId(req);
    return this.adminService.getRevenueData(franchiseId);
  }

  @Get('pending-actions')
  async getPendingActions(@Request() req) {
    const franchiseId = await this.resolveFranchiseId(req);
    return this.adminService.getPendingActions(franchiseId);
  }

  @Get('ai-settings')
  async getAiSettings(@Request() req) {
    const isSuperAdmin = req.user?.role === Role.SUPER_ADMIN;
    let franchiseId = isSuperAdmin ? undefined : (req.user?.franchise_id || undefined);

    // Fallback to tenantId from middleware if no explicit franchise is set on user
    franchiseId = franchiseId || req.tenantId || req.tenantBranding?.id;

    if (!franchiseId) {
      const defaultFranchise = await this.adminService.getFirstFranchise();
      if (defaultFranchise) {
        franchiseId = defaultFranchise.id;
      }
    }

    return this.adminService.getAiSettings(franchiseId);
  }

  @Put('ai-settings')
  async updateAiSettings(@Request() req, @Body() updateAiSettingsDto: UpdateAiSettingsDto) {
    const isSuperAdmin = req.user?.role === Role.SUPER_ADMIN;
    let franchiseId = isSuperAdmin ? undefined : (req.user?.franchise_id || undefined);

    franchiseId = franchiseId || req.tenantId || req.tenantBranding?.id;

    if (!franchiseId) {
      // Fallback to the first franchise (usually the master franchise) for local/super admin context
      const defaultFranchise = await this.adminService.getFirstFranchise();
      if (defaultFranchise) {
          franchiseId = defaultFranchise.id;
      } else {
          throw new BadRequestException('Cannot update AI settings without a franchise context.');
      }
    }

    return this.adminService.updateAiSettings(
      franchiseId,
      updateAiSettingsDto.gemini_api_key,
      updateAiSettingsDto.global_ai_control
    );
  }
}



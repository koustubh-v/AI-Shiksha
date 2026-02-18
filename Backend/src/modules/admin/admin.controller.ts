import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../enums/role.enum';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN, Role.FRANCHISE_ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get('stats')
  getStats(@Request() req) {
    const isSuperAdmin = req.user?.role === Role.SUPER_ADMIN;
    const franchiseId = isSuperAdmin ? undefined : (req.user?.franchise_id || undefined);
    return this.adminService.getPlatformStats(franchiseId);
  }

  @Get('analytics/user-growth')
  getUserGrowth(@Request() req) {
    const isSuperAdmin = req.user?.role === Role.SUPER_ADMIN;
    const franchiseId = isSuperAdmin ? undefined : (req.user?.franchise_id || undefined);
    return this.adminService.getUserGrowth(franchiseId);
  }

  @Get('analytics/revenue')
  getRevenue(@Request() req) {
    const isSuperAdmin = req.user?.role === Role.SUPER_ADMIN;
    const franchiseId = isSuperAdmin ? undefined : (req.user?.franchise_id || undefined);
    return this.adminService.getRevenueData(franchiseId);
  }

  @Get('pending-actions')
  getPendingActions(@Request() req) {
    const isSuperAdmin = req.user?.role === Role.SUPER_ADMIN;
    const franchiseId = isSuperAdmin ? undefined : (req.user?.franchise_id || undefined);
    return this.adminService.getPendingActions(franchiseId);
  }
}



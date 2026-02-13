import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../enums/role.enum';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getStats() {
    return this.adminService.getPlatformStats();
  }

  @Get('analytics/user-growth')
  getUserGrowth() {
    return this.adminService.getUserGrowth();
  }

  @Get('analytics/revenue')
  getRevenue() {
    return this.adminService.getRevenueData();
  }

  @Get('pending-actions')
  getPendingActions() {
    return this.adminService.getPendingActions();
  }
}

import { Controller, Get, Put, Body, Req, UseGuards } from '@nestjs/common';
import { FooterSettingsService } from './footer-settings.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../enums/role.enum';

@Controller('footer-settings')
export class FooterSettingsController {
  constructor(private readonly footerSettingsService: FooterSettingsService) {}

  @Get()
  async getFooterSettings(@Req() req) {
    const franchiseId = (req as any).tenantId || (req as any).tenantBranding?.id;
    return this.footerSettingsService.getSettings(franchiseId);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.FRANCHISE_ADMIN)
  async updateFooterSettings(@Body() body: any, @Req() req) {
    const franchiseId = req.user.franchise_id || (req as any).tenantId || (req as any).tenantBranding?.id;
    return this.footerSettingsService.updateSettings(franchiseId, body);
  }
}

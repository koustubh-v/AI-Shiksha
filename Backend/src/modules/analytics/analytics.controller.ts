import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../enums/role.enum';
import { AnalyticsService } from './analytics.service';
import { PrismaService } from '../../prisma/prisma.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly prisma: PrismaService,
  ) {}

  private async resolveFranchiseId(req: any): Promise<string> {
    const user = req.user;
    const fId = user?.franchise_id || req.tenantId || req.tenantBranding?.id;
    if (!fId) {
      const first = await this.prisma.franchise.findFirst({ orderBy: { created_at: 'asc' } });
      return first?.id || '';
    }
    return fId;
  }

  // ── OAuth: Start flow (returns redirect URL) ──
  @Get('auth/google')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.FRANCHISE_ADMIN, Role.SUPER_ADMIN)
  async startOAuth(@Request() req, @Query('returnUrl') returnUrl: string) {
    const franchiseId = await this.resolveFranchiseId(req);
    const frontendOrigin = returnUrl || process.env.FRONTEND_URL || 'https://iconsafetyinstitute.com';
    const url = await this.analyticsService.getOAuthUrl(franchiseId, frontendOrigin);
    return { url };
  }

  // ── Super Admin Config ──
  @Get('config')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getConfig() {
    return this.analyticsService.getOAuthCredentials();
  }

  @Post('config')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async saveConfig(@Body() body: { clientId: string; clientSecret: string }) {
    return this.analyticsService.saveOAuthCredentials(body.clientId, body.clientSecret);
  }

  // ── OAuth: Callback (no JWT — called by Google) ──
  @Get('auth/callback')
  async oauthCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    try {
      const { redirectUrl } = await this.analyticsService.handleOAuthCallback(code, state);
      return res.redirect(redirectUrl);
    } catch (err: any) {
      const frontendUrl = err?.origin || process.env.FRONTEND_URL || 'https://iconsafetyinstitute.com';
      return res.redirect(`${frontendUrl}/admin/analytics?error=oauth_failed`);
    }
  }

  // ── List GA4 Properties ──
  @Get('properties')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.FRANCHISE_ADMIN, Role.SUPER_ADMIN)
  async listProperties(@Request() req) {
    const franchiseId = await this.resolveFranchiseId(req);
    return this.analyticsService.listProperties(franchiseId);
  }

  // ── Save selected property ──
  @Post('connect')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.FRANCHISE_ADMIN, Role.SUPER_ADMIN)
  async connectProperty(
    @Request() req,
    @Body() body: { propertyId: string; propertyName: string },
  ) {
    const franchiseId = await this.resolveFranchiseId(req);
    return this.analyticsService.connectProperty(
      franchiseId,
      body.propertyId,
      body.propertyName,
    );
  }

  // ── Connection status ──
  @Get('status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.FRANCHISE_ADMIN, Role.SUPER_ADMIN)
  async getStatus(@Request() req) {
    const franchiseId = await this.resolveFranchiseId(req);
    return this.analyticsService.getStatus(franchiseId);
  }

  // ── Disconnect ──
  @Delete('disconnect')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.FRANCHISE_ADMIN, Role.SUPER_ADMIN)
  async disconnect(@Request() req) {
    const franchiseId = await this.resolveFranchiseId(req);
    return this.analyticsService.disconnect(franchiseId);
  }

  // ── Data endpoints ──
  @Get('data/traffic')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.FRANCHISE_ADMIN, Role.SUPER_ADMIN)
  async getTraffic(@Request() req) {
    const franchiseId = await this.resolveFranchiseId(req);
    return this.analyticsService.getTrafficData(franchiseId);
  }

  @Get('data/acquisition')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.FRANCHISE_ADMIN, Role.SUPER_ADMIN)
  async getAcquisition(@Request() req) {
    const franchiseId = await this.resolveFranchiseId(req);
    return this.analyticsService.getAcquisitionData(franchiseId);
  }

  @Get('data/audience')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.FRANCHISE_ADMIN, Role.SUPER_ADMIN)
  async getAudience(@Request() req) {
    const franchiseId = await this.resolveFranchiseId(req);
    return this.analyticsService.getAudienceData(franchiseId);
  }

  @Get('data/content')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.FRANCHISE_ADMIN, Role.SUPER_ADMIN)
  async getContent(@Request() req) {
    const franchiseId = await this.resolveFranchiseId(req);
    return this.analyticsService.getContentData(franchiseId);
  }

  // ── Force cache refresh (admin only) ──
  @Post('refresh')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.FRANCHISE_ADMIN, Role.SUPER_ADMIN)
  async forceRefresh(@Request() req) {
    const franchiseId = await this.resolveFranchiseId(req);
    return this.analyticsService.forceRefresh(franchiseId);
  }
}

import { Body, Controller, Get, Put, UseGuards, Request } from '@nestjs/common';
import { SystemSettingsService } from './system-settings.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../enums/role.enum';

@ApiTags('System Settings')
@Controller('system-settings')
export class SystemSettingsController {
    constructor(private readonly systemSettingsService: SystemSettingsService) { }

    @Get('terms')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get Terms and Conditions (franchise-scoped)' })
    async getTerms(@Request() req) {
        const franchiseId = req.user?.franchise_id ?? null;
        return this.systemSettingsService.getTerms(franchiseId);
    }

    @Put('terms')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN, Role.FRANCHISE_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update Terms and Conditions (Admin only, franchise-scoped)' })
    async updateTerms(@Request() req, @Body('content') content: string) {
        const franchiseId = req.user?.franchise_id ?? null;
        return this.systemSettingsService.updateTerms(content, franchiseId);
    }

    @Get('franchise-server')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get Franchise Server Setup Info' })
    async getFranchiseServerInfo() {
        return this.systemSettingsService.getFranchiseServerInfo();
    }

    @Put('franchise-server')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update Franchise Server Setup Info (Super Admin only)' })
    async updateFranchiseServerInfo(@Body() data: { ip: string; cname: string; instructions: string }) {
        return this.systemSettingsService.updateFranchiseServerInfo(data);
    }
}

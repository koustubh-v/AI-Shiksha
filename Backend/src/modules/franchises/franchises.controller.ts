import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { FranchisesService } from './franchises.service';
import { CreateFranchiseDto } from './dto/create-franchise.dto';
import { UpdateFranchiseDto } from './dto/update-franchise.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../enums/role.enum';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Franchises')
@Controller('franchises')
export class FranchisesController {
    constructor(private readonly franchisesService: FranchisesService) { }

    /**
     * Public endpoint — returns branding for the current domain
     * Used by frontend on load to get logo, name, colors
     */
    @Get('branding')
    @ApiOperation({ summary: 'Get franchise branding for current domain (public)' })
    getBranding(@Request() req) {
        const hostname = req.hostname || req.headers['host'] || 'localhost';
        return this.franchisesService.getBrandingByDomain(hostname);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'List all franchises (SUPER_ADMIN only)' })
    findAll() {
        return this.franchisesService.findAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get franchise by ID (SUPER_ADMIN only)' })
    findOne(@Param('id') id: string) {
        return this.franchisesService.findOne(id);
    }

    @Get(':id/stats')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get franchise stats (SUPER_ADMIN only)' })
    getStats(@Param('id') id: string) {
        return this.franchisesService.getStats(id);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new franchise (SUPER_ADMIN only)' })
    create(@Body() createFranchiseDto: CreateFranchiseDto) {
        return this.franchisesService.create(createFranchiseDto);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Update franchise details (SUPER_ADMIN only)' })
    update(@Param('id') id: string, @Body() updateFranchiseDto: UpdateFranchiseDto) {
        return this.franchisesService.update(id, updateFranchiseDto);
    }

    @Patch(':id/suspend')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Toggle franchise active/suspended status (SUPER_ADMIN only)' })
    toggleSuspend(@Param('id') id: string) {
        return this.franchisesService.toggleSuspend(id);
    }
}

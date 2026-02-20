import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../enums/role.enum';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new tag' })
  create(@Request() req, @Body() createTagDto: CreateTagDto) {
    const isSuperAdmin = req.user?.role === Role.SUPER_ADMIN || req.user?.role === 'SUPER_ADMIN';
    const franchiseId = isSuperAdmin ? null : (req.user?.franchise_id ?? null);
    return this.tagsService.create(createTagDto, franchiseId);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'List tags (franchise-scoped if authenticated)' })
  findAll(@Request() req) {
    const user = req.user;
    if (!user) {
      const tenantId = (req as any).tenantId;
      return this.tagsService.findAll(tenantId);
    }
    const isSuperAdmin = user.role === Role.SUPER_ADMIN || user.role === 'SUPER_ADMIN';
    const franchiseId = isSuperAdmin ? undefined : (user.franchise_id ?? null);
    return this.tagsService.findAll(franchiseId);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Get tag details' })
  findOne(@Param('id') id: string, @Request() req) {
    const user = req.user;
    let franchiseId: string | undefined | null;

    if (!user) {
      franchiseId = (req as any).tenantId;
    } else {
      const isSuperAdmin = user.role === Role.SUPER_ADMIN || user.role === 'SUPER_ADMIN';
      franchiseId = isSuperAdmin ? undefined : (user.franchise_id ?? null);
    }
    return this.tagsService.findOne(id, franchiseId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.FRANCHISE_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete tag (Admin only)' })
  remove(@Param('id') id: string, @Request() req) {
    const isSuperAdmin = req.user?.role === Role.SUPER_ADMIN || req.user?.role === 'SUPER_ADMIN';
    const franchiseId = isSuperAdmin ? undefined : (req.user?.franchise_id ?? null);
    return this.tagsService.remove(id, franchiseId);
  }
}

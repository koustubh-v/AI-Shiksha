import { Controller, Get, Put, Body, Param, UseGuards, Req, Delete } from '@nestjs/common';
import { PagesService } from './pages.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../enums/role.enum';

@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get()
  async getPages(@Req() req) {
    // Both public and private access. Tenant ID from middleware.
    const franchiseId = (req as any).tenantId || (req as any).tenantBranding?.id;
    return this.pagesService.findAll(franchiseId);
  }

  @Get(':slug')
  async getPageBySlug(@Param('slug') slug: string, @Req() req) {
    const franchiseId = (req as any).tenantId || (req as any).tenantBranding?.id;
    return this.pagesService.findBySlug(franchiseId, slug);
  }

  @Put(':slug')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.FRANCHISE_ADMIN)
  async upsertPage(
    @Param('slug') slug: string, 
    @Body() body: { title: string; content: string; is_published: boolean }, 
    @Req() req
  ) {
    const franchiseId = req.user.franchise_id || (req as any).tenantId || (req as any).tenantBranding?.id;
    return this.pagesService.upsertPage(franchiseId, { slug, ...body });
  }

  @Delete(':slug')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN, Role.FRANCHISE_ADMIN)
  async deletePage(@Param('slug') slug: string, @Req() req) {
    const franchiseId = req.user.franchise_id || (req as any).tenantId || (req as any).tenantBranding?.id;
    return this.pagesService.deletePage(franchiseId, slug);
  }
}

import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CertificateTemplatesService } from './certificate-templates.service';
import { CreateCertificateTemplateDto } from './dto/create-certificate-template.dto';
import { UpdateCertificateTemplateDto } from './dto/update-certificate-template.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../enums/role.enum';

@ApiTags('certificate-templates')
@Controller('certificate-templates')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class CertificateTemplatesController {
    constructor(
        private readonly certificateTemplatesService: CertificateTemplatesService,
    ) { }

    @Get()
    @ApiOperation({ summary: 'Get all certificate templates' })
    findAll() {
        return this.certificateTemplatesService.findAll();
    }

    @Get('default')
    @ApiOperation({ summary: 'Get default certificate template' })
    getDefault() {
        return this.certificateTemplatesService.getDefault();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get certificate template by ID' })
    findOne(@Param('id') id: string) {
        return this.certificateTemplatesService.findOne(id);
    }

    @Post()
    @Roles(Role.ADMIN, Role.INSTRUCTOR)
    @ApiOperation({ summary: 'Create certificate template' })
    create(@Body() dto: CreateCertificateTemplateDto, @Request() req: any) {
        return this.certificateTemplatesService.create(dto, req.user?.id);
    }

    @Patch(':id')
    @Roles(Role.ADMIN, Role.INSTRUCTOR)
    @ApiOperation({ summary: 'Update certificate template' })
    update(@Param('id') id: string, @Body() dto: UpdateCertificateTemplateDto) {
        return this.certificateTemplatesService.update(id, dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete certificate template (Admin only)' })
    delete(@Param('id') id: string) {
        return this.certificateTemplatesService.delete(id);
    }

    @Post(':id/set-default')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Set template as default (Admin only)' })
    setDefault(@Param('id') id: string) {
        return this.certificateTemplatesService.setDefault(id);
    }
}

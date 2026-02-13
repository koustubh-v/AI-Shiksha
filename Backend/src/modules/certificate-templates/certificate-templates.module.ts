import { Module } from '@nestjs/common';
import { CertificateTemplatesService } from './certificate-templates.service';
import { CertificateTemplatesController } from './certificate-templates.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [CertificateTemplatesController],
    providers: [CertificateTemplatesService],
    exports: [CertificateTemplatesService],
})
export class CertificateTemplatesModule { }

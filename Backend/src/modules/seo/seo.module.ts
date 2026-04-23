import { Module } from '@nestjs/common';
import { SeoController } from './seo.controller';
import { SeoService } from './seo.service';
import { FranchisesModule } from '../franchises/franchises.module';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [FranchisesModule, PrismaModule],
  controllers: [SeoController],
  providers: [SeoService],
})
export class SeoModule {}

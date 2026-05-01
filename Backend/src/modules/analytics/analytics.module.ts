import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}

import { Module } from '@nestjs/common';
import { CompletionsService } from './completions.service';
import { CompletionsController } from './completions.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [CompletionsController],
    providers: [CompletionsService],
    exports: [CompletionsService],
})
export class CompletionsModule { }

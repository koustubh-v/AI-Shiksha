import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { AssistantController } from './assistant/assistant.controller';
import { AssistantService } from './assistant/assistant.service';
import { GeminiService } from './shared/gemini.service';
import { PromptBuilderService } from './shared/prompt-builder.service';
import { EmbeddingService } from './shared/embedding.service';
import { RetrievalService } from './shared/retrieval.service';
import { RateLimitService } from './assistant/rate-limit.service';
import { chunkText } from './shared/chunking.util';
import { PublicAiController } from './public/public-ai.controller';
import { PublicAiService } from './public/public-ai.service';
import * as crypto from 'crypto';

@Module({
  imports: [
    PrismaModule,
    ConfigModule,
    HttpModule
  ],
  controllers: [AssistantController, PublicAiController],
  providers: [
    AssistantService,
    GeminiService,
    PromptBuilderService,
    EmbeddingService,
    RetrievalService,
    RateLimitService,
    PublicAiService
  ],
  exports: [AssistantService, PublicAiService],
})
export class AiModule implements OnModuleInit {
  private readonly logger = new Logger(AiModule.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly embeddingService: EmbeddingService,
  ) { }

  onModuleInit() {
    this.logger.log('Initializing AI Module and Prisma Middleware for Embeddings...');

    // Prisma Middleware to auto-generate embeddings on Lesson create/update
    this.prisma.$use(async (params, next) => {
      const result = await next(params);

      // Strict scope: Only for Lesson model, and only on create/update
      if (params.model === 'Lesson' && (params.action === 'create' || params.action === 'update')) {
        // Run asynchronously (non-blocking)
        // We do NOT await this, so the main request returns immediately
        this.handleEmbeddingGeneration(result, params.action, params.args).catch((err) => {
          this.logger.error(`Background embedding generation failed for Lesson ${result.id}: ${err.message}`);
        });
      }

      return result;
    });
  }

  private async handleEmbeddingGeneration(lesson: any, action: string, args: any) {
    // 1. Check if content is present
    // For 'create', it should be in lesson object or args
    // For 'update', we only regenerate if 'content' was updated
    const content = lesson.content;

    if (action === 'update') {
      // Check if content was actually part of the update payload
      // params.args.data usually contains the update set
      const updateData = args.data;
      if (!updateData || !updateData.content) {
        return; // Content didn't change, skip
      }
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return;
    }

    this.logger.log(`Generating embeddings for Lesson ${lesson.id} (${action})...`);

    // 2. Chunk Content
    const chunks = chunkText(content);
    if (chunks.length === 0) return;

    // 3. Delete existing embeddings for this lesson (to avoid stale data/duplicates on update)
    if (action === 'update') {
      await this.prisma.$executeRaw`DELETE FROM "lesson_embeddings" WHERE lesson_id = ${lesson.id}`;
    }

    // 4. Generate Embeddings & Insert
    // We process chunks in parallel with a concurrency limit if needed, 
    // but for simple lessons (5-10 chunks), Promise.all is fine.

    const operations = chunks.map(async (chunk) => {
      const vector = await this.embeddingService.generateEmbedding(chunk);
      if (!vector) return null; // Skip failed embeddings

      return {
        id: crypto.randomUUID(),
        lesson_id: lesson.id,
        content_chunk: chunk,
        vectorString: `[${vector.join(',')}]`
      };
    });

    const results = await Promise.all(operations);
    const validResults = results.filter((r) => r !== null);

    if (validResults.length === 0) {
      this.logger.warn(`No valid embeddings generated for Lesson ${lesson.id}`);
      return;
    }

    // 5. Bulk Insert via Raw SQL
    // Prisma doesn't support 'vector' type in createMany yet, so we use executeRaw for each or construct a big query.
    // For safety and simplicity with parameter binding, we'll insert one by one or batched.
    // Batching with raw SQL and parameters is tricky. One-by-one is safer for now given <50 chunks.

    for (const item of validResults) {
      /* 
         Note: We cast safely to vector. 
         $3 is content_chunk, $4 is vector string.
      */
      await this.prisma.$executeRaw`
        INSERT INTO "lesson_embeddings" (id, lesson_id, content_chunk, embedding, created_at)
        VALUES (${item.id}, ${item.lesson_id}, ${item.content_chunk}, ${item.vectorString}::vector, NOW());
      `;
    }

    this.logger.log(`Successfully generated ${validResults.length} embeddings for Lesson ${lesson.id}`);
  }
}

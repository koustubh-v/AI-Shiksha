import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { InstructorsModule } from './modules/instructors/instructors.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ModulesModule } from './modules/modules/modules.module';
import { LessonsModule } from './modules/lessons/lessons.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AiModule } from './modules/ai/ai.module';
import { AdminModule } from './modules/admin/admin.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TagsModule } from './modules/tags/tags.module';
// Course Builder Modules
import { SectionsModule } from './modules/sections/sections.module';
import { QuizzesModule } from './modules/quizzes/quizzes.module';
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { CompletionsModule } from './modules/completions/completions.module';

import { CertificateTemplatesModule } from './modules/certificate-templates/certificate-templates.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    InstructorsModule,
    CoursesModule,
    ModulesModule,
    LessonsModule,
    EnrollmentsModule,
    PaymentsModule,
    AiModule,
    AdminModule,
    CategoriesModule,
    TagsModule,
    // Course Builder
    SectionsModule,
    QuizzesModule,
    AssignmentsModule,
    CompletionsModule,
    CertificateTemplatesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

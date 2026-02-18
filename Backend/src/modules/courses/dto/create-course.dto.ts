import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCourseDto {
  // Basic Info
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  subtitle?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  learning_outcomes?: string[];

  @IsString()
  @IsOptional()
  thumbnail_url?: string;

  @IsString()
  @IsOptional()
  intro_video_url?: string;

  // Course Details
  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsOptional()
  level?: string; // Beginner, Intermediate, Advanced

  @IsString()
  @IsOptional()
  language?: string;

  // Pricing & Monetization
  @IsBoolean()
  @IsOptional()
  is_free?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  original_price?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(100)
  discount_percentage?: number;

  @IsBoolean()
  @IsOptional()
  drip_enabled?: boolean;

  // Access Control
  @IsBoolean()
  @IsOptional()
  is_private?: boolean;

  @IsString()
  @IsOptional()
  password?: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  max_students?: number;

  // Category and Tags
  @IsString()
  @IsOptional()
  category_id?: string;

  @IsArray()
  @IsOptional()
  tag_ids?: string[];

  // Prerequisites
  @IsArray()
  @IsOptional()
  prerequisite_course_ids?: string[];

  // Certificate fields
  @IsBoolean()
  @IsOptional()
  certificate_enabled?: boolean;

  @IsString()
  @IsOptional()
  certificate_template_id?: string;

  @IsString()
  @IsOptional()
  certificate_title?: string;

  @IsString()
  @IsOptional()
  certificate_description?: string;

  // SEO Settings
  @IsOptional()
  @IsString()
  meta_title?: string;

  @IsOptional()
  @IsString()
  meta_description?: string;

  @IsOptional()
  @IsString()
  meta_keywords?: string;

  // Course Features - customizable features for "This course includes" section
  @IsOptional()
  course_features?: {
    downloadable_resources?: boolean;
    lifetime_access?: boolean;
    mobile_tv_access?: boolean;
    assignments?: boolean;
    quizzes?: boolean;
    coding_exercises?: boolean;
    articles?: boolean;
    discussion_forum?: boolean;
  };

  @IsInt()
  @IsOptional()
  @Min(0)
  access_days_limit?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  estimated_duration?: number; // In minutes

  @IsString()
  @IsOptional()
  author_id?: string; // Optional override for course author (Admin only)

  // Legacy modules support (kept for backward compatibility)
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateModuleDto)
  modules?: CreateModuleDto[];
}

// Legacy DTOs (kept for backward compatibility)
export class CreateLessonDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  video_url?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsNumber()
  @IsOptional()
  duration_seconds?: number;

  @IsBoolean()
  @IsOptional()
  is_preview?: boolean;

  @IsNumber()
  @IsOptional()
  position?: number;
}

export class CreateModuleDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  title: string;

  @IsNumber()
  @IsOptional()
  position?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLessonDto)
  lessons?: CreateLessonDto[];
}

// New DTOs for Course Approval Workflow
export class SubmitForApprovalDto {
  // Empty - the action itself triggers the workflow
}

export class ApproveCourseDto {
  // Empty - approval is the action
}

export class RejectCourseDto {
  @IsString()
  rejection_reason: string;
}

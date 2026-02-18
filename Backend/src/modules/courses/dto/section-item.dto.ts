import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  IsArray,
  IsIn,
} from 'class-validator';

// Section Item DTOs (for Lectures, Quizzes, Assignments, Resources)
export class CreateSectionItemDto {
  @IsString()
  @IsIn(['LECTURE', 'QUIZ', 'ASSIGNMENT', 'RESOURCE'])
  type: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  slug?: string; // Optional, will be auto-generated from title if not provided

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0)
  order_index: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  duration_minutes?: number;

  @IsBoolean()
  @IsOptional()
  is_preview?: boolean;

  @IsBoolean()
  @IsOptional()
  is_mandatory?: boolean;

  @IsString()
  @IsOptional()
  quiz_id?: string;
}

export class UpdateSectionItemDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  slug?: string; // Optional, will be regenerated from title if title changes

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  order_index?: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  duration_minutes?: number;

  @IsBoolean()
  @IsOptional()
  is_preview?: boolean;

  @IsBoolean()
  @IsOptional()
  is_mandatory?: boolean;
}

export class ReorderItemsDto {
  @IsArray()
  item_orders: { id: string; order_index: number }[];
}

// Lecture Content DTOs
export class CreateLectureContentDto {
  @IsString()
  @IsIn(['VIDEO', 'TEXT', 'FILE', 'LINK'])
  content_type: string;

  // Video content
  @IsString()
  @IsOptional()
  video_url?: string;

  @IsString()
  @IsOptional()
  @IsIn(['UPLOAD', 'YOUTUBE', 'VIMEO'])
  video_provider?: string;

  @IsString()
  @IsOptional()
  subtitles_url?: string;

  @IsString()
  @IsOptional()
  transcript?: string;

  // Text content
  @IsString()
  @IsOptional()
  text_content?: string; // Rich text JSON

  // File content
  @IsString()
  @IsOptional()
  file_url?: string;

  @IsString()
  @IsOptional()
  file_type?: string;

  @IsInt()
  @IsOptional()
  file_size?: number;

  @IsString()
  @IsOptional()
  pdf_url?: string;

  // External link
  @IsString()
  @IsOptional()
  external_link?: string;
}

export class UpdateLectureContentDto {
  @IsString()
  @IsOptional()
  @IsIn(['VIDEO', 'TEXT', 'FILE', 'LINK'])
  content_type?: string;

  @IsString()
  @IsOptional()
  video_url?: string;

  @IsString()
  @IsOptional()
  video_provider?: string;

  @IsString()
  @IsOptional()
  subtitles_url?: string;

  @IsString()
  @IsOptional()
  transcript?: string;

  @IsString()
  @IsOptional()
  text_content?: string;

  @IsString()
  @IsOptional()
  file_url?: string;

  @IsString()
  @IsOptional()
  file_type?: string;

  @IsInt()
  @IsOptional()
  file_size?: number;

  @IsString()
  @IsOptional()
  external_link?: string;
}

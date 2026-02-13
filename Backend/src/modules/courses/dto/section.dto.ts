import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  IsArray,
} from 'class-validator';

// Section DTOs
export class CreateSectionDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0)
  order_index: number;
}

export class UpdateSectionDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  order_index?: number;

  @IsBoolean()
  @IsOptional()
  is_collapsed?: boolean;
}

export class ReorderSectionsDto {
  @IsArray()
  section_orders: { id: string; order_index: number }[];
}

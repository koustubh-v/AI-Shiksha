import { IsString, IsEmail, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFranchiseDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    lms_name?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    domain?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    logo_url?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    primary_color?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsEmail()
    support_email?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    domain_verified?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    favicon_url?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    maintenance_mode?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    seo_title?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    seo_description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    seo_keywords?: string;
}

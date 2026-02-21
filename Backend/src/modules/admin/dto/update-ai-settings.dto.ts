import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateAiSettingsDto {
    @ApiPropertyOptional({ description: 'Google Gemini API Key' })
    @IsOptional()
    @IsString()
    gemini_api_key?: string;

    @ApiPropertyOptional({ description: 'Master toggle for all AI features' })
    @IsOptional()
    @IsBoolean()
    global_ai_control?: boolean;
}

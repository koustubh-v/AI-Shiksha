import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    bio?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    avatar_url?: string;
}

export class ChangePasswordDto {
    @ApiPropertyOptional()
    @IsString()
    @MinLength(6)
    currentPassword: string;

    @ApiPropertyOptional()
    @IsString()
    @MinLength(6)
    newPassword: string;
}

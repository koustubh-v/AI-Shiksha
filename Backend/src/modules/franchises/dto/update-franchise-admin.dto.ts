import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFranchiseAdminDto {
    @ApiPropertyOptional({ description: 'The new email address for the franchise admin' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ description: 'The new password for the franchise admin' })
    @IsOptional()
    @IsString()
    @MinLength(6)
    password?: string;
}

import { IsString, IsEmail, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFranchiseDto {
    @ApiProperty({ description: 'Franchise name' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'LMS brand name shown to users' })
    @IsString()
    lms_name: string;

    @ApiProperty({ description: 'Domain for this franchise (e.g. academy.example.com)' })
    @IsString()
    domain: string;

    @ApiProperty({ description: 'Franchise admin full name' })
    @IsString()
    admin_name: string;

    @ApiProperty({ description: 'Franchise admin email address' })
    @IsEmail()
    admin_email: string;

    @ApiPropertyOptional({ description: 'Logo URL' })
    @IsOptional()
    @IsString()
    logo_url?: string;

    @ApiPropertyOptional({ description: 'Primary brand color (hex)', example: '#6366f1' })
    @IsOptional()
    @IsString()
    primary_color?: string;

    @ApiPropertyOptional({ description: 'Support email for this franchise' })
    @IsOptional()
    @IsEmail()
    support_email?: string;
}

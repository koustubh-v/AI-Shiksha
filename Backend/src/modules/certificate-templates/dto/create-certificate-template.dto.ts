import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, IsBoolean } from 'class-validator';

export class CreateCertificateTemplateDto {
    @ApiProperty({ description: 'Template name' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Template description', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Template configuration JSON',
        example: {
            layout: 'classic',
            background_color: '#ffffff',
            border_style: 'double',
            border_color: '#000000',
            title_text: 'Certificate of Completion',
            title_font: 'Georgia',
            title_color: '#1a1a1a',
            body_font: 'Arial',
            body_color: '#333333',
            logo_url: null,
            signature_slots: [
                {
                    name: 'Instructor',
                    title: 'Course Instructor',
                },
            ],
        },
    })
    @IsObject()
    template_config: {
        layout?: string;
        background_color?: string;
        background_image_url?: string;
        border_style?: string;
        border_color?: string;
        title_text?: string;
        title_font?: string;
        title_color?: string;
        body_font?: string;
        body_color?: string;
        logo_url?: string;
        signature_slots?: Array<{
            name: string;
            title: string;
            signature_image_url?: string;
        }>;
    };

    @ApiProperty({ description: 'Preview image URL', required: false })
    @IsString()
    @IsOptional()
    preview_image_url?: string;

    @ApiProperty({ description: 'Set as default template', required: false, default: false })
    @IsBoolean()
    @IsOptional()
    is_default?: boolean;
}

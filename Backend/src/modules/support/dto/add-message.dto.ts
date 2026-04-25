import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class AddMessageDto {
    @IsString()
    @IsNotEmpty()
    message: string;

    @IsOptional()
    @IsString()
    image_url?: string;
}

import { IsString, IsNotEmpty, MinLength, MaxLength, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatDto {
  @ApiProperty({
    description: 'The UUID of the course regarding which the student is asking questions',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4', { message: 'Invalid course ID format' })
  @IsOptional()
  courseId?: string;

  @ApiProperty({
    description: 'The user message to send to the AI assistant',
    minLength: 5,
    maxLength: 1000,
    example: 'Explain the concept of strict grounding in AI.',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: 'Message must be at least 5 characters long' })
  @MaxLength(1000, { message: 'Message cannot exceed 1000 characters' })
  message: string;
}

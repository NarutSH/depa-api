import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTagDto {
  @ApiProperty({
    description: 'Updated tag title',
    required: false,
    example: 'Advanced Mobile Gaming',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'New slug for the tag (if you want to change it)',
    required: false,
    example: 'advanced-mobile-gaming',
  })
  @IsString()
  @IsOptional()
  newSlug?: string;
}

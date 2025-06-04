import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateChannelDto {
  @ApiProperty({
    description: 'Updated channel title',
    required: false,
    example: 'Apple App Store',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'New slug for the channel (if you want to change it)',
    required: false,
    example: 'apple-app-store',
  })
  @IsString()
  @IsOptional()
  newSlug?: string;
}

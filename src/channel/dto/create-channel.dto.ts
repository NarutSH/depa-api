import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateChannelDto {
  @ApiProperty({
    description: 'Name of the channel',
    example: 'Mobile Development',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Unique slug for the channel',
    example: 'mobile-development',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    description: 'Optional description of the channel',
    example: 'Mobile app development and related services',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Optional image URL for the channel',
    example: 'https://example.com/images/mobile-dev.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({
    description: 'Industry slug this channel belongs to',
    example: 'technology',
  })
  @IsString()
  @IsNotEmpty()
  industrySlug: string;
}

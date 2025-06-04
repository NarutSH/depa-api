import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelDto {
  @ApiProperty({ description: 'Channel name', example: 'App Store' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Channel slug identifier (URL-friendly)',
    example: 'app-store',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    description: 'Industry slug that this channel belongs to',
    example: 'game',
  })
  @IsString()
  @IsNotEmpty()
  industrySlug: string;
}

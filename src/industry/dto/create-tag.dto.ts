import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({ description: 'Tag name', example: 'Mobile Gaming' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Tag slug identifier (URL-friendly)',
    example: 'mobile-gaming',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({
    description: 'Industry slug that this tag belongs to',
    example: 'game',
  })
  @IsString()
  @IsNotEmpty()
  industrySlug: string;
}

import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIndustryDto {
  @ApiProperty({
    description: 'Industry name',
    example: 'Game Development',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Industry slug (URL friendly identifier)',
    example: 'game-development',
  })
  @IsString()
  @IsNotEmpty()
  slug: string;
}

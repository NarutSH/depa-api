import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateIndustryDto {
  @ApiProperty({
    description: 'Updated industry name',
    example: 'Game Development & Design',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Updated industry slug',
    example: 'game-dev-design',
    required: false,
  })
  @IsString()
  @IsOptional()
  slug?: string;
}

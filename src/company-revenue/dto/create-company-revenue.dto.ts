import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyRevenueDto {
  @ApiProperty({
    description: 'Year of the revenue record',
    example: 2024,
    minimum: 1900,
    maximum: 2100,
  })
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @ApiProperty({
    description: 'Company ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsString()
  companyId: string;

  @ApiProperty({
    description: 'Total revenue amount',
    example: 1000000,
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  total: number;
}

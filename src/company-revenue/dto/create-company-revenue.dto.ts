import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCompanyRevenueDto {
  @IsNotEmpty()
  @IsNumber()
  year: number;

  @IsNotEmpty()
  @IsString()
  companyId: string;

  @IsNotEmpty()
  @IsNumber()
  total: number;
}

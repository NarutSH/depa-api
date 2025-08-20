import { ApiProperty } from '@nestjs/swagger';
import {
  StandardDto,
  ImageDto,
  CompanyDto,
  FreelanceDto,
} from './portfolio-nested.dto';

export class PortfolioByIndustryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false, type: String })
  description?: string;

  @ApiProperty()
  industryTypeSlug: string;

  @ApiProperty({ required: false, type: String })
  link?: string;

  @ApiProperty({ required: false, type: String })
  freelanceId?: string;

  @ApiProperty({ required: false, type: String })
  companyId?: string;

  @ApiProperty({ required: false, type: String })
  companyJuristicId?: string;

  @ApiProperty({ type: [String], required: false })
  tags?: string[];

  @ApiProperty({ type: [String], required: false })
  looking_for?: string[];

  @ApiProperty({ type: [StandardDto], required: false })
  standards?: StandardDto[];

  @ApiProperty({ type: [ImageDto], required: false })
  Image?: ImageDto[];

  @ApiProperty({ type: CompanyDto, required: false })
  company?: CompanyDto;

  @ApiProperty({ type: FreelanceDto, required: false })
  freelance?: FreelanceDto;
}

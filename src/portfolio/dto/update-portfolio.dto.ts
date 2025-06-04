import { PartialType } from '@nestjs/swagger';
import { CreatePortfolioWithImagesAndStandardsDto } from './create-portfolio.dto';

export class UpdatePortfolioDto extends PartialType(
  CreatePortfolioWithImagesAndStandardsDto,
) {}

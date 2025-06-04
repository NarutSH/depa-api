import { IsEnum, IsUUID } from 'class-validator';
import { FavoriteAction } from 'generated/prisma';

export class FavoritePortfolioDto {
  @IsUUID('4')
  portfolioId: string;

  @IsEnum(FavoriteAction)
  action: FavoriteAction;
}

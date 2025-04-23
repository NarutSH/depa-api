import { FavoriteAction } from '@prisma/client';
import { IsEnum, IsUUID } from 'class-validator';

export class FavoritePortfolioDto {
  @IsUUID('4')
  portfolioId: string;

  @IsEnum(FavoriteAction)
  action: FavoriteAction;
}

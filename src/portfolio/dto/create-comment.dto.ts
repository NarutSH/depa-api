import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: 'The content of the comment' })
  @IsString()
  @MinLength(1)
  content: string;

  @ApiProperty({ description: 'The ID of the portfolio being commented on' })
  @IsUUID('4')
  portfolioId: string;

  @ApiPropertyOptional({
    description: 'The ID of the parent comment (for replies)',
  })
  @IsOptional()
  @IsUUID('4')
  parentId?: string;
}

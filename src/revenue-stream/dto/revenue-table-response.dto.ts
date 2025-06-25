import { ApiProperty } from '@nestjs/swagger';

export class RevenueStreamItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  year: number;

  @ApiProperty()
  industryTypeSlug: string;

  @ApiProperty()
  categorySlug: string;

  @ApiProperty()
  sourceSlug: string;

  @ApiProperty()
  channelSlug: string;

  @ApiProperty()
  segmentSlug: string;

  @ApiProperty()
  percent: number;

  @ApiProperty()
  ctrPercent: number;

  @ApiProperty({ required: false })
  value?: number;

  @ApiProperty()
  companyId: string;

  @ApiProperty()
  companyJuristicId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  // Relations
  @ApiProperty({ required: false })
  industry?: {
    name: string;
    slug: string;
  };

  @ApiProperty({ required: false })
  category?: {
    name: string;
    slug: string;
  };

  @ApiProperty({ required: false })
  source?: {
    name: string;
    slug: string;
  };

  @ApiProperty({ required: false })
  channel?: {
    name: string;
    slug: string;
  };

  @ApiProperty({ required: false })
  segment?: {
    name: string;
    slug: string;
  };
}

export class RevenueTableResponseDto {
  @ApiProperty()
  year: number;

  @ApiProperty()
  companyId: string;

  @ApiProperty({ type: [RevenueStreamItemDto] })
  revenueStreams: RevenueStreamItemDto[];

  @ApiProperty()
  totalItems: number;

  @ApiProperty({ description: 'จำนวน Source ที่มี' })
  sourceCount: number;

  @ApiProperty({ description: 'รายชื่อ Sources' })
  sources: Array<{
    slug: string;
    name: string;
    itemCount: number;
  }>;
} 
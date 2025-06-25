import { PartialType } from '@nestjs/swagger';
import { CreateRevenueStreamDto } from './create-revenue-stream.dto';

export class UpdateRevenueStreamDto extends PartialType(CreateRevenueStreamDto) {} 
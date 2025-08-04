import { PartialType } from '@nestjs/swagger';
import { CreateStandardsDto } from './create-standards.dto';

export class UpdateStandardsDto extends PartialType(CreateStandardsDto) {}

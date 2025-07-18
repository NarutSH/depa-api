import { PartialType } from '@nestjs/swagger';
import { CreateLookingForDto } from './create-looking-for.dto';

export class UpdateLookingForDto extends PartialType(CreateLookingForDto) {}

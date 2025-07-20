import { PartialType } from '@nestjs/mapped-types';
import { CreateLookingForDto } from './create-looking-for.dto';

export class UpdateLookingForDto extends PartialType(CreateLookingForDto) {}

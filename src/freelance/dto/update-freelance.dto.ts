import { PartialType } from '@nestjs/mapped-types';
import { CreateFreelanceDto } from './create-freelance.dto';

export class UpdateFreelanceDto extends PartialType(CreateFreelanceDto) {}

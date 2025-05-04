import { PartialType } from '@nestjs/mapped-types';
import CreateCompanyDto from './create-company.dto';

class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}

export default UpdateCompanyDto;

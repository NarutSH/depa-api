import { ApiProperty } from '@nestjs/swagger';

export class StandardDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  type?: string;

  @ApiProperty({ required: false })
  image?: string;
}

export class ImageDto {
  @ApiProperty()
  url: string;

  @ApiProperty({ required: false })
  type?: string;

  @ApiProperty({ required: false })
  description?: string;
}

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  industriesRelated?: string[];

  @ApiProperty({ required: false })
  industryChannels?: string[];

  @ApiProperty({ required: false })
  industrySkills?: string[];

  @ApiProperty({ required: false })
  industryTags?: string[];
}

export class CompanyDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  user?: UserDto;
}

export class FreelanceDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ required: false })
  user?: UserDto;
}

import { QueryMetadataDto } from 'src/utils';

export interface ChannelQueryParams extends QueryMetadataDto {
  industry?: string;
  sort?: string;
}

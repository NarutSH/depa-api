import { Global, Module } from '@nestjs/common';
import { QueryUtilsService } from './services/query-utils.service';

@Global()
@Module({
  providers: [QueryUtilsService],
  exports: [QueryUtilsService],
})
export class UtilsModule {}

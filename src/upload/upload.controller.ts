import {
  BadRequestException,
  Controller,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, bucket: string) {
    const fileValidationPipe = new ParseFilePipeBuilder()
      .addFileTypeValidator({ fileType: 'image/*' })
      .build();

    const bucketName = bucket || 'media';

    try {
      await fileValidationPipe.transform(file);
      return this.uploadService.uploadFile(file, bucketName);
    } catch (error) {
      throw new BadRequestException(`File validation failed: ${error.message}`);
    }
  }
}

import {
  BadRequestException,
  Controller,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    const fileValidationPipe = new ParseFilePipeBuilder()
      .addFileTypeValidator({ fileType: 'image/*' })
      .build();

    try {
      await fileValidationPipe.transform(file);
      return this.uploadService.uploadFile(file, folder);
    } catch (error) {
      throw new BadRequestException(`File validation failed: ${error.message}`);
    }
  }

  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10)) // Allow up to 10 files
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder?: string,
  ) {
    try {
      return this.uploadService.uploadMultiFile(files, folder);
    } catch (error) {
      throw new BadRequestException(`Files upload failed: ${error.message}`);
    }
  }
}

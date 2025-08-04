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
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  SingleUploadResponseDto,
  MultipleUploadResponseDto,
} from './dto/upload-response.dto';
import { ValidationErrorResponseDto } from './dto/upload-error.dto';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({
    summary: 'Upload a single file',
    operationId: 'uploadSingleFile',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'The file to upload (image files only)',
        },
      },
      required: ['file'],
    },
  })
  @ApiQuery({
    name: 'folder',
    required: false,
    description: 'Optional folder name to organize uploads',
    example: 'portfolio',
  })
  @ApiCreatedResponse({
    description: 'File uploaded successfully',
    type: SingleUploadResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'File validation failed or upload error',
    type: ValidationErrorResponseDto,
  })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ): Promise<SingleUploadResponseDto> {
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

  @ApiOperation({
    summary: 'Upload multiple files',
    operationId: 'uploadMultipleFiles',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Multiple file upload',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Array of files to upload (up to 10 image files)',
        },
      },
      required: ['files'],
    },
  })
  @ApiQuery({
    name: 'folder',
    required: false,
    description: 'Optional folder name to organize uploads',
    example: 'portfolio',
  })
  @ApiCreatedResponse({
    description: 'Files uploaded successfully',
    type: MultipleUploadResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'File validation failed or upload error',
    type: ValidationErrorResponseDto,
  })
  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10)) // Allow up to 10 files
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder?: string,
  ): Promise<MultipleUploadResponseDto> {
    try {
      return this.uploadService.uploadMultiFile(files, folder);
    } catch (error) {
      throw new BadRequestException(`Files upload failed: ${error.message}`);
    }
  }
}

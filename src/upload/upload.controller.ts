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
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a single file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File to upload (images only)',
        },
      },
      required: ['file'],
    },
  })
  @ApiQuery({
    name: 'folder',
    required: false,
    description: 'Folder name to store the file',
    example: 'portfolio',
  })
  @ApiResponse({
    status: 201,
    description: 'File uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'URL of the uploaded file',
          example: 'https://example.com/uploads/file.jpg',
        },
        filename: {
          type: 'string',
          description: 'Name of the uploaded file',
          example: 'file.jpg',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - File validation failed',
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ): Promise<any> {
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
  @ApiOperation({ summary: 'Upload multiple files' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Files to upload (images only, max 10 files)',
        },
      },
      required: ['files'],
    },
  })
  @ApiQuery({
    name: 'folder',
    required: false,
    description: 'Folder name to store the files',
    example: 'portfolio',
  })
  @ApiResponse({
    status: 201,
    description: 'Files uploaded successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'URL of the uploaded file',
            example: 'https://example.com/uploads/file.jpg',
          },
          filename: {
            type: 'string',
            description: 'Name of the uploaded file',
            example: 'file.jpg',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Files upload failed',
  })
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder?: string,
  ): Promise<any> {
    try {
      return this.uploadService.uploadMultiFile(files, folder);
    } catch (error) {
      throw new BadRequestException(`Files upload failed: ${error.message}`);
    }
  }
}

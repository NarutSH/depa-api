import { BadRequestException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import {
  SingleUploadResponseDto,
  MultipleUploadResponseDto,
  UploadFileResponseDto,
} from './dto/upload-response.dto';

@Injectable()
export class UploadService {
  private readonly uploadDir: string;

  constructor() {
    this.uploadDir =
      process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');

    console.log(`Upload service using directory: ${this.uploadDir}`);

    // // Ensure upload directory exists
    // if (!fs.existsSync(this.uploadDir)) {
    //   fs.mkdirSync(this.uploadDir, { recursive: true });
    // }
  }

  async uploadFile(
    file: Express.Multer.File,
    folderName: string = '',
  ): Promise<SingleUploadResponseDto> {
    try {
      const [fileName, fileType] = file.originalname.split('.');

      const sanitizedName = fileName.replace(/[^a-zA-Z0-9.]/g, '');
      const uniqueFilename = `${sanitizedName}-${Date.now()}.${fileType}`;

      // Create folder if specified and doesn't exist
      const uploadPath = folderName
        ? path.join(this.uploadDir, folderName)
        : this.uploadDir;

      if (folderName && !fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      const filePath = path.join(uploadPath, uniqueFilename);

      // Write file to disk
      fs.writeFileSync(filePath, file.buffer);

      // Calculate relative path for URL
      const relativePath = folderName
        ? `${folderName}/${uniqueFilename}`
        : uniqueFilename;

      const baseUrl = process.env.BASE_URL || 'http://localhost:8000';
      const publicUrl = `${baseUrl}/uploads/${relativePath}`;

      const fileData: UploadFileResponseDto = {
        path: relativePath,
        fullPath: relativePath,
        publicUrl: publicUrl,
        size: file.size,
        mimetype: file.mimetype,
      };

      return {
        data: fileData,
        success: true,
        message: 'File uploaded successfully',
      };
    } catch (error) {
      throw new BadRequestException(`File upload failed: ${error.message}`);
    }
  }

  async uploadMultiFile(
    files: Express.Multer.File[],
    folderName: string = '',
  ): Promise<MultipleUploadResponseDto> {
    const uploadResults: UploadFileResponseDto[] = [];

    for (const file of files) {
      const result = await this.uploadFile(file, folderName);
      uploadResults.push(result.data);
    }

    return {
      data: uploadResults,
      success: true,
      message: 'Files uploaded successfully',
    };
  }
}

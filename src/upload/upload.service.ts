import {
  Injectable,
  Inject,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { Client } from 'minio';
import * as crypto from 'crypto';
import {
  SingleUploadResponseDto,
  MultipleUploadResponseDto,
  UploadFileResponseDto,
} from './dto/upload-response.dto';

// สร้าง Injection Token สำหรับ MinIO Client
export const MINIO_CLIENT = 'MINIO_CLIENT';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly bucketName: string;
  private readonly baseUrl: string;

  constructor(@Inject(MINIO_CLIENT) private readonly minioClient: Client) {
    // ดึงชื่อ Bucket และ Base URL จาก Environment Variables
    this.bucketName = process.env.MINIO_BUCKET || 'uploads';
    this.baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    this.logger.log(`UploadService initialized for bucket: ${this.bucketName}`);
  }

  /**
   * ตรวจสอบและสร้าง Bucket ถ้ายังไม่มี
   */
  private async ensureBucketExists() {
    const bucketExists = await this.minioClient.bucketExists(this.bucketName);
    if (!bucketExists) {
      this.logger.log(
        `Bucket "${this.bucketName}" does not exist. Creating...`,
      );
      await this.minioClient.makeBucket(this.bucketName);

      this.logger.log(`Bucket "${this.bucketName}" created successfully.`);
      // (Optional) ตั้งค่า Policy ให้ Bucket เป็น Public-Read
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
          },
        ],
      };
      await this.minioClient.setBucketPolicy(
        this.bucketName,
        JSON.stringify(policy),
      );
      this.logger.log(`Bucket "${this.bucketName}" policy set to public-read.`);
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    folderName: string = '',
  ): Promise<SingleUploadResponseDto> {
    try {
      // ตรวจสอบว่า Bucket มีอยู่จริงหรือไม่
      await this.ensureBucketExists();

      const originalName = file.originalname;
      const extension = originalName.split('.').pop();
      const fileName = originalName.slice(0, -(extension.length + 1));

      // สร้างชื่อไฟล์ใหม่ที่ไม่ซ้ำกัน
      const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, '');
      const uniqueSuffix = crypto.randomBytes(6).toString('hex');
      const objectName = folderName
        ? `${folderName}/${sanitizedName}-${uniqueSuffix}.${extension}`
        : `${sanitizedName}-${uniqueSuffix}.${extension}`;

      // Metadata สำหรับไฟล์
      const metaData = {
        'Content-Type': file.mimetype,
      };

      // อัปโหลดไฟล์ไปยัง MinIO
      this.logger.log(
        `Uploading ${objectName} to bucket ${this.bucketName}...`,
      );
      const responseUpload = await this.minioClient.putObject(
        this.bucketName,
        objectName,
        file.buffer,
        file.size,
        metaData,
      );
      this.logger.log(`Successfully uploaded ${objectName}.`);

      console.log('responseUpload', responseUpload);

      // สร้าง URL ที่สามารถเข้าถึงไฟล์ได้ผ่าน Gateway Nginx
      // จะได้ URL เช่น: https://digitalcontent.depa.or.th/storage/depa-uploads/my-image-1a2b3c.jpg
      const publicUrl = `${this.baseUrl}/storage/${this.bucketName}/${objectName}`;

      const fileData: UploadFileResponseDto = {
        path: objectName, // path ภายใน bucket
        fullPath: objectName,
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
      this.logger.error(`File upload failed: ${error.message}`, error.stack);
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

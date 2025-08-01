import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService, MINIO_CLIENT } from './upload.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Client } from 'minio';

@Module({
  controllers: [UploadController],
  providers: [
    UploadService,
    PrismaService,
    {
      provide: MINIO_CLIENT,
      useFactory: () => {
        // ดึงค่า Config จาก Environment Variables ที่เราตั้งไว้ใน .env
        return new Client({
          endPoint: process.env.MINIO_ENDPOINT,
          port: parseInt(process.env.MINIO_PORT, 10),
          useSSL: process.env.MINIO_USE_SSL === 'true',
          accessKey: process.env.MINIO_ACCESS_KEY,
          secretKey: process.env.MINIO_SECRET_KEY,
        });
      },
    },
  ],
  exports: [UploadService], // Export UploadService เพื่อให้ modules อื่นใช้งานได้
})
export class UploadModule {}

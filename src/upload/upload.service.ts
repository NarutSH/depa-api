import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class UploadService {
  constructor(
    @Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient,
  ) {}

  async uploadFile(file: Express.Multer.File, bucketName: string) {
    const uniqueFilename = `${file.originalname}-${Date.now()}`;

    const { data, error } = await this.supabase.storage
      .from(bucketName)
      .upload(uniqueFilename, file.buffer);

    if (error) {
      throw new BadRequestException(`File upload failed: ${error.message}`);
    }

    return data;
  }

  async uploadMultiFile(files: Express.Multer.File[], bucketName: string) {
    const uploadResults = [];

    for (const file of files) {
      const uniqueFilename = `${file.originalname}-${Date.now()}`;

      const { data, error } = await this.supabase.storage
        .from(bucketName)
        .upload(uniqueFilename, file.buffer);

      if (error) {
        throw new BadRequestException(`File upload failed: ${error.message}`);
      }

      uploadResults.push(data);
    }

    return uploadResults;
  }
}

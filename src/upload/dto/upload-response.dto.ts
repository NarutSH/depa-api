import { ApiProperty } from '@nestjs/swagger';

export class UploadFileResponseDto {
  @ApiProperty({
    description: 'Relative path of the uploaded file',
    example: 'portfolio/image-1642531200000.jpg',
  })
  path: string;

  @ApiProperty({
    description: 'Full path of the uploaded file',
    example: 'portfolio/image-1642531200000.jpg',
  })
  fullPath: string;

  @ApiProperty({
    description: 'Public URL to access the uploaded file',
    example:
      'https://digitalcontent.depa.or.th/uploads/portfolio/image-1642531200000.jpg',
  })
  publicUrl: string;

  @ApiProperty({
    description: 'File size in bytes',
    example: 1024576,
  })
  size: number;

  @ApiProperty({
    description: 'MIME type of the uploaded file',
    example: 'image/jpeg',
  })
  mimetype: string;
}

export class SingleUploadResponseDto {
  @ApiProperty({
    type: UploadFileResponseDto,
    description: 'Uploaded file information',
  })
  data: UploadFileResponseDto;

  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'File uploaded successfully',
  })
  message: string;
}

export class MultipleUploadResponseDto {
  @ApiProperty({
    type: [UploadFileResponseDto],
    description: 'Array of uploaded file information',
  })
  data: UploadFileResponseDto[];

  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Files uploaded successfully',
  })
  message: string;
}

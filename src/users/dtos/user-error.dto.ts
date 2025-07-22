import { ApiProperty } from '@nestjs/swagger';

export class UserErrorResponseDto {
  @ApiProperty({
    description: 'Error message',
    oneOf: [
      { type: 'string', example: 'User not found' },
      {
        type: 'array',
        items: { type: 'string' },
        example: ['Email must be a valid email', 'Full name is required'],
      },
    ],
  })
  message: string | string[];

  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error type',
    example: 'Bad Request',
  })
  error: string;

  @ApiProperty({ description: 'Operation success status', example: false })
  success: boolean;
}

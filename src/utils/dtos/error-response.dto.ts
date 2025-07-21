import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Bad Request',
  })
  message: string;

  @ApiProperty({
    description: 'Error description or detailed message',
    example: 'Validation failed',
    required: false,
  })
  error?: string;

  @ApiProperty({
    description: 'Request timestamp',
    example: '2025-01-01T00:00:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Request path',
    example: '/api/company',
  })
  path: string;
}

export class NotFoundErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 404,
  })
  statusCode: 404;

  @ApiProperty({
    description: 'Error message',
    example: 'Not Found',
  })
  message: string;
}

export class UnauthorizedErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 401,
  })
  statusCode: 401;

  @ApiProperty({
    description: 'Error message',
    example: 'Unauthorized',
  })
  message: string;
}

export class ValidationErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: 400;

  @ApiProperty({
    description: 'Array of validation error messages',
    example: ['nameTh should not be empty', 'juristicId must be a string'],
    type: [String],
  })
  message: string[];

  @ApiProperty({
    description: 'Error description or detailed message',
    example: 'Validation failed',
    required: false,
  })
  error?: string;

  @ApiProperty({
    description: 'Request timestamp',
    example: '2025-01-01T00:00:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Request path',
    example: '/api/company',
  })
  path: string;
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Auth guards removed - will be reimplemented

  // Swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle('DEPA API')
    .setDescription('The DEPA API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Portfolio', 'Portfolio management endpoints')
    .addTag('Company', 'Company management endpoints')
    .addTag('Freelance', 'Freelance management endpoints')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // บันทึก Swagger JSON ไปยังไฟล์
  fs.writeFileSync(
    path.resolve(process.cwd(), 'swagger.json'),
    JSON.stringify(document, null, 2),
  );

  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT || 8000);
}
bootstrap();

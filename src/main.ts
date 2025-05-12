import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Enable automatic transformation
      transformOptions: {
        enableImplicitConversion: true, // Enable implicit conversion of primitive types
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
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT || 8000);
}
bootstrap();

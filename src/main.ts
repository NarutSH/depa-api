import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BypassRolesGuard } from './auth/guards/bypass-roles.guard';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  // Set up global bypass guard - TEMPORARY for development
  console.log(
    '⚠️  WARNING: Using bypass authentication for all routes - DO NOT USE IN PRODUCTION ⚠️',
  );
  const reflector = new Reflector();
  app.useGlobalGuards(new BypassRolesGuard(reflector));

  // Swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle('DEPA API')
    .setDescription('The DEPA API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT || 8000);
}
bootstrap();

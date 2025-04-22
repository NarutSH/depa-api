import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './auth/guards/roles.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  // Set up global guards for role-based access control
  const reflector = new Reflector();
  app.useGlobalGuards(new RolesGuard(reflector));

  await app.listen(process.env.PORT || 8000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';
import * as bodyParser from 'body-parser';

// Error handling for unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);

  // In Supabase environment, the platform will auto-restart the service
  // So we just log the error properly instead of exiting immediately
  if (process.env.NODE_ENV !== 'production') {
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  }
});

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);

  // In Supabase environment, we let their infrastructure handle the restart
  if (process.env.NODE_ENV !== 'production') {
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  }
});

// Handle termination signals for graceful shutdown
const signals = ['SIGTERM', 'SIGINT', 'SIGHUP'] as const;
let app: any;

async function bootstrap() {
  app = await NestFactory.create(AppModule);

  // Increase limit to 50mb (adjust as needed)
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Ensure uploads directory exists
  // const uploadsDir =
  //   process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');

  const uploadsDir =
    process.env.UPLOAD_DIR && process.env.NODE_ENV === 'production'
      ? process.env.UPLOAD_DIR
      : path.join(process.cwd(), 'uploads');

  console.log('uploadsDir', fs.existsSync(uploadsDir));
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  // Add global error handler for NestJS
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.getInstance().on('error', (error) => {
    console.error('HTTP Server error:', error);
  });

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

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
    .addTag('Health', 'Health check endpoints')
    .addServer(
      process.env.API_BASE_URL || 'http://localhost:8000',
      'Development server',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => {
      return `${controllerKey}_${methodKey}`;
    },
  });

  // Save Swagger JSON to file
  fs.writeFileSync(
    path.resolve(process.cwd(), 'swagger.json'),
    JSON.stringify(document, null, 2),
  );

  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

// Set up graceful shutdown
for (const signal of signals) {
  process.on(signal, async () => {
    console.log(`Received ${signal}, closing server gracefully...`);
    try {
      if (app) {
        await app.close();
        console.log('HTTP server closed');
      }
      process.exit(0);
    } catch (err) {
      console.error('Error during graceful shutdown:', err);
      process.exit(1);
    }
  });
}

bootstrap();

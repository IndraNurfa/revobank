import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger();
  const nodeEnv = process.env.NODE_ENV || 'development';
  let options;

  if (nodeEnv === 'development') {
    options = { logger: true }; // Enable default logger
  } else {
    options = { logger: false }; // Explicitly disable logger in production
  }

  const app = await NestFactory.create(AppModule, options);

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Banking API')
    .setDescription('API for managing users, accounts, and transactions')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('accounts', 'Account management endpoints')
    .addTag('transactions', 'Transaction management endpoints')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

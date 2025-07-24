import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
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

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

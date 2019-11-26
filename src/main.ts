import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as path from 'path';
dotenv.config();
const port = process.env.PORT || 5000;
async function bootstrap() {
  console.log(process.env.NODE_ENV);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ disableErrorMessages: true }));
  app.useStaticAssets(path.join(__dirname, '..', 'public'));
  app.setBaseViewsDir(path.join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.enableCors();
  await app.listen(port);
  Logger.log(`Server listening on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();

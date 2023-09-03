import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as process from 'process';

async function bootstrap() {
  dotenv.config();

  console.log(process.env.ENV_TEST);
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();

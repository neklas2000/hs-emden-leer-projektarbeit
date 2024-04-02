import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import cookieParser from 'cookie-parser';
import { createDatabase } from 'typeorm-extension';

import { AppModule } from './app.module';
import config from './config';
import { AllExceptionsFilter } from './filters';

export async function bootstrap(port: number) {
  await createDatabase({
    initialDatabase: process.env.DB_NAME,
    ifNotExist: true,
    options: config,
  });

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost));
  app.use(cookieParser());

  await app.listen(port);
}

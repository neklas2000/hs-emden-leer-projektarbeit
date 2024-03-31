import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import { createDatabase } from 'typeorm-extension';

import { AppModule } from './app.module';
import config from './config';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

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

  await app.listen(port);
}

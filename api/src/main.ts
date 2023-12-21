import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

export async function bootstrap(port: number) {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api/v1');
  await app.listen(port);
}

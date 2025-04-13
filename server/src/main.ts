import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { JsonApiInterceptor } from './interceptors/json-api.interceptor';
import { RequestTimeoutInterceptor } from './interceptors/request-timeout.interceptor';
import { join } from 'path';
import { cwd } from 'process';

declare global {
	interface Object {
		isEmpty(args?: object): boolean;
	}
}

Object.isEmpty = function (args) {
	if (!args) return true;

	return Object.keys(args).length === 0;
};

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	const config = app.get(ConfigService);

	app.setGlobalPrefix('/api');
	app.enableVersioning();
	app.useGlobalInterceptors(new JsonApiInterceptor(), new RequestTimeoutInterceptor(config));
	app.useStaticAssets(join(cwd(), 'public'));

	await app.listen(config.get('PORT') ?? 3000);
}

bootstrap();

import { HttpAdapterHost, NestFactory } from '@nestjs/core';

import cookieParser from 'cookie-parser';
import { createDatabase } from 'typeorm-extension';

import { AppModule } from './app.module';
import config from './config';
import { AllExceptionsFilter } from '@Filters/all-exceptions.filter';
import { JsonApiInterceptor } from '@Interceptors/json-api.interceptor';
import { DateService } from '@Services/date.service';
import { VersioningType } from '@nestjs/common';

export async function bootstrap(port: number) {
	await createDatabase({
		initialDatabase: process.env.DB_NAME,
		ifNotExist: true,
		options: config,
	});

	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('/api');
	app.enableVersioning({
		type: VersioningType.URI,
	});
	const httpAdapterHost = app.get(HttpAdapterHost);
	const date = app.get(DateService);
	app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost, date));
	app.useGlobalInterceptors(new JsonApiInterceptor());
	app.use(cookieParser());

	await app.listen(port);
}

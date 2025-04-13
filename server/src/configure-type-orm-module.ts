import * as dotenv from 'dotenv';
dotenv.config();

import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { DataSource, DataSourceOptions } from 'typeorm';

import { ENTITIES } from './entities';

export function configureTypeOrmModule(): TypeOrmModuleOptions {
	return {
		type: 'mariadb',
		host: process.env.DB_HOST,
		port: Number.parseInt(process.env.DB_PORT),
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		entities: ENTITIES,
		migrations: [__dirname + '/migrations/*{.js,.ts}'],
		migrationsTableName: 'type_orm_migrations',
		logging: true,
		migrationsRun: true,
	};
}

export default new DataSource(<DataSourceOptions>configureTypeOrmModule());

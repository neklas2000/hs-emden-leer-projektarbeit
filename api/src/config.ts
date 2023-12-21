import { DataSourceOptions } from 'typeorm';

import Entities from './entities';

export default {
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: Entities,
  migrations: [__dirname + '/migrations/*{.js,.ts}'],
  migrationsTableName: 'type_orm_migrations',
  logging: true,
  migrationsRun: true,
} as DataSourceOptions;

import { DataSourceOptions } from 'typeorm';

import { MilestoneEstimate } from './project/milestone/estimate/entities';
import { Project } from './project/entities';
import { ProjectMember } from './project/member/entities';
import { ProjectMilestone } from './project/milestone/entities';
import { ProjectReport } from './project/report/entities';
import { TokenWhitelist } from './authentication/entities';
import { User } from './user/entities';

export default {
  type: 'mariadb',
  host: process.env.DB_HOST,
  port: Number.parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    MilestoneEstimate,
    Project,
    ProjectMember,
    ProjectMilestone,
    ProjectReport,
    TokenWhitelist,
    User,
  ],
  migrations: [__dirname + '/migrations/*{.js,.ts}'],
  migrationsTableName: 'type_orm_migrations',
  logging: true,
  migrationsRun: true,
} as DataSourceOptions;

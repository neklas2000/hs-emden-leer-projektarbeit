import { DataSourceOptions } from 'typeorm';

import { MilestoneEstimate } from '@Routes/MilestoneEstimate/entities';
import { Project } from '@Routes/Project/entities';
import { ProjectMember } from '@Routes/ProjectMember/entities';
import { ProjectMilestone } from '@Routes/ProjectMilestone/entities';
import { ProjectReport } from '@Routes/ProjectReport/entities';
import { TokenWhitelist } from '@Routes/Authentication/entities';
import { User } from '@Routes/User/entities';

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

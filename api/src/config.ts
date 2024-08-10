import * as dotenv from 'dotenv';
dotenv.config();

import { DataSourceOptions } from 'typeorm';

import { MilestoneEstimate } from '@Entities/milestone-estimate';
import { Project } from '@Entities/project';
import { ProjectMember } from '@Entities/project-member';
import { ProjectMilestone } from '@Entities/project-milestone';
import { ProjectReport } from '@Entities/project-report';
import { TokenWhitelist } from '@Entities/token-whitelist';
import { User } from '@Entities/user';

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

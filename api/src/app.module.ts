import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';

import config from './config';
import { AuthenticationModule } from '@Modules/authentication.module';
import { MilestoneEstimateModule } from '@Modules/milestone-estimate.module';
import { ProfileModule } from '@Modules/profile.module';
import { ProjectModule } from '@Modules/project.module';
import { ProjectMemberModule } from '@Modules/project-member.module';
import { ProjectMilestoneModule } from '@Modules/project-milestone.module';
import { ProjectReportModule } from '@Modules/project-report.module';
import { UserModule } from '@Modules/user.module';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: () => config,
		}),
		AuthenticationModule,
		MilestoneEstimateModule,
		ProfileModule,
		ProjectMemberModule,
		ProjectMilestoneModule,
		ProjectModule,
		ProjectReportModule,
		UserModule,
	],
})
export class AppModule {
	constructor(private dataSource: DataSource) {}
}

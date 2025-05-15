import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthenticationModule } from '@Modules/authentication/authentication.module';
import { FileadminModule } from '@Modules/fileadmin/fileadmin.module';
import { JsonSchemaModule } from '@Modules/json-schema/json-schema.module';
import { MailModule } from '@Modules/mail/mail.module';
import { MilestoneEstimateModule } from '@Modules/milestone-estimate/milestone-estimate.module';
import { ProfileModule } from '@Modules/profile/profile.module';
import { ProjectMemberModule } from '@Modules/project-member/project-member.module';
import { ProjectMilestoneModule } from '@Modules/project-milestone/project-milestone.module';
import { ProjectReportModule } from '@Modules/project-report/project-report.module';
import { ProjectModule } from '@Modules/project/project.module';
import { UserModule } from '@Modules/user/user.module';
import { ActivityModule } from '@Modules/activity/activity.module';
import { CommonModule } from './common/common.module';
import { configureTypeOrmModule } from './configure-type-orm-module';
import { ActivityPredecessorModule } from './modules/activity-predecessor/activity-predecessor.module';
import { ActivitySuccessorModule } from './modules/activity-successor/activity-successor.module';
import { AppSettingsModule } from './modules/app-settings/app-settings.module';

@Module({
	imports: [
		CommonModule,
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot(configureTypeOrmModule()),
		AuthenticationModule,
		FileadminModule,
		JsonSchemaModule,
		MilestoneEstimateModule,
		ProfileModule,
		ProjectMemberModule,
		ProjectMilestoneModule,
		ProjectReportModule,
		ProjectModule,
		UserModule,
		ActivityModule,
		MailModule,
		EventEmitterModule.forRoot({ global: true }),
		ActivityPredecessorModule,
		ActivitySuccessorModule,
		AppSettingsModule,
	],
})
export class AppModule {}

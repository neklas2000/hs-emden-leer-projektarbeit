import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';

import { AuthenticationModule } from './authentication/authentication.module';
import config from './config';
import { MilestoneEstimateModule } from './project/milestone/estimate/milestone-estimate.module';
import { ProfileModule } from './profile/profile.module';
import { ProjectMemberModule } from './project/member/project-member.module';
import { ProjectMilestoneModule } from './project/milestone/project-milestone.module';
import { ProjectModule } from './project/project.module';
import { ProjectReportModule } from './project/report/project-report.module';
import { UserModule } from './user/user.module';

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

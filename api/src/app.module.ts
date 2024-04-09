import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DataSource } from 'typeorm';

import config from './config';
import { AuthenticationModule } from '@Routes/Authentication/authentication.module';
import { MilestoneEstimateModule } from '@Routes/MilestoneEstimate/milestone-estimate.module';
import { ProfileModule } from '@Routes/Profile/profile.module';
import { ProjectMemberModule } from '@Routes/ProjectMember/project-member.module';
import { ProjectMilestoneModule } from '@Routes/ProjectMilestone/project-milestone.module';
import { ProjectModule } from '@Routes/Project/project.module';
import { ProjectReportModule } from '@Routes/ProjectReport/project-report.module';
import { UserModule } from '@Routes/User/user.module';

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

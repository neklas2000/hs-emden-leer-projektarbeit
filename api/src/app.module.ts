import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import {
  AuthenticationModule,
  MilestoneEstimateModule,
  ProjectMemberModule,
  ProjectMilestoneModule,
  ProjectReportModule,
  ProjectModule,
  UserModule,
} from './modules';
import config from './config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => config,
    }),
    AuthenticationModule,
    MilestoneEstimateModule,
    ProjectMemberModule,
    ProjectMilestoneModule,
    ProjectReportModule,
    ProjectModule,
    UserModule,
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}

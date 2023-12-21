import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import {
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

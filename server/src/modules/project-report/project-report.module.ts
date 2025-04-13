import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectReport } from '@Entities/project-report';
import { ProjectReportAppendix } from '@Entities/project-report-appendix';
import { ProjectReportService } from './project-report.service';
import { ProjectReportController } from './project-report.controller';
import { ProjectReportAppendixService } from './project-report-appendix.service';

@Module({
	imports: [TypeOrmModule.forFeature([ProjectReport, ProjectReportAppendix])],
	providers: [ProjectReportService, ProjectReportAppendixService],
	controllers: [ProjectReportController],
})
export class ProjectReportModule {}

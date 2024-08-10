import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectReportController } from '@Controllers/project-report.controller';
import { ProjectReport } from '@Entities/project-report';
import { ProjectReportService } from '@Services/project-report.service';

@Module({
	imports: [TypeOrmModule.forFeature([ProjectReport])],
	providers: [ProjectReportService],
	controllers: [ProjectReportController],
})
export class ProjectReportModule {}

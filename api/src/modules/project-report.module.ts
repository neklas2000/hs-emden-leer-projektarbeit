import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectReportController } from 'src/controllers/project-report.controller';
import { ProjectReport } from 'src/entities/project-report';
import { ProjectReportService } from 'src/services/project-report.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectReport])],
  providers: [ProjectReportService],
  controllers: [ProjectReportController],
})
export class ProjectReportModule {}

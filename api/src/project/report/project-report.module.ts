import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectReportController } from './controllers';
import { ProjectReport } from './entities';
import { ProjectReportService } from './services';

@Module({
	imports: [TypeOrmModule.forFeature([ProjectReport])],
	providers: [ProjectReportService],
	controllers: [ProjectReportController],
})
export class ProjectReportModule {}

import { Controller } from '@Common/decorators';
import { ProjectReport } from '@Entities/project-report';
import { CRUDControllerMixin } from '../crud-mixin.controller';
import { ProjectReportService } from './project-report.service';

@Controller(() => ProjectReport, {
	path: 'project-report',
	version: '1',
})
export class ProjectReportController extends CRUDControllerMixin(ProjectReport) {
	constructor(private readonly projectReports: ProjectReportService) {
		super(projectReports);
	}
}

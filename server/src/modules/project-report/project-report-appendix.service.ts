import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ProjectReportAppendix } from '@Entities/project-report-appendix';
import { CRUDService } from '@Modules/crud.service';

@Injectable()
export class ProjectReportAppendixService extends CRUDService<ProjectReportAppendix> {
	constructor(
		@InjectRepository(ProjectReportAppendix) repository: Repository<ProjectReportAppendix>,
	) {
		super(repository);
	}
}

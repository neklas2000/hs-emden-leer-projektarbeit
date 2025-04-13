import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ProjectReport } from '@Entities/project-report';
import { CRUDService } from '@Modules/crud.service';

@Injectable()
export class ProjectReportService extends CRUDService<ProjectReport> {
	constructor(@InjectRepository(ProjectReport) repository: Repository<ProjectReport>) {
		super(repository);
	}
}

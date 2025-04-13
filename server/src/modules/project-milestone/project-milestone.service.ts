import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ProjectMilestone } from '@Entities/project-milestone';
import { CRUDService } from '@Modules/crud.service';

@Injectable()
export class ProjectMilestoneService extends CRUDService<ProjectMilestone> {
	constructor(@InjectRepository(ProjectMilestone) repository: Repository<ProjectMilestone>) {
		super(repository);
	}
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ProjectActivity } from '@Entities/project-activity';
import { CRUDService } from '@Modules/crud.service';

@Injectable()
export class ActivityService extends CRUDService<ProjectActivity> {
	constructor(@InjectRepository(ProjectActivity) repository: Repository<ProjectActivity>) {
		super(repository);
	}
}

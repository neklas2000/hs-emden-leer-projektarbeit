import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Project } from '@Entities/project';
import { CRUDService } from '@Modules/crud.service';

@Injectable()
export class ProjectService extends CRUDService<Project> {
	constructor(@InjectRepository(Project) repository: Repository<Project>) {
		super(repository);
	}
}

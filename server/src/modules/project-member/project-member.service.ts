import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, Repository } from 'typeorm';

import { omit } from '@Common/utils';
import { ProjectMember } from '@Entities/project-member';
import { ProjectMemberAlreadyExistsException } from '@Exceptions/project-member-already-exists.exception';
import { CRUDService } from '@Modules/crud.service';
import { Mails } from '@Common/mails';

@Injectable()
export class ProjectMemberService extends CRUDService<ProjectMember> {
	constructor(
		@InjectRepository(ProjectMember)
		repository: Repository<ProjectMember>,
		private readonly events: EventEmitter2,
	) {
		super(repository);
	}

	async add(partialMember: DeepPartial<ProjectMember>) {
		const existingMember = await this.readOneBy({
			project: { id: partialMember.project.id },
			user: { id: partialMember.user.id },
		});

		if (existingMember) {
			throw new ProjectMemberAlreadyExistsException();
		}

		const projectMember = await this.createOne(partialMember, undefined, {
			user: true,
			project: {
				owner: true,
			},
		});

		this.events.emit(Mails.ProjectInvitation, projectMember);

		projectMember.user = <any>omit(projectMember.user, 'password');
		projectMember.project.owner = <any>omit(projectMember.project.owner, 'password');

		return projectMember;
	}
}

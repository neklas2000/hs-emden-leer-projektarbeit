import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
	DeepPartial,
	FindOptionsRelations,
	FindOptionsSelect,
	FindOptionsWhere,
	Repository,
} from 'typeorm';

import { ProjectMemberAlreadyExistsException } from '@Exceptions/project-member-already-exists.exception';
import { ProjectMember } from '@Routes/ProjectMember/entities';
import { Project } from '@Routes/Project/entities';

@Injectable()
export class ProjectMemberService {
	constructor(
		@InjectRepository(ProjectMember)
		private readonly projectMemberRepository: Repository<ProjectMember>,
		@InjectRepository(Project)
		private readonly projectRepository: Repository<Project>,
	) {}

	findAll(
		where: FindOptionsWhere<ProjectMember>,
		select: FindOptionsSelect<ProjectMember>,
		relations: FindOptionsRelations<ProjectMember>,
	): Promise<ProjectMember[]> {
		return this.projectMemberRepository.find({ where, select, relations });
	}

	findOne(
		id: string,
		where: FindOptionsWhere<ProjectMember>,
		select: FindOptionsSelect<ProjectMember>,
		relations: FindOptionsRelations<ProjectMember>,
	): Promise<ProjectMember> {
		return this.projectMemberRepository.findOne({
			where: {
				...where,
				id,
			},
			select,
			relations,
		});
	}

	createAll(memberPartials: DeepPartial<ProjectMember>[]): Promise<ProjectMember[]> {
		return Promise.all(
			memberPartials.map((memberPartial) => {
				const projectMember = this.projectMemberRepository.create(memberPartial);

				return projectMember.save();
			}),
		);
	}

	async create(memberPartial: DeepPartial<ProjectMember>): Promise<ProjectMember> {
		const existingMember: ProjectMember = await this.projectMemberRepository.findOneBy({
			project: {
				id: memberPartial.project.id,
			},
			user: {
				id: memberPartial.user.id,
			},
		});

		if (existingMember) {
			throw new ProjectMemberAlreadyExistsException();
		}

		const project = await this.projectRepository.findOneBy({
			id: memberPartial.project.id,
			owner: {
				id: memberPartial.user.id,
			},
		});

		if (project) {
			throw new ProjectMemberAlreadyExistsException();
		}

		const projectMember = this.projectMemberRepository.create(memberPartial);

		return projectMember.save();
	}

	async countInvites(userId: string): Promise<number> {
		const projectInvitations = await this.projectMemberRepository.findBy({
			user: {
				id: userId,
			},
			invitePending: true,
		});

		return projectInvitations.length;
	}
}

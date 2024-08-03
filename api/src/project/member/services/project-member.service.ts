import { Injectable, NotFoundException } from '@nestjs/common';
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
import { NoAffectedRowException } from '@Exceptions/no-affected-row.exception';
import { BadRequestException } from '@Exceptions/bad-request.exception';

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

	async update(id: string, updatedFields: DeepPartial<Project>): Promise<boolean> {
		try {
			const updated = await this.projectMemberRepository.update({ id }, updatedFields);

			if (updated.affected && updated.affected > 0) return true;

			throw new NoAffectedRowException(null);
		} catch (exception) {
			if (exception instanceof NoAffectedRowException) throw exception;

			throw new BadRequestException(exception);
		}
	}

	async delete(id: string): Promise<boolean> {
		try {
			const member = await this.findOne(id, {}, {}, {});

			if (!member) {
				throw new NotFoundException();
			}

			await member.remove();

			return true;
		} catch (exception) {
			if (exception instanceof NoAffectedRowException) throw exception;

			throw new BadRequestException(exception);
		}
	}
}

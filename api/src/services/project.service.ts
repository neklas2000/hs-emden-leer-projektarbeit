import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
	DeepPartial,
	FindOptionsRelations,
	FindOptionsSelect,
	FindOptionsWhere,
	Repository,
} from 'typeorm';

import { Project } from '@Entities/project';
import { ProjectMember } from '@Entities/project-member';
import { ProjectMilestone } from '@Entities/project-milestone';
import { BadRequestException } from '@Exceptions/bad-request.exception';
import { DeleteProjectNotAllowedException } from '@Exceptions/delete-project-not-allowed.exception';
import { NoAffectedRowException } from '@Exceptions/no-affected-row.exception';
import { ProjectMemberService } from '@Services/project-member.service';
import { ProjectMilestoneService } from '@Services/project-milestone.service';

@Injectable()
export class ProjectService {
	constructor(
		@InjectRepository(Project)
		private readonly projectRepository: Repository<Project>,
		private readonly milestoneService: ProjectMilestoneService,
		private readonly memberService: ProjectMemberService,
	) {}

	findAll(
		userId: string,
		where: FindOptionsWhere<Project>,
		select: FindOptionsSelect<Project>,
		relations: FindOptionsRelations<Project>,
	): Promise<Project[]> {
		const conditions: FindOptionsWhere<Project>[] = [];

		if (where.owner) {
			delete where.owner;
		}

		if (where.members) {
			delete where.members;
		}

		conditions.push({ owner: { id: userId } });
		conditions.push({ members: { user: { id: userId } } });
		conditions.push(where);

		return this.projectRepository.find({ where: conditions, select, relations });
	}

	findOne(
		id: string,
		where: FindOptionsWhere<Project>,
		select: FindOptionsSelect<Project>,
		relations: FindOptionsRelations<Project>,
	): Promise<Project> {
		return this.projectRepository.findOne({
			relations,
			select,
			where: {
				...where,
				id,
			},
		});
	}

	async create(project: DeepPartial<Project>, userId: string): Promise<Project> {
		try {
			const newProject = this.projectRepository.create({
				...project,
				owner: {
					id: userId,
				},
			});
			const createdProject = await this.projectRepository.save(newProject);

			if (project.milestones) {
				const projectMilestones = await this.milestoneService.createAll(
					project.milestones.map((milestone: DeepPartial<ProjectMilestone>) => {
						return {
							...milestone,
							project: {
								id: createdProject.id,
							},
						};
					}),
				);

				createdProject.milestones = projectMilestones;
			}

			if (project.members) {
				const projectMembers = await this.memberService.createAll(
					project.members.map((member: DeepPartial<ProjectMember>) => {
						return {
							...member,
							project: {
								id: createdProject.id,
							},
						};
					}),
				);

				createdProject.members = projectMembers;
			}

			return createdProject;
		} catch (exception) {
			throw new BadRequestException(exception);
		}
	}

	async update(id: string, updatedFields: DeepPartial<Project>): Promise<boolean> {
		try {
			const updated = await this.projectRepository.update({ id }, updatedFields);

			if (updated.affected && updated.affected > 0) return true;

			throw new NoAffectedRowException(null);
		} catch (exception) {
			if (exception instanceof NoAffectedRowException) throw exception;

			throw new BadRequestException(exception);
		}
	}

	async delete(id: string, userId: string): Promise<boolean> {
		try {
			const project = await this.findOne(
				id,
				{},
				{
					owner: {
						id: true,
					},
				},
				{
					owner: true,
				},
			);

			if (!project) {
				throw new NotFoundException();
			}

			if (project.owner.id !== userId) throw new DeleteProjectNotAllowedException(null);

			await this.projectRepository.remove(project);

			return true;
		} catch (exception) {
			if (exception instanceof NotFoundException) throw exception;
			if (exception instanceof DeleteProjectNotAllowedException) throw exception;

			throw new BadRequestException(exception);
		}
	}
}

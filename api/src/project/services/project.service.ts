import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
	DeepPartial,
	FindOptionsRelations,
	FindOptionsSelect,
	FindOptionsWhere,
	Repository,
} from 'typeorm';

import { BadRequestException } from '@Exceptions/bad-request.exception';
import { NoAffectedRowException } from '@Exceptions/no-affected-row.exception';
import { Project } from '@Routes/Project/entities';
import { ProjectMilestoneService } from '../milestone/services';
import { ProjectMemberService } from '../member/services';
import { ProjectMember } from '../member/entities';
import { ProjectMilestone } from '../milestone/entities';

@Injectable()
export class ProjectService {
	constructor(
		@InjectRepository(Project)
		private projectRepository: Repository<Project>,
		private readonly milestoneService: ProjectMilestoneService,
		private readonly memberService: ProjectMemberService,
	) {}

	findAll(
		where: FindOptionsWhere<Project>,
		select: FindOptionsSelect<Project>,
		relations: FindOptionsRelations<Project>,
	): Promise<Project[]> {
		const conditions: FindOptionsWhere<Project>[] = [];

		if (where.owner) {
			conditions.push({ owner: where.owner });
			delete where.owner;
		}

		if (where.members) {
			conditions.push({ members: where.members });
			delete where.members;
		}

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
			const createdProject = await newProject.save();

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
}

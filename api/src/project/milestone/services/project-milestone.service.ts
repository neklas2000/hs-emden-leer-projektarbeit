import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
	DeepPartial,
	FindOptionsRelations,
	FindOptionsSelect,
	FindOptionsWhere,
	Repository,
} from 'typeorm';

import { ProjectMilestone } from '@Routes/ProjectMilestone/entities';
import { NoAffectedRowException } from '@Exceptions/no-affected-row.exception';
import { BadRequestException } from '@Exceptions/bad-request.exception';

@Injectable()
export class ProjectMilestoneService {
	constructor(
		@InjectRepository(ProjectMilestone)
		private projectMilestoneRepository: Repository<ProjectMilestone>,
	) {}

	findAll(
		where: FindOptionsWhere<ProjectMilestone>,
		select: FindOptionsSelect<ProjectMilestone>,
		relations: FindOptionsRelations<ProjectMilestone>,
	): Promise<ProjectMilestone[]> {
		return this.projectMilestoneRepository.find({ where, select, relations });
	}

	findOne(
		id: string,
		where: FindOptionsWhere<ProjectMilestone>,
		select: FindOptionsSelect<ProjectMilestone>,
		relations: FindOptionsRelations<ProjectMilestone>,
	): Promise<ProjectMilestone> {
		return this.projectMilestoneRepository.findOne({
			where: {
				...where,
				id,
			},
			select,
			relations,
		});
	}

	createOne(payload: DeepPartial<ProjectMilestone>): Promise<ProjectMilestone> {
		if (Object.hasOwn(payload, 'id')) delete payload.id;
		const entity = this.projectMilestoneRepository.create(payload);

		return this.projectMilestoneRepository.save(entity, { reload: true });
	}

	createAll(milestonePartials: DeepPartial<ProjectMilestone>[]): Promise<ProjectMilestone[]> {
		return Promise.all(
			milestonePartials.map((milestonePartial) => {
				const projectMilestone = this.projectMilestoneRepository.create(milestonePartial);

				return projectMilestone.save();
			}),
		);
	}

	async update(id: string, updatedFields: DeepPartial<ProjectMilestone>): Promise<boolean> {
		try {
			const updated = await this.projectMilestoneRepository.update({ id }, updatedFields);

			if (updated.affected && updated.affected > 0) return true;

			throw new NoAffectedRowException(null);
		} catch (exception) {
			if (exception instanceof NoAffectedRowException) throw exception;

			throw new BadRequestException(exception);
		}
	}
}

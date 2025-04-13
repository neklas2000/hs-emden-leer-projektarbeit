import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
	DeepPartial,
	FindOptionsRelations,
	FindOptionsSelect,
	FindOptionsWhere,
	Repository,
} from 'typeorm';

import { MilestoneEstimate } from '@Entities/milestone-estimate';
import { ProjectMilestone } from '@Entities/project-milestone';
import { BadRequestException } from '@Exceptions/bad-request.exception';
import { NoAffectedRowException } from '@Exceptions/no-affected-row.exception';
import { MilestoneEstimateService } from '@Services/milestone-estimate.service';

@Injectable()
export class ProjectMilestoneService {
	constructor(
		@InjectRepository(ProjectMilestone)
		private readonly projectMilestoneRepository: Repository<ProjectMilestone>,
		private readonly milestoneEstimates: MilestoneEstimateService,
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

	async createOne(payload: DeepPartial<ProjectMilestone>): Promise<ProjectMilestone> {
		if (Object.hasOwn(payload, 'id')) delete payload.id;
		const insertResult = await this.projectMilestoneRepository.insert(payload);

		return {
			...payload,
			id: insertResult.identifiers[0].id,
			estimates: [],
			milestoneReached: false,
		} as ProjectMilestone;
	}

	createAll(milestonePartials: DeepPartial<ProjectMilestone>[]): Promise<ProjectMilestone[]> {
		return Promise.all(
			milestonePartials.map(async (milestonePartial) => {
				const insertResult = await this.projectMilestoneRepository.insert(milestonePartial);

				return {
					...milestonePartial,
					id: insertResult.identifiers[0].id,
					estimates: [],
					milestoneReached: false,
				} as ProjectMilestone;
			}),
		);
	}

	async update(id: string, updatedFields: DeepPartial<ProjectMilestone>): Promise<boolean> {
		try {
			let hadEstimates = false;
			let updatedEstimatesSuccessfully = false;

			if (updatedFields.estimates) {
				hadEstimates = true;

				const updates$ = updatedFields.estimates.map((estimate: DeepPartial<MilestoneEstimate>) => {
					const id = estimate.id;
					delete estimate.id;

					return this.milestoneEstimates.update(id, estimate);
				});

				const updateResults = await Promise.all(updates$);
				updatedEstimatesSuccessfully = !updateResults.includes(false);

				delete updatedFields.estimates;
			}

			if (Object.keys(updatedFields).length === 0) {
				if (hadEstimates) return updatedEstimatesSuccessfully;

				return true;
			}

			const updated = await this.projectMilestoneRepository.update({ id }, updatedFields);

			if (updated.affected && updated.affected > 0) {
				if (hadEstimates) return updatedEstimatesSuccessfully;

				return true;
			}

			throw new NoAffectedRowException(null);
		} catch (exception) {
			if (exception instanceof NoAffectedRowException) throw exception;

			throw new BadRequestException(exception);
		}
	}

	async delete(id: string): Promise<boolean> {
		try {
			const milestone = await this.findOne(id, {}, {}, {});

			if (!milestone) throw new BadRequestException(null);

			await this.projectMilestoneRepository.remove(milestone);

			return true;
		} catch (exception) {
			if (exception instanceof BadRequestException) throw exception;

			throw new BadRequestException(exception);
		}
	}
}

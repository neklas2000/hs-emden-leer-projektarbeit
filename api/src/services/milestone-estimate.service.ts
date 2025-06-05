import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, Repository } from 'typeorm';

import { MilestoneEstimate } from '@Entities/milestone-estimate';
import { NoAffectedRowException } from '@Exceptions/no-affected-row.exception';
import { BadRequestException } from '@Exceptions/bad-request.exception';
import { DateService } from '@Services/date.service';

@Injectable()
export class MilestoneEstimateService {
	constructor(
		@InjectRepository(MilestoneEstimate)
		private readonly milestoneEstimateRepository: Repository<MilestoneEstimate>,
		private readonly date: DateService,
	) {}

	async create(partialResource: DeepPartial<MilestoneEstimate>): Promise<MilestoneEstimate> {
		const insertResult = await this.milestoneEstimateRepository.insert(partialResource);

		if (partialResource.estimationDate) {
			if ((partialResource.estimationDate as any) instanceof Date) {
				partialResource.estimationDate = this.date.parseDate(partialResource.estimationDate as any);
			}
		}

		if (partialResource.reportDate) {
			if ((partialResource.reportDate as any) instanceof Date) {
				partialResource.reportDate = this.date.parseDate(partialResource.reportDate as any);
			}
		}

		return {
			...partialResource,
			id: insertResult.identifiers[0].id,
		} as MilestoneEstimate;
	}

	async update(id: string, updatedFields: DeepPartial<MilestoneEstimate>): Promise<boolean> {
		try {
			delete updatedFields.id;
			const updateResult = await this.milestoneEstimateRepository.update({ id }, updatedFields);

			if (updateResult.affected && updateResult.affected > 0) return true;

			throw new NoAffectedRowException(null);
		} catch (exception) {
			if (exception instanceof NoAffectedRowException) throw exception;

			throw new BadRequestException(exception);
		}
	}

	async delete(id: string): Promise<boolean> {
		try {
			const deleteResult = await this.milestoneEstimateRepository.delete({ id });

			if (deleteResult.affected && deleteResult.affected > 0) return true;

			throw new NoAffectedRowException(null);
		} catch (exception) {
			if (exception instanceof NoAffectedRowException) throw exception;

			throw new BadRequestException(exception);
		}
	}
}

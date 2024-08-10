import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
	DeepPartial,
	FindOptionsRelations,
	FindOptionsSelect,
	FindOptionsWhere,
	Repository,
} from 'typeorm';

import { ProjectReport } from '@Entities/project-report';
import { BadRequestException } from '@Exceptions/bad-request.exception';
import { NoAffectedRowException } from '@Exceptions/no-affected-row.exception';

@Injectable()
export class ProjectReportService {
	constructor(
		@InjectRepository(ProjectReport)
		private readonly projectReportRepository: Repository<ProjectReport>,
	) {}

	findOne(
		id: string,
		where: FindOptionsWhere<ProjectReport>,
		select: FindOptionsSelect<ProjectReport>,
		relations: FindOptionsRelations<ProjectReport>,
	): Promise<ProjectReport> {
		return this.projectReportRepository.findOne({
			where: {
				...where,
				id,
			},
			select,
			relations,
		});
	}

	async patchOne(id: string, payload: DeepPartial<ProjectReport>): Promise<boolean> {
		try {
			const updated = await this.projectReportRepository.update({ id }, payload);

			if (updated.affected && updated.affected > 0) return true;

			throw new NoAffectedRowException(null);
		} catch (exception) {
			if (exception instanceof NoAffectedRowException) throw exception;

			throw new BadRequestException(exception);
		}
	}

	create(partialReport: DeepPartial<ProjectReport>): Promise<ProjectReport> {
		const newReport = this.projectReportRepository.create(partialReport);

		return newReport.save();
	}
}

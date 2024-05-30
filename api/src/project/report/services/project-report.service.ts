import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
	DeepPartial,
	FindOptionsRelations,
	FindOptionsSelect,
	FindOptionsWhere,
	Repository,
} from 'typeorm';

import { BadRequestException, NoAffectedRowException } from '@Exceptions/index';
import { ProjectReport } from '@Routes/ProjectReport/entities';

@Injectable()
export class ProjectReportService {
	constructor(
		@InjectRepository(ProjectReport)
		private projectReportRepository: Repository<ProjectReport>,
	) {}

	findAll(
		where: FindOptionsWhere<ProjectReport>,
		select: FindOptionsSelect<ProjectReport>,
		relations: FindOptionsRelations<ProjectReport>,
	): Promise<ProjectReport[]> {
		return this.projectReportRepository.find({ where, select, relations });
	}

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

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

@Injectable()
export class ProjectService {
	constructor(
		@InjectRepository(Project)
		private projectRepository: Repository<Project>,
	) {}

	findAll(
		where: FindOptionsWhere<Project>,
		select: FindOptionsSelect<Project>,
		relations: FindOptionsRelations<Project>,
	): Promise<Project[]> {
		return this.projectRepository.find({ relations, select, where });
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

	create(project: DeepPartial<Project>): Promise<Project> {
		const newProject = this.projectRepository.create(project);

		return newProject.save();
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

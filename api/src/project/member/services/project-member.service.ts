import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { FindOptionsRelations, FindOptionsSelect, FindOptionsWhere, Repository } from 'typeorm';

import { ProjectMember } from '@Routes/ProjectMember/entities';

@Injectable()
export class ProjectMemberService {
	constructor(
		@InjectRepository(ProjectMember)
		private projectMemberRepository: Repository<ProjectMember>,
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
}

import { Test } from '@nestjs/testing';

import { Repository } from 'typeorm';

import { ProjectMember } from '../entities';
import {
	PROJECT_MEMBER_REPOSITORY_TOKEN,
	provideProjectMemberRepository,
} from '@Mocks/Providers/project-member-repository.provider';
import { ProjectMemberService } from './project-member.service';

describe('Service: ProjectMemberService', () => {
	let service: ProjectMemberService;
	let repository: Repository<ProjectMember>;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [ProjectMemberService, provideProjectMemberRepository()],
		}).compile();

		service = module.get(ProjectMemberService);
		repository = module.get(PROJECT_MEMBER_REPOSITORY_TOKEN);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should find all members', (done) => {
		jest
			.spyOn(repository, 'find')
			.mockResolvedValue(['Project Member 1', 'Project Member 2'] as any[]);

		service.findAll({}, {}, {}).then((result) => {
			expect(repository.find).toHaveBeenCalledWith({
				where: {},
				select: {},
				relations: {},
			});
			expect(result).toEqual(['Project Member 1', 'Project Member 2']);

			done();
		});
	});

	it('should find a member by the id', (done) => {
		jest.spyOn(repository, 'findOne').mockResolvedValue('Project Member' as any);

		service.findOne('1', {}, {}, {}).then((result) => {
			expect(repository.findOne).toHaveBeenCalledWith({
				where: {
					id: '1',
				},
				select: {},
				relations: {},
			});
			expect(result).toEqual('Project Member');

			done();
		});
	});
});

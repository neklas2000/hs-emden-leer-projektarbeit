import { Test } from '@nestjs/testing';

import { Repository } from 'typeorm';

import { ProjectMember } from '@Entities/project-member';
import { ProjectMemberService } from '@Services/project-member.service';
import { provideProjectRepository } from '@Test/Providers/project-repository.provider';
import {
	PROJECT_MEMBER_REPOSITORY_TOKEN,
	provideProjectMemberRepository,
} from '@Test/Providers/project-member-repository.provider';

describe('Service: ProjectMemberService', () => {
	let service: ProjectMemberService;
	let repository: Repository<ProjectMember>;

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			providers: [
				ProjectMemberService,
				provideProjectMemberRepository(),
				provideProjectRepository(),
			],
		}).compile();

		service = module.get(ProjectMemberService);
		repository = module.get(PROJECT_MEMBER_REPOSITORY_TOKEN);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
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

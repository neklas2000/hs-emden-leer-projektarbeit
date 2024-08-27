import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { Repository } from 'typeorm';

import { Project } from '@Entities/project';
import { ProjectMember, ProjectRole } from '@Entities/project-member';
import { BadRequestException } from '@Exceptions/bad-request.exception';
import { NoAffectedRowException } from '@Exceptions/no-affected-row.exception';
import { ProjectMemberAlreadyExistsException } from '@Exceptions/project-member-already-exists.exception';
import { ProjectMemberService } from '@Services/project-member.service';
import {
	PROJECT_REPOSITORY_TOKEN,
	provideProjectRepository,
} from '@Test/Providers/project-repository.provider';
import {
	PROJECT_MEMBER_REPOSITORY_TOKEN,
	provideProjectMemberRepository,
} from '@Test/Providers/project-member-repository.provider';

describe('Service: ProjectMemberService', () => {
	let service: ProjectMemberService;
	let repository: Repository<ProjectMember>;
	let projectRepository: Repository<Project>;

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
		projectRepository = module.get(PROJECT_REPOSITORY_TOKEN);
	});

	it('should create', () => {
		expect(service).toBeTruthy();
	});

	describe('findOne(string, FindOptionsWhere, FindOptionsSelect, FindOptionsRelations): Promise<ProjectMember>', () => {
		it('should find a member by the id', (done) => {
			const member = {
				id: '1',
				role: ProjectRole.Contributor,
				user: {
					id: '12',
				},
			} as any;
			jest.spyOn(repository, 'findOne').mockResolvedValue(member);

			service.findOne('1', {}, {}, { user: true }).then((result) => {
				expect(repository.findOne).toHaveBeenCalledWith({
					where: {
						id: '1',
					},
					select: {},
					relations: { user: true },
				});
				expect(result).toEqual(member);

				done();
			});
		});
	});

	describe('createAll(DeepPartial<ProjectMember>[]): Promise<ProjectMember[]>', () => {
		it('should create all project members', (done) => {
			let id = 0;
			const mockRepositoyCreate = jest.spyOn(repository, 'create').mockReturnValue({
				save: jest.fn(async () => {
					return {
						...mockRepositoyCreate.mock.calls[id][0],
						id: `${++id}`,
					};
				}),
			} as any);

			service
				.createAll([
					{ role: ProjectRole.Viewer, user: { id: '12' } },
					{ role: ProjectRole.Contributor, user: { id: '13' } },
				])
				.then((members) => {
					expect(members).toEqual([
						{ id: '1', role: ProjectRole.Viewer, user: { id: '12' } },
						{ id: '2', role: ProjectRole.Contributor, user: { id: '13' } },
					]);

					done();
				});
		});
	});

	describe('create(DeepPartial<ProjectMember>): Promise<ProjectMember>', () => {
		it('should throw an exception because the member already exists with this particular link between user and project', (done) => {
			jest.spyOn(repository, 'findOneBy').mockResolvedValue({} as any);
			jest.spyOn(repository, 'create');

			service
				.create({
					project: {
						id: '1',
					},
					user: {
						id: '12',
					},
				})
				.catch((exception) => {
					expect(exception).toBeInstanceOf(ProjectMemberAlreadyExistsException);
					expect(repository.create).not.toHaveBeenCalled();

					done();
				});
		});

		it('should throw an exception because the user tried to add the owner as a member', (done) => {
			jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
			jest.spyOn(projectRepository, 'findOneBy').mockResolvedValue({} as any);
			jest.spyOn(repository, 'create');

			service
				.create({
					project: {
						id: '1',
					},
					user: {
						id: '12',
					},
				})
				.catch((exception) => {
					expect(exception).toBeInstanceOf(ProjectMemberAlreadyExistsException);
					expect(repository.create).not.toHaveBeenCalled();

					done();
				});
		});

		it('should successfully create the new member', (done) => {
			jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
			jest.spyOn(projectRepository, 'findOneBy').mockResolvedValue(null);
			jest.spyOn(repository, 'create').mockReturnValue({
				save: jest.fn().mockResolvedValue({
					id: '14',
					role: ProjectRole.Contributor,
					project: {
						id: '1',
					},
					user: {
						id: '13',
					},
				}),
			} as any);

			service
				.create({
					role: ProjectRole.Contributor,
					project: {
						id: '1',
					},
					user: {
						id: '13',
					},
				})
				.then((result) => {
					expect(result).toEqual({
						id: '14',
						role: ProjectRole.Contributor,
						project: {
							id: '1',
						},
						user: {
							id: '13',
						},
					});

					done();
				});
		});
	});

	describe('update(string, DeepPartial<ProjectMember>): Promise<boolean>', () => {
		it('should throw an exception, due to a sql error', (done) => {
			const error = new Error('SQL ERROR: Sql query malformed');
			jest.spyOn(repository, 'update').mockRejectedValue(error);

			service.update('2', {}).catch((exception) => {
				expect(exception).toBeInstanceOf(BadRequestException);
				expect(exception).toHaveProperty('cause', error);

				done();
			});
		});

		it('should throw an exception, since a successful update could not be confirmed', (done) => {
			jest.spyOn(repository, 'update').mockResolvedValue({} as any);

			service.update('2', {}).catch((exception) => {
				expect(exception).toBeInstanceOf(NoAffectedRowException);

				done();
			});
		});

		it('should successfully update a project member', (done) => {
			jest.spyOn(repository, 'update').mockResolvedValue({
				affected: 1,
				raw: '',
				generatedMaps: [],
			});

			service.update('1', { role: ProjectRole.Viewer }).then((result) => {
				expect(result).toBe(true);

				done();
			});
		});
	});

	describe('delete(string): Promise<boolean>', () => {
		it('should throw an exception, due to a sql error', (done) => {
			const error = new Error('SQL ERROR: Sql query malformed');
			jest.spyOn(service, 'findOne').mockRejectedValue(error);

			service.delete('2').catch((exception) => {
				expect(exception).toBeInstanceOf(BadRequestException);
				expect(exception).toHaveProperty('cause', error);

				done();
			});
		});

		it('should throw an exception, since no member could be found under the given id', (done) => {
			jest.spyOn(service, 'findOne').mockResolvedValue(null);

			service.delete('2').catch((exception) => {
				expect(exception).toBeInstanceOf(NotFoundException);

				done();
			});
		});

		it('should successfully delete a project member', (done) => {
			jest.spyOn(service, 'findOne').mockResolvedValue({
				remove: jest.fn().mockResolvedValue(true),
			} as any);

			service.delete('1').then((result) => {
				expect(result).toBe(true);

				done();
			});
		});
	});
});

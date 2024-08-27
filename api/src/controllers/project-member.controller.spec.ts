import { Test } from '@nestjs/testing';

import { take } from 'rxjs';

import { ProjectMemberController } from '@Controllers/project-member.controller';
import { ProjectMember, ProjectRole } from '@Entities/project-member';
import { User } from '@Entities/user';
import { CryptoService } from '@Services/crypto.service';
import { ProjectMemberService } from '@Services/project-member.service';
import { UserService } from '@Services/user.service';
import { provideProjectRepository } from '@Test/Providers/project-repository.provider';
import { provideProjectMemberRepository } from '@Test/Providers/project-member-repository.provider';
import { provideUserRepository } from '@Test/Providers/user-repository.provider';

describe('Controller: ProjectMemberController', () => {
	let controller: ProjectMemberController;
	let projectMembers: ProjectMemberService;
	let users: UserService;
	let projectMember: ProjectMember;
	let user: User;

	beforeEach(async () => {
		user = {
			id: '1',
			academicTitle: null,
			firstName: 'Max',
			lastName: 'Mustermann',
			matriculationNumber: 1234567,
			email: 'max.mustermann@gmx.de',
			password: 'secure password',
			phoneNumber: null,
			projects: [
				{
					id: '12',
				},
			],
		} as any;
		projectMember = {
			id: '123',
			role: ProjectRole.Contributor,
			project: {
				id: '12',
			},
			user,
		} as any;

		const module = await Test.createTestingModule({
			providers: [
				ProjectMemberService,
				provideProjectMemberRepository(),
				UserService,
				provideUserRepository(),
				provideProjectRepository(),
				CryptoService,
			],
			controllers: [ProjectMemberController],
		}).compile();

		projectMembers = module.get(ProjectMemberService);
		users = module.get(UserService);
		controller = module.get(ProjectMemberController);
	});

	it('should create', () => {
		expect(projectMembers).toBeTruthy();
		expect(users).toBeTruthy();
		expect(controller).toBeTruthy();
	});

	describe('create(DeepPartial<ProjectMember>): Observable<ProjectMember>', () => {
		it('should create the project member and read the user', (done) => {
			const partialMember = { ...projectMember } as any;
			partialMember.user = { id: user.id };
			const expectedUser = { ...user };
			delete expectedUser.password;
			jest.spyOn(projectMembers, 'create').mockResolvedValue(partialMember);
			jest.spyOn(users, 'findById').mockResolvedValue(user);

			controller
				.create(partialMember)
				.pipe(take(1))
				.subscribe((result) => {
					expect(projectMembers.create).toHaveBeenCalledWith(partialMember);
					expect(users.findById).toHaveBeenCalledWith('1');
					expect(result).toEqual({
						...projectMember,
						user: expectedUser,
					});

					done();
				});
		});
	});

	describe('update(string, DeepPartial<ProjectMember>): Observable<Success>', () => {
		it('should update a project member and return the success response', (done) => {
			const updated = {
				...projectMember,
				role: ProjectRole.Viewer,
			};
			delete updated.project;
			delete updated.user;
			jest.spyOn(projectMembers, 'update').mockResolvedValue(true);

			controller
				.update('123', updated)
				.pipe(take(1))
				.subscribe((result) => {
					expect(projectMembers.update).toHaveBeenCalledWith('123', updated);
					expect(result).toEqual({ success: true });

					done();
				});
		});
	});

	describe('delete(string): Observable<Success>', () => {
		it('should delete a project member and return the success response', (done) => {
			jest.spyOn(projectMembers, 'delete').mockResolvedValue(true);

			controller
				.delete('123')
				.pipe(take(1))
				.subscribe((result) => {
					expect(projectMembers.delete).toHaveBeenCalledWith('123');
					expect(result).toEqual({ success: true });

					done();
				});
		});
	});
});

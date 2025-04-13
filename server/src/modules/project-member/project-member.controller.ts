import { Body, Post } from '@nestjs/common';

import { Observable } from 'rxjs';
import { DeepPartial } from 'typeorm';

import { Controller } from '@Common/decorators';
import { promiseToObervable } from '@Common/utils';
import { ProjectMember } from '@Entities/project-member';
import { CRUDControllerMixin } from '../crud-mixin.controller';
import { ProjectMemberService } from './project-member.service';

@Controller(() => ProjectMember, {
	path: 'projects/members',
	version: '1',
})
export class ProjectMemberController extends CRUDControllerMixin(ProjectMember) {
	constructor(private readonly projectMembers: ProjectMemberService) {
		super(projectMembers);
	}

	@Post('invite')
	inviteMember(@Body() payload: DeepPartial<ProjectMember>): Observable<ProjectMember> {
		return promiseToObervable(this.projectMembers.add(payload));
	}
}

import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { MailerService } from '@nestjs-modules/mailer';

import { ProjectMember } from '@Entities/project-member';

@Injectable()
export class MailService {
	constructor(private readonly mailer: MailerService) {}

	@OnEvent('project-member.invitation.send')
	sendInviteNotification(member: ProjectMember) {
		const { user, project, id: invite } = member;
		const ownerName = [];
		const targetedUser = [];

		if (user?.academicTitle) targetedUser.push(user.academicTitle);
		if (project?.owner?.academicTitle) ownerName.push(project.owner.academicTitle);
		if (user?.firstName) targetedUser.push(user.firstName);
		if (project?.owner?.firstName) ownerName.push(project.owner.firstName);
		if (user?.lastName) targetedUser.push(user.lastName);
		if (project?.owner?.lastName) ownerName.push(project.owner.lastName);

		this.mailer.sendMail({
			to: user.emailAddress,
			subject: 'You were invited to a new project',
			template: './project-invitation',
			context: {
				name: targetedUser.join(' '),
				projectName: project.name,
				projectOwner: ownerName.join(' '),
				url: `projects/${project.id}/invite/accept/${invite}`,
			},
		});
	}
}

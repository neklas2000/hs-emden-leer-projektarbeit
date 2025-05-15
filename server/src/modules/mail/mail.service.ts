import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { MailerService } from '@nestjs-modules/mailer';
import { UUID } from 'crypto';
import { DateTime } from 'luxon';
import Mail from 'nodemailer/lib/mailer';

import { Mails } from '@Common/mails';
import { Project } from '@Entities/project';
import { ProjectMember } from '@Entities/project-member';
import { User } from '@Entities/user';

type Changes<T> = {
	old: T;
	new: T;
};

@Injectable()
export class MailService {
	constructor(private readonly mailer: MailerService) {}

	@OnEvent(Mails.VerifyEMail)
	sendEMailVerificationNotification(user: User, verificationToken: string): void {
		const name = [];

		if (user?.academicTitle) name.push(user.academicTitle);
		if (user?.firstName) name.push(user.firstName);
		if (user?.lastName) name.push(user.lastName);

		this.mailer.sendMail({
			to: user.emailAddress,
			subject: 'Please verify your email address',
			template: './email-verification',
			context: {
				nameGerman: name.length > 0 ? name.join(' ') : 'Nutzer',
				nameEnglish: name.length > 0 ? name.join(' ') : 'User',
				verificationUrl: `verfiy/${verificationToken}`,
			},
		});
	}

	@OnEvent(Mails.ProjectInvitation)
	sendInviteNotification(member: ProjectMember): void {
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

	@OnEvent(Mails.ProjectChangesExcludingReport)
	sendProjectChangesNotification(
		previousProject: Project,
		updatedProject: Project,
		changedBy: User,
		recipients: User[],
	): void {
		const changedByName = [];

		if (changedBy?.academicTitle) changedByName.push(changedBy.academicTitle);
		changedByName.push(changedBy.firstName);
		changedByName.push(changedBy.lastName);

		let projectName: Changes<string> = null;
		let projectDuration: Changes<{ start: string; end: string }> = null;
		let reportInterval: Changes<number> = null;
		let projectType: Changes<string> = null;

		if (previousProject.name !== updatedProject.name) {
			projectName = {
				old: previousProject.name,
				new: updatedProject.name,
			};
		}

		if (
			previousProject.officialStart !== updatedProject.officialStart ||
			previousProject.officialEnd !== updatedProject.officialEnd
		) {
			const previous = {
				start: DateTime.fromSQL(previousProject.officialStart),
				end: DateTime.fromSQL(previousProject.officialEnd),
			};
			const updated = {
				start: DateTime.fromSQL(updatedProject.officialStart),
				end: DateTime.fromSQL(updatedProject.officialEnd),
			};

			projectDuration = {
				old: {
					start: `${previous.start.toFormat('dd.MM.yyyy')} (${previous.start.toFormat('MM/dd/yyyy')})`,
					end: previous.end.isValid
						? previous.end.toFormat('dd.MM.yyyy') + ` (${previous.end.toFormat('MM/dd/yyyy')})`
						: 'TBA',
				},
				new: {
					start: `${updated.start.toFormat('dd.MM.yyyy')} (${updated.start.toFormat('MM/dd/yyyy')})`,
					end: updated.end.isValid
						? updated.end.toFormat('dd.MM.yyyy') + ` (${updated.end.toFormat('MM/dd/yyyy')})`
						: 'TBA',
				},
			};
		}

		if (previousProject.reportInterval !== updatedProject.reportInterval) {
			reportInterval = {
				old: previousProject.reportInterval,
				new: updatedProject.reportInterval,
			};
		}

		if (previousProject.type !== updatedProject.type) {
			projectType = {
				old: previousProject.type,
				new: updatedProject.type,
			};
		}

		for (const recipient of recipients) {
			const name = [];

			if (recipient?.academicTitle) name.push(recipient.academicTitle);
			name.push(recipient.firstName);
			name.push(recipient.lastName);

			this.mailer.sendMail({
				to: recipient.emailAddress,
				subject: `The project ${previousProject.name} was changed`,
				template: './project-changes',
				context: {
					name: name.join(' '),
					changedBy: changedByName.join(' '),
					url: `projects/${previousProject.id}`,
					projectName,
					projectDuration,
					reportInterval,
					projectType,
				},
			});
		}
	}

	@OnEvent(Mails.NewProjectReport)
	sendNewProjectReportNotification(
		reportId: UUID,
		sequenceNumber: number,
		attachReport: boolean,
		projectId: UUID,
		projectName: string,
		recipients: User[],
	): void {
		const attachments: Mail.Attachment[] = [];

		if (attachReport) {
			// TODO: generate report pdf
			// push to attachments
		}

		for (const recipient of recipients) {
			const name = [];

			if (recipient?.academicTitle) name.push(recipient.academicTitle);
			name.push(recipient.firstName);
			name.push(recipient.lastName);

			this.mailer.sendMail({
				to: recipient.emailAddress,
				subject: 'A new project report has been created',
				template: './new-project-report',
				context: {
					name: name.join(' '),
					url: `projects/${projectId}/reports/${reportId}`,
					projectName,
					sequenceNumber,
				},
				attachments,
			});
		}
	}

	@OnEvent(Mails.LatestProjectReportChanges)
	sendLatestProjectReportChangesNotification(
		reportId: UUID,
		sequenceNumber: number,
		attachReport: boolean,
		projectId: UUID,
		projectName: string,
		recipients: User[],
	): void {
		const attachments: Mail.Attachment[] = [];

		if (attachReport) {
			// TODO: generate report pdf
			// push to attachments
		}

		for (const recipient of recipients) {
			const name = [];

			if (recipient?.academicTitle) name.push(recipient.academicTitle);
			name.push(recipient.firstName);
			name.push(recipient.lastName);

			this.mailer.sendMail({
				to: recipient.emailAddress,
				subject: 'The latest project report has been changed',
				template: './latest-project-report-changes',
				context: {
					name: name.join(' '),
					url: `projects/${projectId}/reports/${reportId}`,
					projectName,
					sequenceNumber,
				},
				attachments,
			});
		}
	}
}

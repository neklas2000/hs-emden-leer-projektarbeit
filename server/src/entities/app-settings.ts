import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { CommonEntityFields } from './common-entity-fields';
import { User } from './user';

enum AppLanguage {
	GERMAN = 'de',
	ENGLISH = 'en',
}

enum ColorMode {
	LIGHT = 'LIGHT',
	DARK = 'DARK',
}

enum PrimaryActionPosition {
	BOTTOM_RIGHT = 'bottom-right',
	TOOLBAR_BOTTOM_RIGHT = 'toolbar-bottom-right',
}

enum SnackbarPosition {
	TOP_LEFT = 'top-left',
	TOP_CENTER = 'top-center',
	TOP_RIGHT = 'top-right',
	BOTTOM_LEFT = 'bottom-left',
	BOTTOM_CENTER = 'bottom-center',
	BOTTOM_RIGHT = 'bottom-right',
}

@Entity('app_settings')
export class AppSettings extends CommonEntityFields {
	@Column({
		type: 'enum',
		enum: AppLanguage,
		default: AppLanguage.ENGLISH,
	})
	language: AppLanguage;

	@Column({
		type: 'enum',
		name: 'color_mode',
		enum: ColorMode,
		default: ColorMode.LIGHT,
	})
	colorMode: ColorMode;

	@Column({ type: 'varchar', name: 'date_format', default: 'dd.MM.YYYY' })
	dateFormat: string;

	@Column({ type: 'varchar', name: 'time_format', default: 'HH:mm' })
	timeFormat: string;

	@Column({
		type: 'enum',
		name: 'primary_action_position',
		enum: PrimaryActionPosition,
		default: PrimaryActionPosition.BOTTOM_RIGHT,
	})
	primaryActionPosition: PrimaryActionPosition;

	@Column({
		type: 'enum',
		name: 'snackbar_position',
		enum: SnackbarPosition,
		default: SnackbarPosition.TOP_RIGHT,
	})
	snackbarPosition: SnackbarPosition;

	@Column({
		type: 'tinyint',
		name: 'project_invitation',
		default: true,
	})
	projectInvitation: boolean;

	@Column({
		type: 'tinyint',
		name: 'project_changes',
		default: true,
	})
	projectChanges: boolean;

	@Column({
		type: 'tinyint',
		name: 'new_project_report',
		default: true,
	})
	newProjectReport: boolean;

	@Column({
		type: 'tinyint',
		name: 'new_project_report_attach_pdf',
		default: true,
	})
	newProjectReportAttachPdf: boolean;

	@Column({
		type: 'tinyint',
		name: 'latest_project_report_changes',
		default: true,
	})
	latestProjectReportChanges: boolean;

	@Column({
		type: 'tinyint',
		name: 'latest_project_report_changes_attach_pdf',
		default: true,
	})
	latestProjectReportChangesAttachPdf: boolean;

	@OneToOne(() => User, (user) => user.tokenPair, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'user_id' })
	user: User;
}

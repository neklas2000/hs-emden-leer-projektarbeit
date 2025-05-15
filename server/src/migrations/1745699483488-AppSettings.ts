import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppSettings1745699483488 implements MigrationInterface {
	name = 'AppSettings1745699483488';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE \`app_settings\` (\`id\` uuid NOT NULL DEFAULT UUID(), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`language\` enum ('de', 'en') NOT NULL DEFAULT 'en', \`color_mode\` enum ('LIGHT', 'DARK') NOT NULL DEFAULT 'LIGHT', \`date_format\` varchar(255) NOT NULL DEFAULT 'dd.MM.YYYY', \`time_format\` varchar(255) NOT NULL DEFAULT 'HH:mm', \`primary_action_position\` enum ('bottom-right', 'toolbar-bottom-right') NOT NULL DEFAULT 'bottom-right', \`snackbar_position\` enum ('top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right') NOT NULL DEFAULT 'top-right', \`project_invitation\` tinyint NOT NULL DEFAULT 1, \`project_changes\` tinyint NOT NULL DEFAULT 1, \`new_project_report\` tinyint NOT NULL DEFAULT 1, \`new_project_report_attach_pdf\` tinyint NOT NULL DEFAULT 1, \`latest_project_report_changes\` tinyint NOT NULL DEFAULT 1, \`latest_project_report_changes_attach_pdf\` tinyint NOT NULL DEFAULT 1, \`user_id\` uuid NULL, UNIQUE INDEX \`REL_5713bedeb08176edc8075049b3\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`ALTER TABLE \`app_settings\` ADD CONSTRAINT \`FK_5713bedeb08176edc8075049b3d\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`app_settings\` DROP FOREIGN KEY \`FK_5713bedeb08176edc8075049b3d\``,
		);
		await queryRunner.query(`DROP INDEX \`REL_5713bedeb08176edc8075049b3\` ON \`app_settings\``);
		await queryRunner.query(`DROP TABLE \`app_settings\``);
	}
}

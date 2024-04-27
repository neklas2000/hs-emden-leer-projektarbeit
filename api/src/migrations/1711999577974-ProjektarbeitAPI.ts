import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProjektarbeitAPI1711999577974 implements MigrationInterface {
	name = 'ProjektarbeitAPI1711999577974';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE \`token_whitelist\` (\`id\` uuid NOT NULL DEFAULT UUID(), \`access_token\` varchar(255) NULL, \`access_token_expiration_date\` datetime NOT NULL, \`refresh_token\` varchar(255) NULL, \`refresh_token_expiration_date\` datetime NOT NULL, \`userId\` uuid NULL, UNIQUE INDEX \`REL_fbe0e932e64303e1f63e3e16f5\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`user\` (\`id\` uuid NOT NULL DEFAULT UUID(), \`matriculation_number\` int NOT NULL, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, \`phone_number\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`project_member\` (\`id\` uuid NOT NULL DEFAULT UUID(), \`role\` enum ('contributor', 'viewer') NOT NULL, \`invite_pending\` tinyint NOT NULL, \`userId\` uuid NULL, \`projectId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`project_report\` (\`id\` uuid NOT NULL DEFAULT UUID(), \`sequence_number\` int NOT NULL, \`report_date\` date NOT NULL DEFAULT CURRENT_DATE, \`deliverables\` mediumtext NOT NULL, \`hazards\` mediumtext NOT NULL, \`objectives\` mediumtext NOT NULL, \`other\` mediumtext NULL, \`projectId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`project\` (\`id\` uuid NOT NULL DEFAULT UUID(), \`name\` varchar(255) NOT NULL, \`official_start\` date NOT NULL DEFAULT CURRENT_DATE, \`official_end\` date NULL, \`report_interval\` int NOT NULL DEFAULT '7', \`type\` varchar(255) NOT NULL, \`ownerId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`project_milestone\` (\`id\` uuid NOT NULL DEFAULT UUID(), \`name\` varchar(255) NOT NULL, \`projectId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`milestone_estimate\` (\`id\` uuid NOT NULL DEFAULT UUID(), \`report_date\` date NOT NULL DEFAULT CURRENT_DATE, \`estimation_date\` date NOT NULL, \`milestone_reached\` tinyint NOT NULL, \`milestoneId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`ALTER TABLE \`token_whitelist\` ADD CONSTRAINT \`FK_fbe0e932e64303e1f63e3e16f5e\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_member\` ADD CONSTRAINT \`FK_e7520163dafa7c1104fd672caad\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_member\` ADD CONSTRAINT \`FK_7115f82a61e31ac95b2681d83e4\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_report\` ADD CONSTRAINT \`FK_7e787585ded942fc095b659b594\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project\` ADD CONSTRAINT \`FK_9884b2ee80eb70b7db4f12e8aed\` FOREIGN KEY (\`ownerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_milestone\` ADD CONSTRAINT \`FK_f7accb0136106f3050f8e96c5e8\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`milestone_estimate\` ADD CONSTRAINT \`FK_2d04de5563e11736efb61e44285\` FOREIGN KEY (\`milestoneId\`) REFERENCES \`project_milestone\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`milestone_estimate\` DROP FOREIGN KEY \`FK_2d04de5563e11736efb61e44285\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_milestone\` DROP FOREIGN KEY \`FK_f7accb0136106f3050f8e96c5e8\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_9884b2ee80eb70b7db4f12e8aed\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_report\` DROP FOREIGN KEY \`FK_7e787585ded942fc095b659b594\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_member\` DROP FOREIGN KEY \`FK_7115f82a61e31ac95b2681d83e4\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_member\` DROP FOREIGN KEY \`FK_e7520163dafa7c1104fd672caad\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`token_whitelist\` DROP FOREIGN KEY \`FK_fbe0e932e64303e1f63e3e16f5e\``,
		);
		await queryRunner.query(`DROP TABLE \`milestone_estimate\``);
		await queryRunner.query(`DROP TABLE \`project_milestone\``);
		await queryRunner.query(`DROP TABLE \`project\``);
		await queryRunner.query(`DROP TABLE \`project_report\``);
		await queryRunner.query(`DROP TABLE \`project_member\``);
		await queryRunner.query(`DROP TABLE \`user\``);
		await queryRunner.query(`DROP INDEX \`REL_fbe0e932e64303e1f63e3e16f5\` ON \`token_whitelist\``);
		await queryRunner.query(`DROP TABLE \`token_whitelist\``);
	}
}

import { MigrationInterface, QueryRunner } from 'typeorm';

export class DatabaseSetup1741469657438 implements MigrationInterface {
	name = 'DatabaseSetup1741469657438';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE \`project_reports\` (\`id\` uuid NOT NULL DEFAULT UUID(), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`sequence_number\` int NOT NULL, \`report_date\` date NOT NULL DEFAULT CURRENT_DATE, \`deliverables\` longtext NOT NULL, \`hazards\` longtext NOT NULL, \`objectives\` longtext NOT NULL, \`other\` longtext NULL, \`projectId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`project_report_appendices\` (\`id\` uuid NOT NULL DEFAULT UUID(), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`fileId\` uuid NULL, \`reportId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`files\` (\`id\` uuid NOT NULL DEFAULT UUID(), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`mime_type\` varchar(255) NOT NULL, \`uri\` varchar(255) NOT NULL, \`uploadedById\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`token_pairs\` (\`id\` uuid NOT NULL DEFAULT UUID(), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`access_token\` varchar(255) NULL, \`access_token_expiration_date\` datetime NULL, \`refresh_token\` varchar(255) NULL, \`refresh_token_expiration_date\` datetime NULL, \`userId\` uuid NULL, UNIQUE INDEX \`REL_b02ac02fdbf32ac30f916bce32\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`users\` (\`id\` uuid NOT NULL DEFAULT UUID(), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`academic_title\` varchar(50) NULL, \`matriculation_number\` int NULL, \`first_name\` varchar(50) NULL, \`last_name\` varchar(50) NULL, \`email_address\` varchar(100) NOT NULL, \`password\` varchar(255) NOT NULL, \`phone_number\` varchar(255) NULL, INDEX \`IDX_b4c53700837c2670f9b30e4c71\` (\`academic_title\`, \`first_name\`, \`last_name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`project_members\` (\`id\` uuid NOT NULL DEFAULT UUID(), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`role\` enum ('contributor', 'tutor') NOT NULL, \`invite_pending\` tinyint NOT NULL DEFAULT 1, \`userId\` uuid NULL, \`projectId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`milestone_estimates\` (\`id\` uuid NOT NULL DEFAULT UUID(), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`report_date\` date NOT NULL DEFAULT CURRENT_DATE, \`estimated_date\` date NOT NULL, \`milestoneId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`project_milestones\` (\`id\` uuid NOT NULL DEFAULT UUID(), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(50) NOT NULL, \`is_reached\` tinyint NOT NULL DEFAULT 0, \`projectId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`projects\` (\`id\` uuid NOT NULL DEFAULT UUID(), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`official_start\` date NOT NULL DEFAULT CURRENT_DATE, \`official_end\` date NULL, \`report_interval\` int NOT NULL DEFAULT '7', \`type\` varchar(255) NULL, \`ownerId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`activity_successors\` (\`id\` uuid NOT NULL DEFAULT UUID(), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`hostActivityId\` uuid NULL, \`successorActivityId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`project_activities\` (\`id\` uuid NOT NULL DEFAULT UUID(), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`duration\` decimal(6,2) NOT NULL, \`start\` datetime NULL, \`end\` datetime NULL, \`projectId\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`CREATE TABLE \`activity_predecessors\` (\`id\` uuid NOT NULL DEFAULT UUID(), \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`host_activity_id\` uuid NULL, \`predecessor_activity_id\` uuid NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_reports\` ADD CONSTRAINT \`FK_912fa7d1c2002b61dbf6966cc3b\` FOREIGN KEY (\`projectId\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_report_appendices\` ADD CONSTRAINT \`FK_c79fdf84d0df68fd42ae5da6d94\` FOREIGN KEY (\`fileId\`) REFERENCES \`files\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_report_appendices\` ADD CONSTRAINT \`FK_e639762fd365f28723459267f96\` FOREIGN KEY (\`reportId\`) REFERENCES \`project_reports\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`files\` ADD CONSTRAINT \`FK_a525d85f0ac59aa9a971825e1af\` FOREIGN KEY (\`uploadedById\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`token_pairs\` ADD CONSTRAINT \`FK_b02ac02fdbf32ac30f916bce322\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_members\` ADD CONSTRAINT \`FK_08d1346ff91abba68e5a637cfdb\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_members\` ADD CONSTRAINT \`FK_d19892d8f03928e5bfc7313780c\` FOREIGN KEY (\`projectId\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`milestone_estimates\` ADD CONSTRAINT \`FK_472608f5c9045e6169fd77050c1\` FOREIGN KEY (\`milestoneId\`) REFERENCES \`project_milestones\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_milestones\` ADD CONSTRAINT \`FK_9fb847267f120c4cdbbb28b408b\` FOREIGN KEY (\`projectId\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`projects\` ADD CONSTRAINT \`FK_a8e7e6c3f9d9528ed35fe5bae33\` FOREIGN KEY (\`ownerId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`activity_successors\` ADD CONSTRAINT \`FK_bac4a847f50ba8a302b32a317fc\` FOREIGN KEY (\`hostActivityId\`) REFERENCES \`project_activities\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`activity_successors\` ADD CONSTRAINT \`FK_b8174965203b8276fb1a32a8928\` FOREIGN KEY (\`successorActivityId\`) REFERENCES \`project_activities\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_activities\` ADD CONSTRAINT \`FK_283f29c77364a5dd3613031727e\` FOREIGN KEY (\`projectId\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`activity_predecessors\` ADD CONSTRAINT \`FK_f63d3b302cd3d147908db553407\` FOREIGN KEY (\`host_activity_id\`) REFERENCES \`project_activities\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`activity_predecessors\` ADD CONSTRAINT \`FK_9a6f5d6a0e30ac3dc1211e97ebf\` FOREIGN KEY (\`predecessor_activity_id\`) REFERENCES \`project_activities\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`activity_predecessors\` DROP FOREIGN KEY \`FK_9a6f5d6a0e30ac3dc1211e97ebf\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`activity_predecessors\` DROP FOREIGN KEY \`FK_f63d3b302cd3d147908db553407\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_activities\` DROP FOREIGN KEY \`FK_283f29c77364a5dd3613031727e\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`activity_successors\` DROP FOREIGN KEY \`FK_b8174965203b8276fb1a32a8928\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`activity_successors\` DROP FOREIGN KEY \`FK_bac4a847f50ba8a302b32a317fc\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`projects\` DROP FOREIGN KEY \`FK_a8e7e6c3f9d9528ed35fe5bae33\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_milestones\` DROP FOREIGN KEY \`FK_9fb847267f120c4cdbbb28b408b\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`milestone_estimates\` DROP FOREIGN KEY \`FK_472608f5c9045e6169fd77050c1\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_members\` DROP FOREIGN KEY \`FK_d19892d8f03928e5bfc7313780c\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_members\` DROP FOREIGN KEY \`FK_08d1346ff91abba68e5a637cfdb\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`token_pairs\` DROP FOREIGN KEY \`FK_b02ac02fdbf32ac30f916bce322\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`files\` DROP FOREIGN KEY \`FK_a525d85f0ac59aa9a971825e1af\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_report_appendices\` DROP FOREIGN KEY \`FK_e639762fd365f28723459267f96\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_report_appendices\` DROP FOREIGN KEY \`FK_c79fdf84d0df68fd42ae5da6d94\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_reports\` DROP FOREIGN KEY \`FK_912fa7d1c2002b61dbf6966cc3b\``,
		);
		await queryRunner.query(`DROP TABLE \`activity_predecessors\``);
		await queryRunner.query(`DROP TABLE \`project_activities\``);
		await queryRunner.query(`DROP TABLE \`activity_successors\``);
		await queryRunner.query(`DROP TABLE \`projects\``);
		await queryRunner.query(`DROP TABLE \`project_milestones\``);
		await queryRunner.query(`DROP TABLE \`milestone_estimates\``);
		await queryRunner.query(`DROP TABLE \`project_members\``);
		await queryRunner.query(`DROP INDEX \`IDX_b4c53700837c2670f9b30e4c71\` ON \`users\``);
		await queryRunner.query(`DROP TABLE \`users\``);
		await queryRunner.query(`DROP INDEX \`REL_b02ac02fdbf32ac30f916bce32\` ON \`token_pairs\``);
		await queryRunner.query(`DROP TABLE \`token_pairs\``);
		await queryRunner.query(`DROP TABLE \`files\``);
		await queryRunner.query(`DROP TABLE \`project_report_appendices\``);
		await queryRunner.query(`DROP TABLE \`project_reports\``);
	}
}

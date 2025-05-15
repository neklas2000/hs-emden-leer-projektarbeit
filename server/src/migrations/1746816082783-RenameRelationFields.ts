import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameRelationFields1746816082783 implements MigrationInterface {
	name = 'RenameRelationFields1746816082783';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`project_reports\` DROP FOREIGN KEY \`FK_912fa7d1c2002b61dbf6966cc3b\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_report_appendices\` DROP FOREIGN KEY \`FK_c79fdf84d0df68fd42ae5da6d94\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_report_appendices\` DROP FOREIGN KEY \`FK_e639762fd365f28723459267f96\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`files\` DROP FOREIGN KEY \`FK_a525d85f0ac59aa9a971825e1af\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`token_pairs\` DROP FOREIGN KEY \`FK_b02ac02fdbf32ac30f916bce322\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_members\` DROP FOREIGN KEY \`FK_08d1346ff91abba68e5a637cfdb\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_members\` DROP FOREIGN KEY \`FK_d19892d8f03928e5bfc7313780c\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`milestone_estimates\` DROP FOREIGN KEY \`FK_472608f5c9045e6169fd77050c1\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_milestones\` DROP FOREIGN KEY \`FK_9fb847267f120c4cdbbb28b408b\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`projects\` DROP FOREIGN KEY \`FK_a8e7e6c3f9d9528ed35fe5bae33\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`activity_successors\` DROP FOREIGN KEY \`FK_b8174965203b8276fb1a32a8928\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`activity_successors\` DROP FOREIGN KEY \`FK_bac4a847f50ba8a302b32a317fc\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_activities\` DROP FOREIGN KEY \`FK_283f29c77364a5dd3613031727e\``,
		);
		await queryRunner.query(`DROP INDEX \`REL_b02ac02fdbf32ac30f916bce32\` ON \`token_pairs\``);
		await queryRunner.query(
			`ALTER TABLE \`project_reports\` CHANGE \`projectId\` \`project_id\` uuid NULL`,
		);
		await queryRunner.query(`ALTER TABLE \`files\` CHANGE \`uploadedById\` \`user_id\` uuid NULL`);
		await queryRunner.query(`ALTER TABLE \`token_pairs\` CHANGE \`userId\` \`user_id\` uuid NULL`);
		await queryRunner.query(
			`ALTER TABLE \`milestone_estimates\` CHANGE \`milestoneId\` \`milestone_id\` uuid NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_milestones\` CHANGE \`projectId\` \`project_id\` uuid NULL`,
		);
		await queryRunner.query(`ALTER TABLE \`projects\` CHANGE \`ownerId\` \`owner_id\` uuid NULL`);
		await queryRunner.query(
			`ALTER TABLE \`project_activities\` CHANGE \`projectId\` \`project_id\` uuid NULL`,
		);
		await queryRunner.query(`ALTER TABLE \`project_report_appendices\` DROP COLUMN \`fileId\``);
		await queryRunner.query(`ALTER TABLE \`project_report_appendices\` DROP COLUMN \`reportId\``);
		await queryRunner.query(`ALTER TABLE \`project_members\` DROP COLUMN \`userId\``);
		await queryRunner.query(`ALTER TABLE \`project_members\` DROP COLUMN \`projectId\``);
		await queryRunner.query(`ALTER TABLE \`activity_successors\` DROP COLUMN \`hostActivityId\``);
		await queryRunner.query(
			`ALTER TABLE \`activity_successors\` DROP COLUMN \`successorActivityId\``,
		);
		await queryRunner.query(`ALTER TABLE \`project_report_appendices\` ADD \`file_id\` uuid NULL`);
		await queryRunner.query(
			`ALTER TABLE \`project_report_appendices\` ADD \`report_id\` uuid NULL`,
		);
		await queryRunner.query(`ALTER TABLE \`project_members\` ADD \`user_id\` uuid NULL`);
		await queryRunner.query(`ALTER TABLE \`project_members\` ADD \`project_id\` uuid NULL`);
		await queryRunner.query(
			`ALTER TABLE \`activity_successors\` ADD \`host_activity_id\` uuid NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE \`activity_successors\` ADD \`successor_activity_id\` uuid NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_reports\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT UUID()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_reports\` CHANGE \`report_date\` \`report_date\` date NOT NULL DEFAULT CURRENT_DATE`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_report_appendices\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT UUID()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`files\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT UUID()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`token_pairs\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT UUID()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`token_pairs\` ADD UNIQUE INDEX \`IDX_1c79a316b93e2fb3c3e02bf3a3\` (\`user_id\`)`,
		);
		await queryRunner.query(
			`ALTER TABLE \`app_settings\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT UUID()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`app_settings\` DROP FOREIGN KEY \`FK_5713bedeb08176edc8075049b3d\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`users\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT UUID()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`users\` CHANGE \`matriculation_number\` \`matriculation_number\` int NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_members\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT UUID()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`milestone_estimates\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT UUID()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`milestone_estimates\` CHANGE \`report_date\` \`report_date\` date NOT NULL DEFAULT CURRENT_DATE`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_milestones\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT UUID()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`projects\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT UUID()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`projects\` CHANGE \`official_start\` \`official_start\` date NOT NULL DEFAULT CURRENT_DATE`,
		);
		await queryRunner.query(
			`ALTER TABLE \`activity_successors\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT UUID()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`activity_predecessors\` DROP FOREIGN KEY \`FK_9a6f5d6a0e30ac3dc1211e97ebf\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`activity_predecessors\` DROP FOREIGN KEY \`FK_f63d3b302cd3d147908db553407\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_activities\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT UUID()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`activity_predecessors\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT UUID()`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX \`REL_1c79a316b93e2fb3c3e02bf3a3\` ON \`token_pairs\` (\`user_id\`)`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_reports\` ADD CONSTRAINT \`FK_bdc205b19aefcf1cfe2f43d8815\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_report_appendices\` ADD CONSTRAINT \`FK_0921dbbe5f397e8ddcb02b14a89\` FOREIGN KEY (\`file_id\`) REFERENCES \`files\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_report_appendices\` ADD CONSTRAINT \`FK_cc36883c018ca5c7ff13e3007f9\` FOREIGN KEY (\`report_id\`) REFERENCES \`project_reports\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`files\` ADD CONSTRAINT \`FK_a7435dbb7583938d5e7d1376041\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`token_pairs\` ADD CONSTRAINT \`FK_1c79a316b93e2fb3c3e02bf3a3a\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`app_settings\` ADD CONSTRAINT \`FK_5713bedeb08176edc8075049b3d\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_members\` ADD CONSTRAINT \`FK_e89aae80e010c2faa72e6a49ce8\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_members\` ADD CONSTRAINT \`FK_b5729113570c20c7e214cf3f58d\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`milestone_estimates\` ADD CONSTRAINT \`FK_9519e095f4b0a918708f7a748be\` FOREIGN KEY (\`milestone_id\`) REFERENCES \`project_milestones\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_milestones\` ADD CONSTRAINT \`FK_4072d2ff8e9ee23e9e03e5f6721\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`projects\` ADD CONSTRAINT \`FK_b1bd2fbf5d0ef67319c91acb5cf\` FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`activity_successors\` ADD CONSTRAINT \`FK_9f56d0ed2c0dbc696d8017a39b7\` FOREIGN KEY (\`host_activity_id\`) REFERENCES \`project_activities\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`activity_successors\` ADD CONSTRAINT \`FK_4fc5dd5e5b4eb379334478b4b42\` FOREIGN KEY (\`successor_activity_id\`) REFERENCES \`project_activities\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_activities\` ADD CONSTRAINT \`FK_da57aaa2cda866acedacc09867f\` FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
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
			`ALTER TABLE \`project_activities\` DROP FOREIGN KEY \`FK_da57aaa2cda866acedacc09867f\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`activity_successors\` DROP FOREIGN KEY \`FK_4fc5dd5e5b4eb379334478b4b42\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`activity_successors\` DROP FOREIGN KEY \`FK_9f56d0ed2c0dbc696d8017a39b7\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`projects\` DROP FOREIGN KEY \`FK_b1bd2fbf5d0ef67319c91acb5cf\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_milestones\` DROP FOREIGN KEY \`FK_4072d2ff8e9ee23e9e03e5f6721\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`milestone_estimates\` DROP FOREIGN KEY \`FK_9519e095f4b0a918708f7a748be\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_members\` DROP FOREIGN KEY \`FK_b5729113570c20c7e214cf3f58d\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_members\` DROP FOREIGN KEY \`FK_e89aae80e010c2faa72e6a49ce8\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`app_settings\` DROP FOREIGN KEY \`FK_5713bedeb08176edc8075049b3d\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`token_pairs\` DROP FOREIGN KEY \`FK_1c79a316b93e2fb3c3e02bf3a3a\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`files\` DROP FOREIGN KEY \`FK_a7435dbb7583938d5e7d1376041\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_report_appendices\` DROP FOREIGN KEY \`FK_cc36883c018ca5c7ff13e3007f9\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_report_appendices\` DROP FOREIGN KEY \`FK_0921dbbe5f397e8ddcb02b14a89\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_reports\` DROP FOREIGN KEY \`FK_bdc205b19aefcf1cfe2f43d8815\``,
		);
		await queryRunner.query(`DROP INDEX \`REL_1c79a316b93e2fb3c3e02bf3a3\` ON \`token_pairs\``);
		await queryRunner.query(
			`ALTER TABLE \`activity_predecessors\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT uuid()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_activities\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT uuid()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`activity_predecessors\` ADD CONSTRAINT \`FK_f63d3b302cd3d147908db553407\` FOREIGN KEY (\`host_activity_id\`) REFERENCES \`project_activities\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`activity_predecessors\` ADD CONSTRAINT \`FK_9a6f5d6a0e30ac3dc1211e97ebf\` FOREIGN KEY (\`predecessor_activity_id\`) REFERENCES \`project_activities\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`activity_successors\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT uuid()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`projects\` CHANGE \`official_start\` \`official_start\` date NOT NULL DEFAULT curdate()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`projects\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT uuid()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_milestones\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT uuid()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`milestone_estimates\` CHANGE \`report_date\` \`report_date\` date NOT NULL DEFAULT curdate()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`milestone_estimates\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT uuid()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_members\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT uuid()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`users\` CHANGE \`matriculation_number\` \`matriculation_number\` int NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE \`users\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT uuid()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`app_settings\` ADD CONSTRAINT \`FK_5713bedeb08176edc8075049b3d\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`app_settings\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT uuid()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`token_pairs\` DROP INDEX \`IDX_1c79a316b93e2fb3c3e02bf3a3\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`token_pairs\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT uuid()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`files\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT uuid()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_report_appendices\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT uuid()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_reports\` CHANGE \`report_date\` \`report_date\` date NOT NULL DEFAULT curdate()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_reports\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT uuid()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`activity_successors\` DROP COLUMN \`successor_activity_id\``,
		);
		await queryRunner.query(`ALTER TABLE \`activity_successors\` DROP COLUMN \`host_activity_id\``);
		await queryRunner.query(`ALTER TABLE \`project_members\` DROP COLUMN \`project_id\``);
		await queryRunner.query(`ALTER TABLE \`project_members\` DROP COLUMN \`user_id\``);
		await queryRunner.query(`ALTER TABLE \`project_report_appendices\` DROP COLUMN \`report_id\``);
		await queryRunner.query(`ALTER TABLE \`project_report_appendices\` DROP COLUMN \`file_id\``);
		await queryRunner.query(
			`ALTER TABLE \`activity_successors\` ADD \`successorActivityId\` uuid NULL`,
		);
		await queryRunner.query(`ALTER TABLE \`activity_successors\` ADD \`hostActivityId\` uuid NULL`);
		await queryRunner.query(`ALTER TABLE \`project_members\` ADD \`projectId\` uuid NULL`);
		await queryRunner.query(`ALTER TABLE \`project_members\` ADD \`userId\` uuid NULL`);
		await queryRunner.query(`ALTER TABLE \`project_report_appendices\` ADD \`reportId\` uuid NULL`);
		await queryRunner.query(`ALTER TABLE \`project_report_appendices\` ADD \`fileId\` uuid NULL`);
		await queryRunner.query(
			`ALTER TABLE \`project_activities\` CHANGE \`project_id\` \`projectId\` uuid NULL`,
		);
		await queryRunner.query(`ALTER TABLE \`projects\` CHANGE \`owner_id\` \`ownerId\` uuid NULL`);
		await queryRunner.query(
			`ALTER TABLE \`project_milestones\` CHANGE \`project_id\` \`projectId\` uuid NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE \`milestone_estimates\` CHANGE \`milestone_id\` \`milestoneId\` uuid NULL`,
		);
		await queryRunner.query(`ALTER TABLE \`token_pairs\` CHANGE \`user_id\` \`userId\` uuid NULL`);
		await queryRunner.query(`ALTER TABLE \`files\` CHANGE \`user_id\` \`uploadedById\` uuid NULL`);
		await queryRunner.query(
			`ALTER TABLE \`project_reports\` CHANGE \`project_id\` \`projectId\` uuid NULL`,
		);
		await queryRunner.query(
			`CREATE UNIQUE INDEX \`REL_b02ac02fdbf32ac30f916bce32\` ON \`token_pairs\` (\`userId\`)`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_activities\` ADD CONSTRAINT \`FK_283f29c77364a5dd3613031727e\` FOREIGN KEY (\`projectId\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`activity_successors\` ADD CONSTRAINT \`FK_bac4a847f50ba8a302b32a317fc\` FOREIGN KEY (\`hostActivityId\`) REFERENCES \`project_activities\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`activity_successors\` ADD CONSTRAINT \`FK_b8174965203b8276fb1a32a8928\` FOREIGN KEY (\`successorActivityId\`) REFERENCES \`project_activities\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`projects\` ADD CONSTRAINT \`FK_a8e7e6c3f9d9528ed35fe5bae33\` FOREIGN KEY (\`ownerId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_milestones\` ADD CONSTRAINT \`FK_9fb847267f120c4cdbbb28b408b\` FOREIGN KEY (\`projectId\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`milestone_estimates\` ADD CONSTRAINT \`FK_472608f5c9045e6169fd77050c1\` FOREIGN KEY (\`milestoneId\`) REFERENCES \`project_milestones\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_members\` ADD CONSTRAINT \`FK_d19892d8f03928e5bfc7313780c\` FOREIGN KEY (\`projectId\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_members\` ADD CONSTRAINT \`FK_08d1346ff91abba68e5a637cfdb\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`token_pairs\` ADD CONSTRAINT \`FK_b02ac02fdbf32ac30f916bce322\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`files\` ADD CONSTRAINT \`FK_a525d85f0ac59aa9a971825e1af\` FOREIGN KEY (\`uploadedById\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_report_appendices\` ADD CONSTRAINT \`FK_e639762fd365f28723459267f96\` FOREIGN KEY (\`reportId\`) REFERENCES \`project_reports\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_report_appendices\` ADD CONSTRAINT \`FK_c79fdf84d0df68fd42ae5da6d94\` FOREIGN KEY (\`fileId\`) REFERENCES \`files\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_reports\` ADD CONSTRAINT \`FK_912fa7d1c2002b61dbf6966cc3b\` FOREIGN KEY (\`projectId\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
		);
	}
}

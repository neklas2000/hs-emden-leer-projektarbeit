import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProjectMemberInvitePendingDefault1717365845661 implements MigrationInterface {
	name = 'ProjectMemberInvitePendingDefault1717365845661';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`token_whitelist\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT UUID()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`token_whitelist\` DROP FOREIGN KEY \`FK_fbe0e932e64303e1f63e3e16f5e\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_member\` DROP FOREIGN KEY \`FK_e7520163dafa7c1104fd672caad\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project\` DROP FOREIGN KEY \`FK_9884b2ee80eb70b7db4f12e8aed\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`user\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT UUID()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_member\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT UUID()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_member\` CHANGE \`invite_pending\` \`invite_pending\` tinyint NOT NULL DEFAULT 1`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_report\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT UUID()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_report\` CHANGE \`report_date\` \`report_date\` date NOT NULL DEFAULT CURRENT_DATE`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_member\` DROP FOREIGN KEY \`FK_7115f82a61e31ac95b2681d83e4\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_report\` DROP FOREIGN KEY \`FK_7e787585ded942fc095b659b594\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_milestone\` DROP FOREIGN KEY \`FK_f7accb0136106f3050f8e96c5e8\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT UUID()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project\` CHANGE \`official_start\` \`official_start\` date NOT NULL DEFAULT CURRENT_DATE`,
		);
		await queryRunner.query(
			`ALTER TABLE \`milestone_estimate\` DROP FOREIGN KEY \`FK_2d04de5563e11736efb61e44285\``,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_milestone\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT UUID()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`milestone_estimate\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT UUID()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`milestone_estimate\` CHANGE \`report_date\` \`report_date\` date NOT NULL DEFAULT CURRENT_DATE`,
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
		await queryRunner.query(
			`ALTER TABLE \`milestone_estimate\` CHANGE \`report_date\` \`report_date\` date NOT NULL DEFAULT curdate()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`milestone_estimate\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT uuid()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_milestone\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT uuid()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`milestone_estimate\` ADD CONSTRAINT \`FK_2d04de5563e11736efb61e44285\` FOREIGN KEY (\`milestoneId\`) REFERENCES \`project_milestone\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project\` CHANGE \`official_start\` \`official_start\` date NOT NULL DEFAULT curdate()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT uuid()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_milestone\` ADD CONSTRAINT \`FK_f7accb0136106f3050f8e96c5e8\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_report\` ADD CONSTRAINT \`FK_7e787585ded942fc095b659b594\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_member\` ADD CONSTRAINT \`FK_7115f82a61e31ac95b2681d83e4\` FOREIGN KEY (\`projectId\`) REFERENCES \`project\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_report\` CHANGE \`report_date\` \`report_date\` date NOT NULL DEFAULT curdate()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_report\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT uuid()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_member\` CHANGE \`invite_pending\` \`invite_pending\` tinyint NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_member\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT uuid()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`user\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT uuid()`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project\` ADD CONSTRAINT \`FK_9884b2ee80eb70b7db4f12e8aed\` FOREIGN KEY (\`ownerId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`project_member\` ADD CONSTRAINT \`FK_e7520163dafa7c1104fd672caad\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`token_whitelist\` ADD CONSTRAINT \`FK_fbe0e932e64303e1f63e3e16f5e\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
		await queryRunner.query(
			`ALTER TABLE \`token_whitelist\` CHANGE \`id\` \`id\` uuid NOT NULL DEFAULT uuid()`,
		);
	}
}

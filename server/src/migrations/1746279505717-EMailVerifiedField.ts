import { MigrationInterface, QueryRunner } from 'typeorm';

export class EMailVerifiedField1746279505717 implements MigrationInterface {
	name = 'EMailVerifiedField1746279505717';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE \`users\` ADD \`email_verified\` tinyint NOT NULL DEFAULT 0`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`email_verified\``);
	}
}

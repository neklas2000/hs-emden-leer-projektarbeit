import { MigrationInterface, QueryRunner } from 'typeorm';

export class StoredProcedureAndEvent1711999597974 implements MigrationInterface {
	name = 'StoredProcedureAndEvent1711999597974';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE PROCEDURE RemoveExpiredTokens()
      BEGIN
        SET time_zone = 'Europe/Berlin';
        DELETE FROM token_whitelist WHERE refresh_token_expiration_date < NOW();
        UPDATE token_whitelist SET access_token = NULL WHERE access_token_expiration_date < NOW();
      END;
    `);
		await queryRunner.query(`
      CREATE EVENT IF NOT EXISTS RemoveExpiredTokensEvent
      ON SCHEDULE EVERY 5 MINUTE
      DO
        CALL RemoveExpiredTokens();
    `);
		await queryRunner.query(`SET GLOBAL event_scheduler = ON;`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`SET GLOBAL event_scheduler = OFF;`);
		await queryRunner.query(`DROP EVENT IF EXISTS RemoveExpiredTokensEvent;`);
		await queryRunner.query(`DROP PROCEDURE IF EXISTS RemoveExpiredTokens`);
	}
}

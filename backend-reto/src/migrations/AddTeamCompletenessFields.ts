import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTeamCompletenessFields implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE team 
            ADD COLUMN "isComplete" boolean NOT NULL DEFAULT false,
            ADD COLUMN "stadium" character varying,
            ADD COLUMN "city" character varying
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE team 
            DROP COLUMN "isComplete",
            DROP COLUMN "stadium",
            DROP COLUMN "city"
        `);
    }
}
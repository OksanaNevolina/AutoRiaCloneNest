import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1715451566408 implements MigrationInterface {
    name = 'Update1715451566408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission" ADD "description" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "description"`);
    }

}

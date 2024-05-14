import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUser1715706640563 implements MigrationInterface {
    name = 'UpdateUser1715706640563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "isBanned" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "isBanned" SET DEFAULT true`);
    }

}

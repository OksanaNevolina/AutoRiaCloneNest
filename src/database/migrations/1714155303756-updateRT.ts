import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRT1714155303756 implements MigrationInterface {
    name = 'UpdateRT1714155303756'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh-token" DROP COLUMN "deviceId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh-token" ADD "deviceId" text NOT NULL`);
    }

}

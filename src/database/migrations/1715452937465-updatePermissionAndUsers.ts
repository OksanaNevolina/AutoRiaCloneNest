import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePermissionAndUsers1715452937465 implements MigrationInterface {
    name = 'UpdatePermissionAndUsers1715452937465'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission" DROP CONSTRAINT "FK_8ec1323d871577a8795e54c9c4b"`);
        await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "user_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "permission" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "permission" ADD CONSTRAINT "FK_8ec1323d871577a8795e54c9c4b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1715276573109 implements MigrationInterface {
    name = 'Update1715276573109'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "status" TO "isBanned"`);
        await queryRunner.query(`ALTER TABLE "permission" ADD "name" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "permission" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ADD "currency" character varying(3) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ADD "currencyExchangeRate" numeric(10,4)`);
        await queryRunner.query(`ALTER TABLE "car" ADD "imageUrls" text`);
        await queryRunner.query(`ALTER TABLE "car" ADD "isActive" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ADD "createdById" uuid`);
        await queryRunner.query(`ALTER TABLE "currency_rate" ADD "ccy" character varying(3) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "currency_rate" ADD "buy" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "currency_rate" ADD "sale" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "permission" ADD CONSTRAINT "FK_8ec1323d871577a8795e54c9c4b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car" ADD CONSTRAINT "FK_622d6e7043376c503cba2325dab" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car" DROP CONSTRAINT "FK_622d6e7043376c503cba2325dab"`);
        await queryRunner.query(`ALTER TABLE "permission" DROP CONSTRAINT "FK_8ec1323d871577a8795e54c9c4b"`);
        await queryRunner.query(`ALTER TABLE "currency_rate" DROP COLUMN "sale"`);
        await queryRunner.query(`ALTER TABLE "currency_rate" DROP COLUMN "buy"`);
        await queryRunner.query(`ALTER TABLE "currency_rate" DROP COLUMN "ccy"`);
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "createdById"`);
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "imageUrls"`);
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "currencyExchangeRate"`);
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "currency"`);
        await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "permission" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "isBanned" TO "status"`);
    }

}

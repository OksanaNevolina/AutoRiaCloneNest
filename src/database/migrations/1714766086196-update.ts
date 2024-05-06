import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1714766086196 implements MigrationInterface {
    name = 'Update1714766086196'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "currency_rate" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a92517ae58f0f116bc0f792f878" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "currency_rate"`);
    }

}

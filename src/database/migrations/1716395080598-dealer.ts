import { MigrationInterface, QueryRunner } from "typeorm";

export class Dealer1716395080598 implements MigrationInterface {
    name = 'Dealer1716395080598'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "dealer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "address" character varying NOT NULL, "contact" character varying NOT NULL, CONSTRAINT "PK_1bd6073e224f6c22ff1d5827add" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "dealerId" uuid`);
        await queryRunner.query(`ALTER TABLE "car" ADD "dealerId" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_3f0bafe01288ec83331616e52d4" FOREIGN KEY ("dealerId") REFERENCES "dealer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car" ADD CONSTRAINT "FK_85e5a845f02dd479ae592a7b23d" FOREIGN KEY ("dealerId") REFERENCES "dealer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car" DROP CONSTRAINT "FK_85e5a845f02dd479ae592a7b23d"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_3f0bafe01288ec83331616e52d4"`);
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "dealerId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "dealerId"`);
        await queryRunner.query(`DROP TABLE "dealer"`);
    }

}

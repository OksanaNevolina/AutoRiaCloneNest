import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntityCarModelBrand1713902514122 implements MigrationInterface {
    name = 'UpdateEntityCarModelBrand1713902514122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ADD "price" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ADD "description" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ADD "region" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ADD "year" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car" ADD "brandId" uuid`);
        await queryRunner.query(`ALTER TABLE "car" ADD "modelId" uuid`);
        await queryRunner.query(`ALTER TABLE "car" ADD CONSTRAINT "FK_728700aee449838965f5cf87cee" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car" ADD CONSTRAINT "FK_c40870af5230c4d117729c8299f" FOREIGN KEY ("modelId") REFERENCES "model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car" DROP CONSTRAINT "FK_c40870af5230c4d117729c8299f"`);
        await queryRunner.query(`ALTER TABLE "car" DROP CONSTRAINT "FK_728700aee449838965f5cf87cee"`);
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "modelId"`);
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "brandId"`);
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "year"`);
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "region"`);
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "name"`);
    }

}

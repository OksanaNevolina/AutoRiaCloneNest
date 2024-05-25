import { MigrationInterface, QueryRunner } from "typeorm";

export class DealerUpdate1716490511764 implements MigrationInterface {
    name = 'DealerUpdate1716490511764'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dealer" ADD "createdDealerId" uuid`);
        await queryRunner.query(`ALTER TABLE "dealer" ADD CONSTRAINT "FK_bc1b55bcbcb71371baedbd97d8a" FOREIGN KEY ("createdDealerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dealer" DROP CONSTRAINT "FK_bc1b55bcbcb71371baedbd97d8a"`);
        await queryRunner.query(`ALTER TABLE "dealer" DROP COLUMN "createdDealerId"`);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVIEWlOG1715603847867 implements MigrationInterface {
    name = 'AddVIEWlOG1715603847867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "viewLog" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "timestamp" TIMESTAMP NOT NULL, "carId" uuid, CONSTRAINT "PK_15f68fd3a4f00e03e7af78307b1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "car" ADD "views" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "viewLog" ADD CONSTRAINT "FK_391ce6b5d5dfa228efde39e2067" FOREIGN KEY ("carId") REFERENCES "car"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "viewLog" DROP CONSTRAINT "FK_391ce6b5d5dfa228efde39e2067"`);
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "views"`);
        await queryRunner.query(`DROP TABLE "viewLog"`);
    }

}

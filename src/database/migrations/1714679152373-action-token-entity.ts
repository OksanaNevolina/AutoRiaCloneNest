import { MigrationInterface, QueryRunner } from "typeorm";

export class ActionTokenEntity1714679152373 implements MigrationInterface {
    name = 'ActionTokenEntity1714679152373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "action_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "actionToken" text NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_7dccd93e1b3cc165049f2991729" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "action_token" ADD CONSTRAINT "FK_ea64624c1b6177a2b0e4c9092fa" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "action_token" DROP CONSTRAINT "FK_ea64624c1b6177a2b0e4c9092fa"`);
        await queryRunner.query(`DROP TABLE "action_token"`);
    }

}

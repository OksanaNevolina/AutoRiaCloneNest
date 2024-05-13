import { MigrationInterface, QueryRunner } from "typeorm";

export class Update1715542029845 implements MigrationInterface {
    name = 'Update1715542029845'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permission_users_users" ("permissionId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_b561a5db58992f97f10d31062b4" PRIMARY KEY ("permissionId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_07a36b98dd038db7473acff777" ON "permission_users_users" ("permissionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_18b51dd0e5301d161cb56b8d6c" ON "permission_users_users" ("usersId") `);
        await queryRunner.query(`CREATE TABLE "users_permissions_permission" ("usersId" uuid NOT NULL, "permissionId" uuid NOT NULL, CONSTRAINT "PK_3404b5fe99c4ada03bc7d85b58b" PRIMARY KEY ("usersId", "permissionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a8ae4c08841340a12bb7e2db62" ON "users_permissions_permission" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_bb779b42732e822b848f9f32ad" ON "users_permissions_permission" ("permissionId") `);
        await queryRunner.query(`ALTER TABLE "permission_users_users" ADD CONSTRAINT "FK_07a36b98dd038db7473acff7778" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "permission_users_users" ADD CONSTRAINT "FK_18b51dd0e5301d161cb56b8d6cb" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users_permissions_permission" ADD CONSTRAINT "FK_a8ae4c08841340a12bb7e2db62a" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_permissions_permission" ADD CONSTRAINT "FK_bb779b42732e822b848f9f32ad5" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_permissions_permission" DROP CONSTRAINT "FK_bb779b42732e822b848f9f32ad5"`);
        await queryRunner.query(`ALTER TABLE "users_permissions_permission" DROP CONSTRAINT "FK_a8ae4c08841340a12bb7e2db62a"`);
        await queryRunner.query(`ALTER TABLE "permission_users_users" DROP CONSTRAINT "FK_18b51dd0e5301d161cb56b8d6cb"`);
        await queryRunner.query(`ALTER TABLE "permission_users_users" DROP CONSTRAINT "FK_07a36b98dd038db7473acff7778"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bb779b42732e822b848f9f32ad"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a8ae4c08841340a12bb7e2db62"`);
        await queryRunner.query(`DROP TABLE "users_permissions_permission"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_18b51dd0e5301d161cb56b8d6c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_07a36b98dd038db7473acff777"`);
        await queryRunner.query(`DROP TABLE "permission_users_users"`);
    }

}

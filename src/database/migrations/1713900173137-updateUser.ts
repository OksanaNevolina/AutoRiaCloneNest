import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUser1713900173137 implements MigrationInterface {
    name = 'UpdateUser1713900173137'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "status" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`CREATE TYPE "public"."users_accounttype_enum" AS ENUM('base', 'premium')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "accountType" "public"."users_accounttype_enum" NOT NULL DEFAULT 'base'`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('seller', 'manager', 'admin')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" "public"."users_role_enum" NOT NULL DEFAULT 'seller'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "accountType"`);
        await queryRunner.query(`DROP TYPE "public"."users_accounttype_enum"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
    }

}

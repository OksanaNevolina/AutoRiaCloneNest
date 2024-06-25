import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1718290450801 implements MigrationInterface {
    name = ' $npmConfigName1718290450801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "model" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "brandId" uuid, CONSTRAINT "PK_d6df271bba301d5cc79462912a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "brand" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_a5d20765ddd942eb5de4eee2d7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refresh-token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "refreshToken" text NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_62793706ec70c44e0bb5f448923" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "description" text NOT NULL, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dealer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "address" character varying NOT NULL, "contact" character varying NOT NULL, "createdDealerId" uuid, CONSTRAINT "PK_1bd6073e224f6c22ff1d5827add" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_accounttype_enum" AS ENUM('base', 'premium')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "isBanned" boolean NOT NULL DEFAULT false, "accountType" "public"."users_accounttype_enum" NOT NULL DEFAULT 'base', "role" character varying, "dealerId" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "car" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "price" numeric(10,2) NOT NULL, "currency" character varying(3) NOT NULL, "currencyExchangeRate" numeric(10,4), "imageUrls" text, "description" text NOT NULL, "region" character varying NOT NULL, "year" integer NOT NULL, "isActive" boolean NOT NULL, "views" integer NOT NULL DEFAULT '0', "brandId" uuid, "modelId" uuid, "createdById" uuid, "dealerId" uuid, CONSTRAINT "PK_55bbdeb14e0b1d7ab417d11ee6d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "viewLog" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "timestamp" TIMESTAMP NOT NULL, "carId" uuid, CONSTRAINT "PK_15f68fd3a4f00e03e7af78307b1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "currency_rate" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "ccy" character varying(3) NOT NULL, "buy" numeric(10,2) NOT NULL, "sale" numeric(10,2) NOT NULL, CONSTRAINT "PK_a92517ae58f0f116bc0f792f878" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "action_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "actionToken" text NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_7dccd93e1b3cc165049f2991729" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permission_users_users" ("permissionId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_b561a5db58992f97f10d31062b4" PRIMARY KEY ("permissionId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_07a36b98dd038db7473acff777" ON "permission_users_users" ("permissionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_18b51dd0e5301d161cb56b8d6c" ON "permission_users_users" ("usersId") `);
        await queryRunner.query(`CREATE TABLE "users_permissions_permission" ("usersId" uuid NOT NULL, "permissionId" uuid NOT NULL, CONSTRAINT "PK_3404b5fe99c4ada03bc7d85b58b" PRIMARY KEY ("usersId", "permissionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a8ae4c08841340a12bb7e2db62" ON "users_permissions_permission" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_bb779b42732e822b848f9f32ad" ON "users_permissions_permission" ("permissionId") `);
        await queryRunner.query(`ALTER TABLE "model" ADD CONSTRAINT "FK_7996700d600159cdf20dc0d0816" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh-token" ADD CONSTRAINT "FK_0f25c0e45e3acbd833ca32ea671" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "dealer" ADD CONSTRAINT "FK_bc1b55bcbcb71371baedbd97d8a" FOREIGN KEY ("createdDealerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_3f0bafe01288ec83331616e52d4" FOREIGN KEY ("dealerId") REFERENCES "dealer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car" ADD CONSTRAINT "FK_728700aee449838965f5cf87cee" FOREIGN KEY ("brandId") REFERENCES "brand"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car" ADD CONSTRAINT "FK_c40870af5230c4d117729c8299f" FOREIGN KEY ("modelId") REFERENCES "model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car" ADD CONSTRAINT "FK_622d6e7043376c503cba2325dab" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car" ADD CONSTRAINT "FK_85e5a845f02dd479ae592a7b23d" FOREIGN KEY ("dealerId") REFERENCES "dealer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "viewLog" ADD CONSTRAINT "FK_391ce6b5d5dfa228efde39e2067" FOREIGN KEY ("carId") REFERENCES "car"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "action_token" ADD CONSTRAINT "FK_ea64624c1b6177a2b0e4c9092fa" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
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
        await queryRunner.query(`ALTER TABLE "action_token" DROP CONSTRAINT "FK_ea64624c1b6177a2b0e4c9092fa"`);
        await queryRunner.query(`ALTER TABLE "viewLog" DROP CONSTRAINT "FK_391ce6b5d5dfa228efde39e2067"`);
        await queryRunner.query(`ALTER TABLE "car" DROP CONSTRAINT "FK_85e5a845f02dd479ae592a7b23d"`);
        await queryRunner.query(`ALTER TABLE "car" DROP CONSTRAINT "FK_622d6e7043376c503cba2325dab"`);
        await queryRunner.query(`ALTER TABLE "car" DROP CONSTRAINT "FK_c40870af5230c4d117729c8299f"`);
        await queryRunner.query(`ALTER TABLE "car" DROP CONSTRAINT "FK_728700aee449838965f5cf87cee"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_3f0bafe01288ec83331616e52d4"`);
        await queryRunner.query(`ALTER TABLE "dealer" DROP CONSTRAINT "FK_bc1b55bcbcb71371baedbd97d8a"`);
        await queryRunner.query(`ALTER TABLE "refresh-token" DROP CONSTRAINT "FK_0f25c0e45e3acbd833ca32ea671"`);
        await queryRunner.query(`ALTER TABLE "model" DROP CONSTRAINT "FK_7996700d600159cdf20dc0d0816"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bb779b42732e822b848f9f32ad"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a8ae4c08841340a12bb7e2db62"`);
        await queryRunner.query(`DROP TABLE "users_permissions_permission"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_18b51dd0e5301d161cb56b8d6c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_07a36b98dd038db7473acff777"`);
        await queryRunner.query(`DROP TABLE "permission_users_users"`);
        await queryRunner.query(`DROP TABLE "action_token"`);
        await queryRunner.query(`DROP TABLE "currency_rate"`);
        await queryRunner.query(`DROP TABLE "viewLog"`);
        await queryRunner.query(`DROP TABLE "car"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_accounttype_enum"`);
        await queryRunner.query(`DROP TABLE "dealer"`);
        await queryRunner.query(`DROP TABLE "permission"`);
        await queryRunner.query(`DROP TABLE "refresh-token"`);
        await queryRunner.query(`DROP TABLE "brand"`);
        await queryRunner.query(`DROP TABLE "model"`);
    }

}

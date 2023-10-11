import { MigrationInterface, QueryRunner } from "typeorm";

export class UserFeatures1694696247438 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE SCHEMA IF NOT EXISTS "extensions";
        CREATE EXTENSION IF NOT EXISTS vector;
        CREATE SCHEMA IF NOT EXISTS "features";
        `);
        await queryRunner.query(`
        CREATE TABLE "features"."customer_features" (
            "customerId" VARCHAR NOT NULL,
            "uniqueName" TEXT NOT NULL,
            "vector" vector(384),
            "metadata" JSONB NULL,
        
            CONSTRAINT "user_features_pkey" PRIMARY KEY ("customerId")
        )`);
        await queryRunner.query(`
        ALTER TABLE "features"."customer_features" ADD CONSTRAINT "customer_features_productId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."customer"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "features"."customer_features"`)
    }

}

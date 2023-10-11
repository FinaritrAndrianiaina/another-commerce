import { MigrationInterface, QueryRunner } from "typeorm"

export class ProductFeatures1694686932724 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE SCHEMA IF NOT EXISTS "extensions";
        CREATE EXTENSION IF NOT EXISTS vector;
        CREATE SCHEMA IF NOT EXISTS "features";
        `);
        await queryRunner.query(`
        CREATE TABLE "features"."product_features" (
            "productId" VARCHAR NOT NULL,
            "uniqueName" TEXT NOT NULL,
            "vector" vector(384),
            "metadata" JSONB NULL,
        
            CONSTRAINT "product_features_pkey" PRIMARY KEY ("productId")
        )`);
        await queryRunner.query(`
        ALTER TABLE "features"."product_features" ADD CONSTRAINT "product_features_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "features"."product_features"`)
    }

}

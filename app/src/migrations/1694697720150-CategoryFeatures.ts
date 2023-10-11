import { MigrationInterface, QueryRunner } from "typeorm"

export class CategoryFeatures1694697720150 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE SCHEMA IF NOT EXISTS "extensions";
        CREATE EXTENSION IF NOT EXISTS vector;
        CREATE SCHEMA IF NOT EXISTS "features";
        `);
        await queryRunner.query(`
        CREATE TABLE "features"."category_features" (
            "categoryId" VARCHAR NOT NULL,
            "uniqueName" TEXT NOT NULL,
            "vector" vector(384),
            "metadata" JSONB NULL,
        
            CONSTRAINT "category_features_pkey" PRIMARY KEY ("categoryId")
        )`);
        await queryRunner.query(`
        ALTER TABLE "features"."category_features" ADD CONSTRAINT "category_features_productId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."product_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "features"."category_features"`)
    }

}

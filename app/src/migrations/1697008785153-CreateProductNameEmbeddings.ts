import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateProductNameEmbeddings1697008785153 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
ALTER TABLE
  "features"."product_features"
ADD COLUMN
  "name_embeddings" vector NULL;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
ALTER TABLE
  "features"."product_features"
DROP COLUMN
  "name_embeddings";
        `);
    }

}

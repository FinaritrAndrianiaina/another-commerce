import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateProductAggregate1694875298278 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE SCHEMA IF NOT EXISTS "extensions";
        CREATE EXTENSION IF NOT EXISTS vector;
        CREATE SCHEMA IF NOT EXISTS "features";
        `);
        await queryRunner.query(`
CREATE OR REPLACE FUNCTION features.update_product_preference_aggregate(product VARCHAR) RETURNS VOID  AS $$
  DECLARE
      prooduct_preference_aggregate vector;
  BEGIN
      -- Calculate the average product vector
      select AVG(cf.vector) into prooduct_preference_aggregate
        from public.product p
        join product_category_product pcp on pcp.product_id = p.id
        join public.product_category c on c.id = pcp.product_category_id
        join features.category_features cf on c.id = cf."categoryId"
      where p.id = product;
  
      -- Update preferenceAggregate for the specified profile
      UPDATE features.product_features
          SET vector = prooduct_preference_aggregate
      WHERE "productId" = product;
  
      -- Display a success message
      RAISE NOTICE 'PreferenceAggregate updated for product %', product;
END;
$$ LANGUAGE plpgsql;
        `);
        await queryRunner.query(`
CREATE OR REPLACE FUNCTION features.trigger_product_preference_aggregate() RETURNS TRIGGER AS $$
BEGIN
    PERFORM features.update_product_preference_aggregate(new.product_id);
    RETURN new;
END;
$$ LANGUAGE plpgsql;
        `);
        await queryRunner.query(`
CREATE TRIGGER on_update_product_preference_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public."product_category_product"
    FOR EACH ROW
EXECUTE FUNCTION features.trigger_product_preference_aggregate();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
DROP TRIGGER  on_update_product_preference_trigger ON public."product_category_product";
DROP FUNCTION features.trigger_product_preference_aggregate;
DROP FUNCTION features.update_product_preference_aggregate;
        `);
    }

}

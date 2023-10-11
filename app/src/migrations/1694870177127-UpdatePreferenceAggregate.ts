import {MigrationInterface, QueryRunner} from "typeorm"

export class UpdatePreferenceAggregate1694870177127 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE SCHEMA IF NOT EXISTS "extensions";
        CREATE EXTENSION IF NOT EXISTS vector;
        CREATE SCHEMA IF NOT EXISTS "features";
        `);
        await queryRunner.query(`
CREATE OR REPLACE FUNCTION features.update_preference_aggregate(customer VARCHAR) RETURNS VOID  AS $$
  DECLARE
      customer_preference_aggregate vector;
  BEGIN
      -- Calculate the average product vector
      select AVG(product_features.vector) into customer_preference_aggregate from
        public."order"  join line_item on line_item.order_id = public."order".id
          join product_variant on product_variant.id = line_item.variant_id
          join product on product.id = product_variant.product_id
          join features.product_features product_features on product_features."productId" = product.id
      where public."order".customer_id = customer;
  
      -- Update preferenceAggregate for the specified profile
      UPDATE features."customer_features"
          SET vector = customer_preference_aggregate
      WHERE "customerId" = customer;
  
      -- Display a success message
      RAISE NOTICE 'PreferenceAggregate updated for customer %', customer;
END;
$$ LANGUAGE plpgsql;
        `);
        await queryRunner.query(`
CREATE OR REPLACE FUNCTION features.trigger_update_aggregate() RETURNS TRIGGER AS $$
BEGIN
    PERFORM features.UPDATE_PREFERENCE_AGGREGATE(new.customer_id);
    RETURN new;
END;
$$ LANGUAGE plpgsql;
        `);
        await queryRunner.query(`
CREATE TRIGGER on_update_preference_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public."order"
    FOR EACH ROW
EXECUTE FUNCTION features.TRIGGER_UPDATE_AGGREGATE();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
DROP TRIGGER  on_update_preference_trigger ON public."order";
DROP FUNCTION features.trigger_update_aggregate;
DROP FUNCTION features.update_preference_aggregate;
        `);
    }

}

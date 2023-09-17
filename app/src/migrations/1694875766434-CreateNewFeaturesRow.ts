import {MigrationInterface, QueryRunner} from "typeorm"

export class CreateNewFeaturesRow1694875766434 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
CREATE OR REPLACE FUNCTION features.trigger_create_customer() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO features."customer_features"
       ("customerId", "uniqueName", "metadata") 
                VALUES (new.id, new.email, new.metadata);
    RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_create_customer
  AFTER INSERT ON public."customer"
    FOR EACH ROW
EXECUTE FUNCTION features.trigger_create_customer();

CREATE OR REPLACE FUNCTION features.trigger_create_product() RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO features."product_features"
       ("productId", "uniqueName", "metadata") 
                VALUES (new.id, CONCAT(new.id,' ',new.title), new.metadata);
    RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_create_product
  AFTER INSERT ON public."product"
    FOR EACH ROW
EXECUTE FUNCTION features.trigger_create_product();
`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}

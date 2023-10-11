import {MigrationInterface, QueryRunner} from "typeorm"

export class CollectSimilarUser1696935836790 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
CREATE OR REPLACE FUNCTION public.sp_get_top_similar_user_products (customer_id character varying, distance_parameter float) 
RETURNS SETOF product 
LANGUAGE sql AS $function$
    WITH TopSimilarCustomer AS (
        SELECT fc."customerId", fc."uniqueName", fc.vector, fc.metadata, fc.vector <=> (
            SELECT fc.vector
            FROM features.customer_features fc
            WHERE fc."customerId" = customer_id
        ) as distance
        FROM features.customer_features fc
        WHERE fc."customerId" <> customer_id
    )
    SELECT p.*
    FROM TopSimilarCustomer tc
    JOIN customer c ON c.id = tc."customerId"
    JOIN "order" o ON o.customer_id = c.id
    JOIN line_item li ON o.id = li.order_id
    JOIN product_variant pv ON pv.id = li.variant_id
    JOIN product p ON p.id = pv.product_id
    WHERE p.deleted_at is null and tc.distance < distance_parameter order by tc.distance;
$function$
`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE public.sp_get_top_similar_user_products`);
    }

}

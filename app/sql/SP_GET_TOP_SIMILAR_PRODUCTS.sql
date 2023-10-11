CREATE OR REPLACE FUNCTION public.sp_get_top_similar_products (product_id character varying, distance_parameter float) RETURNS SETOF product LANGUAGE sql AS $function$
    WITH TopSimilarProduct AS (
        SELECT fp."productId", fp."uniqueName", fp.vector, fp.metadata, fp.vector <=> (
            SELECT fp.vector
            FROM features.product_features as fp
            WHERE fp."productId" = product_id
        ) as distance
        FROM features.product_features fp
        WHERE fp."productId" <> product_id
    )
    SELECT p.*
    FROM TopSimilarProduct tp
    JOIN product p on p.id = tp."productId"
    WHERE p.deleted_at is null and tp.distance < distance_parameter order by tp.distance;
$function$

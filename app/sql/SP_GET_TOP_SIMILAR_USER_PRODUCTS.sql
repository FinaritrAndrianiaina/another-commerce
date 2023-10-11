CREATE OR REPLACE FUNCTION public.sp_get_top_similar_products (product_id character varying, name_relevance_weight float)
RETURNS SETOF product
LANGUAGE sql AS $function$
     WITH ProductWithDistance AS (
      WITH ResultsCombination AS (
        WITH VectorsForProduct AS (
            SELECT fp.vector, fp.name_embeddings
            FROM features.product_features as fp
            WHERE fp."productId" = product_id
        )
        SELECT fp."productId" as product_id,
            fp.vector <=> (SELECT vfp.vector FROM VectorsForProduct vfp)  as characteristics_distance,
            fp.name_embeddings <=> (SELECT vfp.name_embeddings FROM VectorsForProduct vfp)  as name_distance
        FROM features.product_features fp
            WHERE fp."productId" <> product_id
      )
      SELECT product_id, characteristics_distance, name_distance, (name_distance * name_relevance_weight + characteristics_distance * (1-name_relevance_weight)) as combination_distance FROM ResultsCombination
    )
    SELECT p.*
    FROM ProductWithDistance tp
    JOIN product p on p.id = tp.product_id
    WHERE p.deleted_at is null order by tp.combination_distance;
$function$
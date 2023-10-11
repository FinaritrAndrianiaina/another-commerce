import usePreviews from "@lib/hooks/use-previews"
import getNumberOfSkeletons from "@lib/util/get-number-of-skeletons"
import repeat from "@lib/util/repeat"
import {StoreGetProductsParams} from "@medusajs/medusa"
import Button from "@modules/common/components/button"
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview"
import {useCart, useMedusa} from "medusa-react"
import React, {useEffect, useMemo} from "react"
import {useInfiniteQuery, useQuery} from "@tanstack/react-query"
import ProductPreview from "../product-preview"
import {PricedProduct} from "@medusajs/medusa/dist/types/pricing"
import {getProductsList} from "@lib/data"
import {ProductsList} from "@modules/home/components/list-products";
import {RecommendedResponse} from "@modules/home/components/recommended-products";

type RelatedProductsProps = {
    product: PricedProduct
}

function useContentRecommended(productId: string | undefined): RecommendedResponse {
    const {client} = useMedusa();
    const {data, ...rest} = useQuery(
        ['store', 'content', 'recommended', 'list', productId],
        () => client.client.request("GET", "/store/custom/recommended/product/" + productId).then(response => {
            return {
                recommended: response.recommended.map((v: any) => {
                    const cheapest = v.variant_pricing.filter((variant: any) => variant.currency === "eur")
                        .reduce((acc: any, curr: any) => {
                            if (acc.amount > curr.amount) {
                                return curr
                            }
                            return acc
                        }, v.variant_pricing[0]);
                    return {
                        ...v,
                        price: {
                            calculated_price: '$' + Math.floor(cheapest.amount / 100),
                            original_price: cheapest.amount,
                            difference: "N/A",
                            price_type: "default",
                        }
                    }
                })
            }
        })
    )
    return {...data, ...rest} as const
}


const RelatedProducts = ({product}: RelatedProductsProps) => {
    const {recommended} = useContentRecommended(product.id);
    useEffect(() => {
        console.log(recommended);
    }, [recommended])
    return (
        <>
            {
                recommended && recommended.length > 0 ?
                    (
                        <ProductsList title={"Similar products"} subtitle={"See similar products"}
                                      data={recommended}/>
                    )
                    : null
            }
        </>
    );
}

export default RelatedProducts

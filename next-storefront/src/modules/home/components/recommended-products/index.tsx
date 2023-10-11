"use client"
import {useQuery} from "@tanstack/react-query";
import {ProductsList} from "@modules/home/components/list-products";
import React from "react";
import {formatAmount, useMedusa, useRegion} from "medusa-react";

export interface RecommendedResponse {
    recommended?: any
}

function useCustomerRecommended(): RecommendedResponse {
    const {client} = useMedusa();
    const {data, ...rest} = useQuery(
        ['store', 'recommended', 'list'],
        () => client.client.request("GET", "/store/custom/recommended").then(response => {
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
                            calculated_price: '$'+Math.floor(cheapest.amount/100),
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

const RecommendedProducts = () => {
    const {recommended} = useCustomerRecommended();
    return (
        <>
            {
                recommended && recommended.length > 0 ?
                    (
                        <ProductsList title={"Recommended for you"} subtitle={"Liked by similar people like you."}
                                      data={recommended}/>
                    )
                    : null
            }
        </>
    );
}

export default RecommendedProducts;
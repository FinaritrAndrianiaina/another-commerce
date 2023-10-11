"use client"

import {useFeaturedProductsQuery} from "@lib/hooks/use-layout-data";
import React from "react";
import {ProductsList} from "modules/home/components/list-products";


const FeaturedProducts = () => {

    const {data} = useFeaturedProductsQuery();

    return (
        <ProductsList title={"Produits populaires"} subtitle={"Listes des produits"} data={data}/>
    )
}

export default FeaturedProducts



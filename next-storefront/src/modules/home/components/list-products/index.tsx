import {ProductPreviewType} from "../../../../types/global";
import React from "react";
import UnderlineLink from "@modules/common/components/underline-link";
import ProductPreview from "@modules/products/components/product-preview";
import SkeletonProductPreview from "@modules/skeletons/components/skeleton-product-preview";

export interface ProductsListProps {
    title: string,
    subtitle: string,
    data?: ProductPreviewType[]
}

export function ProductsList(props: React.PropsWithChildren<ProductsListProps>) {
    const {title, subtitle, data} = props;
    return (
        <div className="py-12">
            <div className="content-container py-12">
                <div className="flex flex-col items-center text-center mb-16">
                    <span className="text-base-regular text-gray-600 mb-6">
                        {title}
                    </span>
                    <p className="text-2xl-regular text-gray-900 max-w-lg mb-4">
                        {subtitle}
                    </p>
                    <UnderlineLink href="/store">Explore products</UnderlineLink>
                </div>
                <ul className="grid grid-cols-2 small:grid-cols-4 gap-x-4 gap-y-8">
                    {data
                        ? data.map((product) => (
                            <li key={product.id}>
                                <ProductPreview {...product} />
                            </li>
                        ))
                        : Array.from(Array(4).keys()).map((i) => (
                            <li key={i}>
                                <SkeletonProductPreview/>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
    );
}
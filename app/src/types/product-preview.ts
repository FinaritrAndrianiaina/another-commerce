export interface VariantsPreview {
    variant_name: string;
    amount: number;
    currency: string;
}

export type ProductPreviewType = {
    id: string
    title: string
    handle: string | null
    thumbnail: string | null,
    variant_pricing: VariantsPreview[]
}
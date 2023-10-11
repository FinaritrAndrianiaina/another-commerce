export interface SeedData {
    products: Product[];
    categories: SeedDataCategory[];
}

export interface SeedDataCategory {
    id: string;
    name: string;
    rank: number;
    category_children: any[];
    handle: string;
}

export interface Product {
    title: string;
    categories: ProductCategory[];
    subtitle: null;
    description: string;
    handle: string;
    is_giftcard: boolean;
    weight: number;
    images: string[];
    options: ProductOption[];
    variants: Variant[];
}

export interface ProductCategory {
    id: string;
}

export interface ProductOption {
    title: string;
    values: string[];
}

export interface Variant {
    title: string;
    prices: Price[];
    options: VariantOption[];
    inventory_quantity: number;
    manage_inventory: boolean;
}

export interface VariantOption {
    value: string;
}

export interface Price {
    currency_code: CurrencyCode;
    amount: number;
}

export enum CurrencyCode {
    Eur = "eur",
    Usd = "usd",
}

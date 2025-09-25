// types/product.types.ts
export interface Size {
    id: string;
    size: string;
    stock: number;
    priceModifier: number;
    sku: string;
    attributes: Record<string, any>;
}

export interface ProductVariant {
    id: string;
    color: string;
    images: (File | string)[];
    primaryIndex: number;
    sizes: Size[];
    price?: number;
    sku?: string;
    stock_quantity?: number;
    option?: string;
}

export interface ProductFormData {
    name: string;
    description: string;
    price: number;
    slug: string;
    compare_price?: number;
    cost_price?: number;
    category: string;
    brand: string;
    sku: string;
    GST: string;
    HSNCode: string;
    stock: {
        quantity: number;
        track_inventory: boolean;
        low_stock_threshold: number;
        allow_backorder: boolean;
    };
    specifications: Record<string, string>;
    tags: string[];
    seo: {
        title: string;
        description: string;
        keywords: string[];
    };
    shipping: {
        weight?: number;
        dimensions: {
            length?: number;
            width?: number;
            height?: number;
        };
    };
    variants: ProductVariant[];
    is_active: boolean;
    is_featured: boolean;
    visibility: "public" | "private" | "hidden";
    images: (File | string)[];
    primaryImageIndex?: number;
}

export interface CategoryFilter {
    name: string;
    type: "text" | "number" | "select" | "multiselect";
    options: string[];
    is_required: boolean;
}

export interface Specification {
    key: string;
    value: string;
}
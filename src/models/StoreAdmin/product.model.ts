import { iPagination } from "../pagination.model"
import { iStoreCategory } from "./category.model"

export interface iProductInfo {
    products: iProduct[]
    pagination: iPagination
}

export interface iProduct {
    reviews: []
    ratings: any
    _id: string
    name: string
    description: string
    price: number
    images: string[]
    compare_price?: number
    cost_price?: number
    category?: iStoreCategory
    store_category_id: string
    brand?: string
    sku?: string
    primaryImageIndex: number
    stock: {
        quantity: number
        track_inventory: boolean
        low_stock_threshold: number
        allow_backorder: boolean
        reserved?: number
    }
    attributes: Record<string, any>
    specifications: Record<string, any>
    discount_price: number
    tags: string[]
    seo: {
        title: string
        description: string
        keywords: string[]
    }
    shipping: {
        weight?: number
        dimensions?: {
            length: number
            width: number
            height: number
        }
    }
    variants: Array<iProductVariant>
    is_active: boolean
    is_featured: boolean
    visibility: "public" | "private" | "hidden"
    createdAt?: string
    updatedAt?: string
}



export interface iProductFilters {
    page?: number
    search?: string
    category?: string
    status?: string
    stock_level?: string
    price_min?: string
    price_max?: string
    date_from?: string
    date_to?: string
    sort?: string
    order?: string
    limit?: number
    parent_category?: string
}

export interface iProductStats {
    total_products: number
    active_products: number
    low_stock_products: number
    out_of_stock_products: number
    total_value: number
    avg_price: number
}

export interface iProductFormData {
    name: string
    description?: string
    slug: string
    price: number
    compare_price?: number
    cost_price?: number
    category?: string
    brand?: string
    sku?: string
    GST?: string
    HSNCode: string
    stock: {
        quantity: number
        track_inventory: boolean
        low_stock_threshold: number
        allow_backorder: boolean
    }
    attributes?: Record<string, any>
    specifications?: Record<string, any>
    tags?: string[]
    seo?: {
        title?: string
        description?: string
        keywords?: string[]
    }
    shipping?: {
        weight?: number
        dimensions?: {
            length?: number
            width?: number
            height?: number
        }
    }
    variants?: iProductVariant[]
    is_active: boolean
    is_featured: boolean
    visibility: "public" | "private" | "hidden"
    images?: string[]
}

interface iVariantSize {
    id: string;
    size: string;
    stock: number;
    priceModifier: number;
    sku: string;
    attributes: Record<string, any>;
}

export interface iProductVariant {
    id: string;
    color: string;
    images: (File | string)[];
    primaryIndex: number;
    sizes: iVariantSize[];
    option: any
    price: number
    stock_quantity: number
    sku: any
    attributes: any
}

export interface CategoryFilter {
    name: string
    type: "text" | "select" | "multiselect" | "number"
    options: string[]
    is_required: boolean
}

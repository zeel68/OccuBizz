import { iStore } from "@/models/store.model";

export interface iFilterOption {
    name: string;
    type: "text" | "number" | "range" | "select" | "multiselect" | "boolean";
    options: string[];
    is_required: boolean;
    default_value: any
}

export interface iAttributeOption {
    name: string;
    type: string;
    is_required: boolean;
    default_value?: string;
}

export interface iStoreCategoryConfig {
    filters: iFilterOption[];
    attributes: iFilterOption[];
}

export interface iCategory {
    _id: string;
    name: string;
    image_url?: string;
    tag_schema: string[];
    created_at: string;
    updated_at: string;
}


export interface iStoreCategory {
    _id: string;
    category_id: string;
    slug: string;
    store_id: string;
    is_primary: boolean;
    products: string[];
    img_url?: string;
    image_url?: string;
    display_name: string;
    description?: string;
    sort_order: number;
    is_active: boolean;
    config?: iStoreCategoryConfig;
    createdAt: string;
    updatedAt: string;
    category_details?: iCategory;
    store_details?: iStore;
    products_count?: number;
    subcategories: iStoreCategory[];
    parent_id: string;
}

export interface iCategoryFormData {
    name: string;
    display_name: string;
    slug: string;
    description: string;
    parent_id?: string;
    sort_order: number;
    is_active: boolean;
    is_primary: boolean;
    image_url?: string;
    filters: iFilterOption[];
    attributes: iFilterOption[];
}
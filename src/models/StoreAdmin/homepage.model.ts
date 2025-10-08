export interface iHeroSlide {
    _id: string
    store_id: string
    image_url: string
    description?: string
    button_text?: string
    title: string
    subtitle?: string
    link?: string
    display_order: number
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface iTrendingCategory {
    _id: string
    store_id: string
    category_id: string
    display_order: number
    created_at: string
    category_details?: {
        _id: string
        display_name: string
        description?: string
        img_url?: string
    }
}

export interface iTrendingProduct {
    _id: string
    store_id: string
    product_id: string
    display_order: number
    created_at: string
    product_details?: {
        _id: string
        name: string
        description?: string
        price: number
        images: string[]
        stock: {
            quantity: number
        }
        ratings: {
            average: number
            count: number
        }
    }
}

export interface iTestimonial {
    _id: string
    store_id: string
    name: string
    message: string
    photo_url?: string
    created_at: string
    updated_at: string
}

export interface iHomepageConfig {
    heroSlides: iHeroSlide[]
    trendingCategories: iTrendingCategory[]
    trendingProducts: iTrendingProduct[]
    testimonials: iTestimonial[]
}

export interface iHeroSlideForm {
    title: string
    subtitle?: string
    description?: string
    button_text?: string
    link?: string
    display_order: number
    image?: string
}

export interface iTestimonialForm {
    name: string
    message: string
    photo?: File
}

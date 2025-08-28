import { iPagination } from "../pagination.model";

export interface iReviewsInfo {
    reviews: iReview[];
    pagination: iPagination;
}

export interface iReview {
    _id: string;
    user: string;
    date: string;
    product_name?: string;
    customer_name?: string;
    customer_avatar?: string;
    reply?: string;
    user_id: {
        name: string
        email: string
        profile_image?: string
    }
    product_id: {
        name: string
        images?: string[]
    }
    rating: number
    comment: string
    status: "pending" | "approved" | "rejected"
    helpful_count: number
    verified_purchase?: boolean
    created_at: string
}

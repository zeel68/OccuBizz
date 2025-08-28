import { iPagination } from "../pagination.model";

export interface iReviewsInfo {
    reviews: iReview[];
    pagination: iPagination;
}

export interface iReview {
    _id: string;
    user: string;
    rating: number;
    comment: string;
    date: string;
    status?: string;
    product_name?: string;
    customer_name?: string;
    customer_avatar?: string;
    reply?: string;
}

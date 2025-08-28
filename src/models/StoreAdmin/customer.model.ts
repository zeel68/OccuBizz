import { iPagination } from "../pagination.model"

export interface iCustomersInfo {
    customers: iCustomer[]
    pagination: iPagination
}

export interface iCustomer {
    _id: string
    name: string
    email: string
    phone?: string
    phone_number?: string

    total_orders?: number
    total_spent?: number
    last_order_date?: string
    profile_image?: string
    status: "active" | "inactive"
    created_at: string
    updated_at: string
    address?: {
        city?: string
        country?: string
    }
}


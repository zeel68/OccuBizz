import { iPagination } from "../pagination.model";

export interface iOrdersInfo {
  orders: iOrder[];
  pagination: iPagination;
}
export interface iOrder {
  _id: string;
  id: string;
  order_number: string;
  user_id: {
    _id: string;
    name: string;
    email: string;
    phone_number?: string;
  } | null;
  customer_info?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  total: number;
  total_amount?: number;
  subtotal?: number;
  tax?: number;
  tax_amount: number;
  shipping?: number;
  shipping_method?: string;
  shipping_cost: number;
  discount?: number;
  status: string;
  payment_status: string;
  payment_method?: string;
  items: Array<{
    product_id: string | { _id: string; name: string;[key: string]: any };
    product_name?: string;
    name?: string;
    variant_id?: string | { _id: string; color?: string; size?: string;[key: string]: any };
    quantity: number;
    price: number;
    total?: number;
  }>;
  shipping_address?: any;
  billing_address?: any;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

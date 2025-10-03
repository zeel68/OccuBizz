import { iTags } from "./TagModel";

export interface iFilters {
  name: string;
  type: string;
  options: string[];
  is_required: boolean;
}
export interface iAttributes {
  name: string;
  type: string;
  value: string;
  default_value: string;
  is_required: boolean;
}
export interface iConfig {
  filters: iFilters[];
  attributes: iAttributes[];
}
export interface iGlobalCategory {
  _id: string;
  name: string;
  slug: string;
  img_url: string;
  config: iConfig;
  tags: iTags[]
  status: boolean;
  createdAt: string;
  updatedAt: string;
}
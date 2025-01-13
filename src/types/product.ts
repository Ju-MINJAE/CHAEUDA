export interface User {
  id: number;
  username: string;
  phone_number: string;
}

export interface Product {
  product_id: number;
  user: User;
  images: string[];
  video: string | null;
  pro_title: string;
  pro_price: number;
  management_cost: number;
  pro_supply_a: number;
  pro_site_a: number;
  pro_heat: string;
  pro_type: string;
  pro_floor: number;
  description: string;
  sale: boolean;
  pro_rooms: number;
  pro_bathrooms: number;
  pro_construction_year: number;
  add_new: string;
  add_old: string;
  username: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
}

export const Pro_type: Record<string, string> = {
  detached: '단독주택',
  multi: '다세대주택',
  type_etc: '기타',
};

export const Pro_heat: Record<string, string> = {
  gas: '가스보일러',
  oil: '기름보일러',
  briquette: '연탄보일러',
  heat_etc: '기타',
};

export type MyProduct = {
  product_id: string;
  images: string;
  pro_title: string;
  pro_price: number;
  pro_type: string;
  pro_supply_a: number;
  add_new: string;
  created_at: string;
  is_liked: boolean;
};

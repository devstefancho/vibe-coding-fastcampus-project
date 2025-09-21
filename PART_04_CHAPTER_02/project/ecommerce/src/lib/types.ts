export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  address?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  hd_image_url: string;
  created_at: string;
}

export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  name: string;
  price: number;
  image_url: string;
}

export interface Order {
  id: number;
  user_id: number;
  order_id: string;
  total_amount: number;
  status: string;
  payment_key?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  created_at: string;
  items?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, phone: string, address: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}
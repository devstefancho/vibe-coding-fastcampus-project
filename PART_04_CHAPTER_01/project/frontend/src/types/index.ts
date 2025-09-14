export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
}
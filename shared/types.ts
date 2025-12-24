export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export type Category = 'Sneakers' | 'Running' | 'Classic' | 'Outdoor';
export type Gender = 'Men' | 'Women' | 'Unisex';
export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
export interface ShoeProduct {
  id: string;
  name: string;
  price: number;
  category: Category;
  gender: Gender;
  description: string;
  images: string[];
  sizes: number[];
  colors: string[];
  featured?: boolean;
}
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedSize: number;
  image: string;
}
export interface Order {
  id: string;
  customerName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: number;
}
// Minimal real-world chat example types (retained from template for compatibility if needed)
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}
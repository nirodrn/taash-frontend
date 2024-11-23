export interface User {
  id: string;
  email: string;
  fullName: string;
  whatsappNo?: string;
  deliveryAddress?: string;
  isAdmin?: boolean;
  token?: string; //token
}


export interface Category {
  id: string;
  name: string;
}

// In /src/types.ts (or wherever you define your types)

export interface LoginResponse {
  message: string;
  token: string;
}


export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  shippingAddress: string;
  createdAt: string;
}
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  token?: string;
  avatar?: {
    url: string;
    alt: string;
  };
  phone?: string;
  addresses?: Address[];
}

export interface Address {
  _id?: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  brand?: string;
  images: Array<{
    url: string;
    alt: string;
  }>;
  inventory: number;
  sku?: string;
  tags?: string[];
  featured?: boolean;
  rating: {
    average: number;
    count: number;
  };
  specifications?: Record<string, string>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  inventory: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string | User;
  items: Array<{
    product: string | Product;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  shippingAddress: Address;
  paymentMethod: string;
  paymentResult?: {
    stripePaymentIntentId: string;
    status: string;
    updateTime: Date;
    emailAddress: string;
  };
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  breakdown: {
    subtotal: number;
    tax: number;
    shippingCost: number;
    total: number;
  };
}

export interface OrderStats {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
  };
  statusBreakdown: Array<{
    _id: string;
    count: number;
  }>;
  revenueByDay: Array<{
    _id: string;
    revenue: number;
    orders: number;
  }>;
}

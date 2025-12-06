import api from './api';
import { Order, OrderStats } from '../../../shared/types.js';

interface OrdersResponse {
  orders: Order[];
  page: number;
  pages: number;
  total: number;
}

export const orderService = {
  getUserOrders: async (): Promise<Order[]> => {
    const response = await api.get('/orders');
    return response.data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Admin only
  getAllOrders: async (status?: string, page = 1, limit = 20): Promise<OrdersResponse> => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    const response = await api.get(`/orders/admin/all?${params.toString()}`);
    return response.data;
  },

  updateOrderStatus: async (id: string, status: string): Promise<Order> => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },

  getOrderStats: async (startDate?: string, endDate?: string): Promise<OrderStats> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await api.get(`/orders/admin/stats?${params.toString()}`);
    return response.data;
  },
};

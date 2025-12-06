import api from './api';
import { User } from '../../../shared/types.js';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  token: string;
}

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<AuthResponse> => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  addAddress: async (address: any): Promise<any> => {
    const response = await api.post('/auth/addresses', address);
    return response.data;
  },
};

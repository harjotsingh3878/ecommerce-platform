import api from './api';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { PaymentIntentResponse } from '../../../shared/types.js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = api.get('/payments/config')
      .then(res => loadStripe(res.data.publishableKey));
  }
  return stripePromise;
};

interface CreatePaymentIntentData {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: any;
}

export const paymentService = {
  createPaymentIntent: async (data: CreatePaymentIntentData): Promise<PaymentIntentResponse> => {
    const response = await api.post('/payments/create-payment-intent', data);
    return response.data;
  },

  confirmPayment: async (paymentIntentId: string, items: any[], shippingAddress: any): Promise<any> => {
    const response = await api.post('/payments/confirm', {
      paymentIntentId,
      items,
      shippingAddress,
    });
    return response.data;
  },
};

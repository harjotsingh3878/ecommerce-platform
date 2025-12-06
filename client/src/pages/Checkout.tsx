import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { useMutation } from '@tanstack/react-query';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { paymentService } from '../services/paymentService';
import { orderService } from '../services/orderService';
import CheckoutForm from '../components/CheckoutForm';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [clientSecret, setClientSecret] = useState('');
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [step, setStep] = useState<'address' | 'payment'>('address');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    phone: '',
  });

  const subtotal = getSubtotal();
  const tax = subtotal * 0.1;
  const shipping = subtotal > 50 ? 0 : 10;
  const total = subtotal + tax + shipping;

  const createPaymentIntentMutation = useMutation({
    mutationFn: () => paymentService.createPaymentIntent({
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      shippingAddress,
    }),
    onSuccess: async (data) => {
      setClientSecret(data.clientSecret);
      const stripe = await paymentService.getStripe();
      setStripePromise(Promise.resolve(stripe));
      setStep('payment');
    },
    onError: (error: any) => {
      alert(error?.message || 'Failed to initialize payment');
    },
  });

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPaymentIntentMutation.mutate();
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      const order = await orderService.createOrder({
        items: items.map(item => ({
          product: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingAddress,
        paymentMethod: 'card',
        paymentResult: {
          stripePaymentIntentId: paymentIntentId,
          status: 'succeeded',
          updateTime: new Date(),
          emailAddress: user?.email || '',
        },
        subtotal,
        tax,
        shippingCost: shipping,
        total,
      });

      clearCart();
      navigate(`/orders/${order._id}`);
    } catch (error: any) {
      alert(error?.message || 'Failed to create order');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px' }}>Your cart is empty</h2>
        <p style={{ color: 'var(--gray-600)', marginBottom: '32px' }}>
          Add items to your cart before checking out
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/products')}>
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 style={{ marginBottom: '32px' }}>Checkout</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px', alignItems: 'start' }} className="cart-layout">
        {/* Checkout Form */}
        <div style={{ background: 'white', padding: '32px', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
          {step === 'address' ? (
            <>
              <h2 style={{ marginBottom: '24px', fontSize: '20px' }}>Shipping Address</h2>
              <form onSubmit={handleAddressSubmit}>
                <div className="form-group">
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    className="input"
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="label">Address Line 1</label>
                  <input
                    type="text"
                    className="input"
                    value={shippingAddress.addressLine1}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="label">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    className="input"
                    value={shippingAddress.addressLine2}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="label">City</label>
                    <input
                      type="text"
                      className="input"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">State</label>
                    <input
                      type="text"
                      className="input"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="label">Postal Code</label>
                    <input
                      type="text"
                      className="input"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="label">Phone</label>
                    <input
                      type="tel"
                      className="input"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}
                  disabled={createPaymentIntentMutation.isPending}
                >
                  {createPaymentIntentMutation.isPending ? 'Processing...' : 'Continue to Payment'}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 style={{ marginBottom: '24px', fontSize: '20px' }}>Payment Details</h2>
              {clientSecret && stripePromise && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm 
                    clientSecret={clientSecret}
                    onSuccess={handlePaymentSuccess}
                  />
                </Elements>
              )}
            </>
          )}
        </div>

        {/* Order Summary */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: 'var(--shadow)', position: 'sticky', top: '100px' }}>
          <h2 style={{ marginBottom: '24px', fontSize: '20px' }}>Order Summary</h2>

          <div style={{ marginBottom: '24px' }}>
            {items.map((item) => (
              <div key={item.productId} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <img
                  src={item.image || 'https://via.placeholder.com/60'}
                  alt={item.name}
                  style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '500', fontSize: '14px', marginBottom: '4px' }}>{item.name}</p>
                  <p style={{ fontSize: '14px', color: 'var(--gray-600)' }}>
                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                  </p>
                </div>
                <p style={{ fontWeight: '600' }}>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--gray-600)' }}>Subtotal</span>
              <span style={{ fontWeight: '500' }}>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--gray-600)' }}>Tax</span>
              <span style={{ fontWeight: '500' }}>${tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--gray-600)' }}>Shipping</span>
              <span style={{ fontWeight: '500', color: shipping === 0 ? 'var(--secondary)' : 'inherit' }}>
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '18px', fontWeight: '600' }}>Total</span>
              <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;


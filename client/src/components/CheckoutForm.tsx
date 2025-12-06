import { useState, FormEvent } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface CheckoutFormProps {
  clientSecret: string;
  onSuccess: (paymentIntentId: string) => void;
}

const CheckoutForm = ({ onSuccess }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Payment form is still loading. Please wait.');
      return;
    }

    setProcessing(true);
    setError(null);

    // Validate that payment details are complete
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'Please complete all payment fields');
      setProcessing(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/orders`,
      },
      redirect: 'if_required',
    });

    if (confirmError) {
      setError(confirmError.message || 'An error occurred during payment');
      setProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess(paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement 
        onReady={() => setIsReady(true)}
        options={{
          layout: 'tabs'
        }}
      />
      
      {!isReady && (
        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--gray-600)' }}>
          Loading payment form...
        </div>
      )}
      
      {error && (
        <div className="error" style={{ marginTop: '16px' }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        style={{ width: '100%', justifyContent: 'center', marginTop: '24px', padding: '14px' }}
        disabled={!stripe || processing || !isReady}
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>

      <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--gray-500)', marginTop: '16px' }}>
        Your payment information is secure and encrypted
      </p>

      <div style={{ marginTop: '16px', padding: '12px', background: 'var(--gray-50)', borderRadius: '6px', fontSize: '13px', color: 'var(--gray-600)' }}>
        <strong>Test Card:</strong> 4242 4242 4242 4242<br/>
        <strong>Expiry:</strong> Any future date (e.g., 12/28)<br/>
        <strong>CVC:</strong> Any 3 digits (e.g., 123)
      </div>
    </form>
  );
};

export default CheckoutForm;

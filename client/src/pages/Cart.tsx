import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { FiTrash2, FiShoppingBag } from 'react-icons/fi';

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 50 ? 0 : 10; // Free shipping over $50
  const total = subtotal + tax + shipping;

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <FiShoppingBag size={64} style={{ color: 'var(--gray-300)', margin: '0 auto 24px' }} />
        <h2 style={{ marginBottom: '16px' }}>Your cart is empty</h2>
        <p style={{ color: 'var(--gray-600)', marginBottom: '32px' }}>
          Start shopping to add items to your cart
        </p>
        <Link to="/products" className="btn btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 style={{ marginBottom: '32px' }}>Shopping Cart</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px', alignItems: 'start' }} className="cart-layout">
        {/* Cart Items */}
        <div>
          {items.map((item) => (
            <div
              key={item.productId}
              style={{
                display: 'flex',
                gap: '16px',
                padding: '24px',
                background: 'white',
                borderRadius: '8px',
                marginBottom: '16px',
                boxShadow: 'var(--shadow)',
              }}
            >
              <img
                src={item.image || 'https://via.placeholder.com/120'}
                alt={item.name}
                style={{
                  width: '120px',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />

              <div style={{ flex: 1 }}>
                <Link
                  to={`/products/${item.productId}`}
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  <h3 style={{ marginBottom: '8px', fontSize: '18px' }}>{item.name}</h3>
                </Link>

                <p style={{ color: 'var(--primary)', fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
                  ${item.price.toFixed(2)}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 12px' }}
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: '500' }}>
                      {item.quantity}
                    </span>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '4px 12px' }}
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.inventory}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="btn btn-danger"
                    style={{ padding: '8px 16px', marginLeft: 'auto' }}
                    onClick={() => removeItem(item.productId)}
                  >
                    <FiTrash2 /> Remove
                  </button>
                </div>

                {item.quantity >= item.inventory && (
                  <p style={{ color: 'var(--warning)', fontSize: '14px', marginTop: '8px' }}>
                    Max quantity reached
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div
          style={{
            background: 'white',
            padding: '24px',
            borderRadius: '8px',
            boxShadow: 'var(--shadow)',
            position: 'sticky',
            top: '100px',
          }}
        >
          <h2 style={{ marginBottom: '24px', fontSize: '20px' }}>Order Summary</h2>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--gray-600)' }}>Subtotal</span>
              <span style={{ fontWeight: '500' }}>${subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--gray-600)' }}>Tax (10%)</span>
              <span style={{ fontWeight: '500' }}>${tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--gray-600)' }}>Shipping</span>
              <span style={{ fontWeight: '500', color: shipping === 0 ? 'var(--secondary)' : 'inherit' }}>
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            {subtotal < 50 && subtotal > 0 && (
              <p style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '8px' }}>
                Add ${(50 - subtotal).toFixed(2)} more for free shipping!
              </p>
            )}
          </div>

          <div
            style={{
              borderTop: '1px solid var(--border)',
              paddingTop: '16px',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '18px', fontWeight: '600' }}>Total</span>
              <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>

          <Link to="/products">
            <button
              className="btn btn-secondary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '12px' }}
            >
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;


import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/orderService';
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiMapPin } from 'react-icons/fi';

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id!),
    enabled: !!id,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FiPackage size={24} style={{ color: 'var(--warning)' }} />;
      case 'processing':
        return <FiPackage size={24} style={{ color: 'var(--primary)' }} />;
      case 'shipped':
        return <FiTruck size={24} style={{ color: 'var(--primary)' }} />;
      case 'delivered':
        return <FiCheckCircle size={24} style={{ color: 'var(--secondary)' }} />;
      case 'cancelled':
        return <FiXCircle size={24} style={{ color: 'var(--danger)' }} />;
      default:
        return <FiPackage size={24} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'var(--warning)';
      case 'processing':
        return 'var(--primary)';
      case 'shipped':
        return 'var(--primary)';
      case 'delivered':
        return 'var(--secondary)';
      case 'cancelled':
        return 'var(--danger)';
      default:
        return 'var(--gray-600)';
    }
  };

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p className="error">Failed to load order details. Please try again later.</p>
        <Link to="/orders" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <Link to="/orders" style={{ color: 'var(--primary)', fontSize: '14px', marginBottom: '16px', display: 'inline-block' }}>
          ← Back to Orders
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ marginBottom: '8px' }}>Order #{order.orderNumber}</h1>
            <p style={{ color: 'var(--gray-600)' }}>
              Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', background: 'var(--gray-50)', borderRadius: '8px' }}>
            {getStatusIcon(order.status)}
            <div>
              <p style={{ fontSize: '12px', color: 'var(--gray-600)', marginBottom: '2px' }}>Status</p>
              <p style={{ fontSize: '16px', fontWeight: '600', color: getStatusColor(order.status), textTransform: 'capitalize' }}>
                {order.status}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px', alignItems: 'start' }} className="cart-layout">
        {/* Order Items & Shipping */}
        <div>
          {/* Order Items */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: 'var(--shadow)', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Order Items</h2>
            {order.items.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  gap: '16px',
                  paddingBottom: '16px',
                  marginBottom: '16px',
                  borderBottom: index < order.items.length - 1 ? '1px solid var(--border)' : 'none',
                }}
              >
                <img
                  src={item.image || 'https://via.placeholder.com/80'}
                  alt={item.name}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>{item.name}</h3>
                  <p style={{ color: 'var(--gray-600)', fontSize: '14px' }}>
                    Quantity: {item.quantity}
                  </p>
                  <p style={{ color: 'var(--primary)', fontSize: '16px', fontWeight: '600', marginTop: '8px' }}>
                    ${item.price.toFixed(2)} × {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <FiMapPin size={20} />
              <h2 style={{ fontSize: '20px' }}>Shipping Address</h2>
            </div>
            <div style={{ color: 'var(--gray-700)', lineHeight: '1.6' }}>
              <p style={{ fontWeight: '600' }}>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              {order.shippingAddress.phone && <p style={{ marginTop: '8px' }}>Phone: {order.shippingAddress.phone}</p>}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: 'var(--shadow)', position: 'sticky', top: '100px' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Order Summary</h2>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--gray-600)' }}>Subtotal</span>
              <span style={{ fontWeight: '500' }}>${order.subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--gray-600)' }}>Tax</span>
              <span style={{ fontWeight: '500' }}>${order.tax.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--gray-600)' }}>Shipping</span>
              <span style={{ fontWeight: '500' }}>
                {order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost.toFixed(2)}`}
              </span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '18px', fontWeight: '600' }}>Total</span>
              <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment Status */}
          <div style={{ padding: '16px', background: order.isPaid ? '#d1fae5' : '#fee2e2', borderRadius: '8px', marginBottom: '16px' }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: order.isPaid ? '#065f46' : '#991b1b' }}>
              {order.isPaid ? '✓ Payment Successful' : '⚠ Payment Pending'}
            </p>
            {order.isPaid && order.paidAt && (
              <p style={{ fontSize: '12px', color: '#065f46', marginTop: '4px' }}>
                Paid on {new Date(order.paidAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            )}
          </div>

          {/* Delivery Status */}
          {order.isDelivered && order.deliveredAt && (
            <div style={{ padding: '16px', background: '#d1fae5', borderRadius: '8px' }}>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#065f46' }}>
                ✓ Delivered
              </p>
              <p style={{ fontSize: '12px', color: '#065f46', marginTop: '4px' }}>
                Delivered on {new Date(order.deliveredAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}

          <Link to="/products">
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;


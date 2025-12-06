import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/orderService';
import { FiPackage, FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const Orders = () => {
  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getUserOrders,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FiPackage size={20} style={{ color: 'var(--warning)' }} />;
      case 'processing':
        return <FiPackage size={20} style={{ color: 'var(--primary)' }} />;
      case 'shipped':
        return <FiTruck size={20} style={{ color: 'var(--primary)' }} />;
      case 'delivered':
        return <FiCheckCircle size={20} style={{ color: 'var(--secondary)' }} />;
      case 'cancelled':
        return <FiXCircle size={20} style={{ color: 'var(--danger)' }} />;
      default:
        return <FiPackage size={20} />;
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
        <p>Loading orders...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p className="error">Failed to load orders. Please try again later.</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <FiPackage size={64} style={{ color: 'var(--gray-300)', margin: '0 auto 24px' }} />
        <h2 style={{ marginBottom: '16px' }}>No orders yet</h2>
        <p style={{ color: 'var(--gray-600)', marginBottom: '32px' }}>
          You haven't placed any orders yet
        </p>
        <Link to="/products" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 style={{ marginBottom: '32px' }}>My Orders</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {orders.map((order) => (
          <Link
            key={order._id}
            to={`/orders/${order._id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
              style={{
                background: 'white',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: 'var(--shadow)',
                transition: 'box-shadow 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'var(--shadow)';
              }}
            >
              {/* Order Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>
                    Order #{order.orderNumber}
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--gray-600)' }}>
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {getStatusIcon(order.status)}
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: getStatusColor(order.status),
                      textTransform: 'capitalize',
                    }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items Preview */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {order.items.slice(0, 3).map((item, index) => (
                  <img
                    key={index}
                    src={item.image || 'https://via.placeholder.com/60'}
                    alt={item.name}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      border: '1px solid var(--border)',
                    }}
                  />
                ))}
                {order.items.length > 3 && (
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--gray-100)',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'var(--gray-600)',
                    }}
                  >
                    +{order.items.length - 3}
                  </div>
                )}
              </div>

              {/* Order Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <div>
                  <p style={{ fontSize: '14px', color: 'var(--gray-600)', marginBottom: '4px' }}>
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                  {order.isPaid && (
                    <p style={{ fontSize: '12px', color: 'var(--secondary)' }}>
                      ✓ Paid
                    </p>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '14px', color: 'var(--gray-600)', marginBottom: '4px' }}>
                    Total
                  </p>
                  <p style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary)' }}>
                    ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Orders;


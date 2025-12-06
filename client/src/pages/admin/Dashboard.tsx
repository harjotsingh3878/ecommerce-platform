import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { FiDollarSign, FiShoppingBag, FiUsers, FiPackage } from 'react-icons/fi';
import api from '../../services/api';

const AdminDashboard = () => {
  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: async () => {
      const { data } = await api.get('/orders/admin/stats');
      return data;
    },
  });

  // Fetch recent orders
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: async () => {
      const { data } = await api.get('/orders/admin/all?limit=5');
      return data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#fbbf24';
      case 'processing': return '#3b82f6';
      case 'shipped': return '#3b82f6';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (statsLoading) {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 style={{ marginBottom: '32px' }}>Admin Dashboard</h1>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '24px',
        marginBottom: '48px'
      }}>
        {/* Total Revenue */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '24px',
          borderRadius: '12px',
          color: 'white',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <FiDollarSign size={32} />
            <span style={{ fontSize: '14px', opacity: 0.9 }}>Total Revenue</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
            ${stats?.totalRevenue?.toFixed(2) || '0.00'}
          </div>
        </div>

        {/* Total Orders */}
        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          padding: '24px',
          borderRadius: '12px',
          color: 'white',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <FiShoppingBag size={32} />
            <span style={{ fontSize: '14px', opacity: 0.9 }}>Total Orders</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
            {stats?.totalOrders || 0}
          </div>
        </div>

        {/* Total Products */}
        <div style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          padding: '24px',
          borderRadius: '12px',
          color: 'white',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <FiPackage size={32} />
            <span style={{ fontSize: '14px', opacity: 0.9 }}>Total Products</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
            {stats?.totalProducts || 0}
          </div>
        </div>

        {/* Total Customers */}
        <div style={{
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
          padding: '24px',
          borderRadius: '12px',
          color: 'white',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <FiUsers size={32} />
            <span style={{ fontSize: '14px', opacity: 0.9 }}>Total Customers</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold' }}>
            {stats?.totalCustomers || 0}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>Recent Orders</h2>
          <Link to="/admin/orders" className="btn btn-outline">View All</Link>
        </div>

        {ordersLoading ? (
          <p>Loading orders...</p>
        ) : ordersData?.orders?.length > 0 ? (
          <div style={{ background: 'white', borderRadius: '8px', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: 'var(--gray-50)' }}>
                <tr>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Order #</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Customer</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Date</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Total</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {ordersData.orders.map((order: any) => (
                  <tr key={order._id} style={{ borderTop: '1px solid var(--gray-200)' }}>
                    <td style={{ padding: '16px' }}>
                      <strong>{order.orderNumber}</strong>
                    </td>
                    <td style={{ padding: '16px' }}>
                      {order.user?.name || 'N/A'}
                      <div style={{ fontSize: '12px', color: 'var(--gray-600)' }}>
                        {order.user?.email}
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <strong>${order.total.toFixed(2)}</strong>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: getStatusColor(order.status) + '20',
                        color: getStatusColor(order.status)
                      }}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <Link to={`/orders/${order._id}`} style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '14px' }}>
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ background: 'white', padding: '48px', borderRadius: '8px', textAlign: 'center', color: 'var(--gray-600)' }}>
            No orders yet
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 style={{ marginBottom: '24px' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <Link to="/admin/products" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            Manage Products
          </Link>
          <Link to="/admin/orders" className="btn btn-outline" style={{ textDecoration: 'none' }}>
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

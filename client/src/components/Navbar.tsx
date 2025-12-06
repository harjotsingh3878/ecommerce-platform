import { Link } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut, FiGrid } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <h2>ShopHub</h2>
        </Link>

        <div className="navbar-links">
          <Link to="/products">Products</Link>
          {isAuthenticated && <Link to="/orders">Orders</Link>}
          {user?.role === 'admin' && (
            <Link to="/admin" className="admin-link">
              <FiGrid /> Admin
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          <Link to="/cart" className="cart-link">
            <FiShoppingCart size={20} />
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>

          {isAuthenticated ? (
            <div className="user-menu">
              <FiUser size={20} />
              <span>{user?.name}</span>
              <button onClick={logout} className="btn btn-secondary">
                <FiLogOut /> Logout
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';
import { useCartStore } from '../store/cartStore';

const Products = () => {
  const [filters, setFilters] = useState({ category: '', search: '', sort: '' });
  const addItem = useCartStore((state) => state.addItem);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: productService.getCategories,
  });

  const handleAddToCart = (product: any) => {
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0]?.url || '',
      inventory: product.inventory,
    });
  };

  if (isLoading) {
    return (
      <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p>Loading products...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <p>Error loading products. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1 style={{ marginBottom: '32px' }}>Products</h1>

      {/* Filters */}
      <div style={{ marginBottom: '32px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search products..."
          className="input"
          style={{ flex: '1', minWidth: '200px' }}
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        
        <select
          className="input"
          style={{ minWidth: '150px' }}
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          {categories?.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          className="input"
          style={{ minWidth: '150px' }}
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
        >
          <option value="">Sort by</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name</option>
        </select>
      </div>

      {/* Products Grid */}
      {data?.products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-3" style={{ gap: '24px' }}>
          {data?.products.map((product) => (
            <div key={product._id} className="product-card" style={{
              background: 'white',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: 'var(--shadow)',
              transition: 'transform 0.2s',
            }}>
              <Link to={`/products/${product._id}`}>
                <img
                  src={product.images[0]?.url || 'https://via.placeholder.com/400'}
                  alt={product.images[0]?.alt || product.name}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
              </Link>
              
              <div style={{ padding: '16px' }}>
                <Link to={`/products/${product._id}`} style={{ color: 'inherit' }}>
                  <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{product.name}</h3>
                </Link>
                
                <p style={{ 
                  color: 'var(--gray-600)', 
                  fontSize: '14px', 
                  marginBottom: '12px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {product.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '20px', fontWeight: '600', color: 'var(--primary)' }}>
                    ${product.price.toFixed(2)}
                  </span>
                  {product.compareAtPrice && (
                    <span style={{ fontSize: '16px', textDecoration: 'line-through', color: 'var(--gray-400)' }}>
                      ${product.compareAtPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ color: '#f59e0b' }}>★</span>
                  <span style={{ fontSize: '14px', color: 'var(--gray-600)' }}>
                    {product.rating.average.toFixed(1)} ({product.rating.count})
                  </span>
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => handleAddToCart(product)}
                  disabled={product.inventory === 0}
                >
                  {product.inventory === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;


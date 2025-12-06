# E-Commerce Platform with Stripe Integration

A full-stack e-commerce application with React, TypeScript, Node.js, Stripe payments, and admin dashboard with analytics.

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **React Router v6** for navigation
- **React Query** for server state management
- **Zustand** for client state (shopping cart)
- **Stripe Elements** for payment processing
- **Recharts** for analytics visualization
- **React Icons** for UI icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **Stripe API** for payment processing
- **JWT** for authentication
- **bcryptjs** for password hashing

## 📁 Project Structure

```
ecommerce-platform/
├── client/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand stores (auth, cart)
│   │   ├── services/      # API service functions
│   │   ├── App.tsx        # Main app with routing
│   │   └── main.tsx       # Entry point with providers
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server/                 # Node.js Express backend
│   ├── src/
│   │   ├── models/        # Mongoose models (User, Product, Order)
│   │   ├── controllers/   # Route controllers
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth middleware
│   │   └── server.js      # Express server setup
│   ├── package.json
│   └── .env.example
└── shared/                 # Shared TypeScript types
    └── types.ts
```

## 🎯 Features

### Customer Features
- ✅ Browse products with filters (category, price, search)
- ✅ Product detail pages with image galleries
- ✅ Shopping cart with Zustand state management
- ✅ Stripe checkout with payment intent
- ✅ Order history with detailed views
- ✅ User authentication (register/login)
- ✅ Address management
- ✅ Responsive design

### Admin Features
- ✅ Product CRUD operations
- ✅ Order management with status updates
- ✅ Sales dashboard with Recharts analytics:
  - Revenue trends over time
  - Order status breakdown
  - Top-selling products
  - Average order value
- ✅ Protected admin routes

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Stripe account for API keys

### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

Create `server/.env` file:

```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_change_in_production
JWT_EXPIRE=30d

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Frontend URL
CLIENT_URL=http://localhost:3000
```

### 3. Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Add keys to `.env` file
4. (Optional) Set up webhook for payment events

### 4. Start MongoDB

```bash
# If using local MongoDB
mongod
```

### 5. Run the Application

```bash
# Terminal 1: Start backend server
cd server
npm run dev

# Terminal 2: Start frontend dev server
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/addresses` - Add shipping address

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories/list` - Get categories
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/admin/all` - Get all orders (Admin)
- `GET /api/orders/admin/stats` - Get order statistics (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Payments
- `GET /api/payments/config` - Get Stripe public key
- `POST /api/payments/create-payment-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment and create order
- `POST /api/payments/webhook` - Stripe webhook handler

## 🔐 Authentication Flow

1. User registers/logs in
2. JWT token is generated and stored
3. Token is included in Authorization header for protected routes
4. Zustand persists auth state to localStorage

## 💳 Payment Flow

1. User adds items to cart (Zustand store)
2. Proceeds to checkout
3. Creates Stripe PaymentIntent on backend
4. Stripe Elements form collects payment details
5. Payment confirmed and order created
6. Inventory updated automatically

## 📊 Admin Dashboard

Access admin features at `/admin` (requires admin role):

- **Dashboard Overview**: Revenue stats, order counts, charts
- **Product Management**: CRUD operations for products
- **Order Management**: View and update order statuses
- **Analytics**: Recharts visualizations for sales data

## 🎨 State Management

### Zustand Stores

**Auth Store** (`authStore.ts`):
- User authentication state
- Login/logout actions
- Persisted to localStorage

**Cart Store** (`cartStore.ts`):
- Shopping cart items
- Add/remove/update quantity
- Calculate totals
- Persisted to localStorage

### React Query

Used for server state management:
- Product queries with caching
- Order data fetching
- Automatic refetch on window focus
- Optimistic updates

## 🚢 Deployment

### Frontend (Netlify/Vercel)

```bash
cd client
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway/Render)

1. Set environment variables
2. Deploy from Git repository
3. Configure MongoDB Atlas connection
4. Set up Stripe webhook endpoint

## 🔧 Development Tips

### Seed Database

Create sample products:

```bash
cd server
node src/scripts/seed.js
```

### Test Stripe Integration

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

### Admin Account

Create admin user manually in MongoDB:

```javascript
{
  name: "Admin",
  email: "admin@shophub.com",
  password: "hashedPassword",
  role: "admin"
}
```

## 📚 Key Dependencies

### Frontend
- `@stripe/stripe-js` & `@stripe/react-stripe-js` - Stripe integration
- `@tanstack/react-query` - Server state management
- `zustand` - Client state management
- `recharts` - Charts for admin analytics
- `axios` - HTTP client
- `react-router-dom` - Routing

### Backend
- `stripe` - Stripe Node.js SDK
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing

## 🐛 Troubleshooting

**MongoDB Connection Error**:
- Ensure MongoDB is running
- Check MONGODB_URI in .env

**Stripe Payment Fails**:
- Verify Stripe API keys
- Check browser console for errors
- Use test card numbers

**CORS Issues**:
- Ensure CLIENT_URL matches frontend URL
- Check CORS configuration in server.js

## 📄 License

MIT

## 👨‍💻 Author

Harjot Singh - Full Stack Developer

## 🚀 Next Steps

- [ ] Add product reviews and ratings
- [ ] Email notifications for orders
- [ ] GCP Storage for product images
- [ ] Inventory alerts for low stock
- [ ] Coupon/discount system
- [ ] Advanced search with Elasticsearch

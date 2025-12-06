# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies  
cd ../client
npm install
```

### 2. Set Up Environment

Copy the example env file and add your keys:

```bash
cd server
cp .env.example .env
```

Edit `.env` with your values:
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key_here
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_PUBLISHABLE_KEY
```

**Get Stripe Keys:**
1. Sign up at https://stripe.com
2. Dashboard → Developers → API keys
3. Copy test mode keys

### 3. Start MongoDB

```bash
# macOS with Homebrew
brew services start mongodb-community

# Or run manually
mongod
```

### 4. Run the App

Open two terminals:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 5. Access the App

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001

## 🧪 Test the App

### Create Admin User

Use MongoDB Compass or mongo shell:

```javascript
db.users.insertOne({
  name: "Admin",
  email: "admin@shophub.com",
  password: "$2a$10$xxxxxx", // Use bcrypt to hash "admin123"
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Or create via Register page and manually update role to "admin" in MongoDB.

### Test Stripe Payment

Use test card:
- **Card Number**: 4242 4242 4242 4242
- **Expiry**: Any future date (e.g., 12/25)
- **CVC**: Any 3 digits (e.g., 123)
- **ZIP**: Any 5 digits (e.g., 12345)

## 📝 Next Steps

1. **Add Products**: Login as admin → Go to `/admin/products` → Create products
2. **Shop**: Browse products → Add to cart → Checkout with Stripe
3. **View Orders**: Check order history and admin dashboard

## 🐛 Troubleshooting

**Port Already in Use:**
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**MongoDB Connection Error:**
```bash
# Check if MongoDB is running
brew services list

# Restart MongoDB
brew services restart mongodb-community
```

**Stripe Payment Fails:**
- Check Stripe keys in `.env`
- Use test card numbers only
- Check browser console for errors

**Dependencies Issues:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentation

- Full README: `/README.md`
- API Endpoints: See README section "API Endpoints"
- Stripe Docs: https://stripe.com/docs
- React Query: https://tanstack.com/query/latest
- Zustand: https://github.com/pmndrs/zustand

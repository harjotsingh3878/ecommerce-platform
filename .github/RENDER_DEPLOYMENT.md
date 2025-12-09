# Deploy Backend on Render - Step by Step

## Prerequisites
- GitHub account with your repository
- MongoDB Atlas account (free tier works)
- Stripe account (test mode is free)

## Step 1: Sign Up for Render

1. Go to [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with GitHub (recommended for easier integration)
4. Authorize Render to access your repositories

## Step 2: Create New Web Service

1. From Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your repository:
   - Select **"ecommerce-platform"** from your repositories
   - If not visible, click "Configure account" to grant access
3. Click **"Connect"**

## Step 3: Configure Service Settings

Fill in the following:

### Basic Settings
- **Name:** `ecommerce-backend` (or your preferred name)
- **Region:** Choose closest to your users (e.g., Oregon, Frankfurt)
- **Branch:** `main`
- **Root Directory:** Leave blank (we'll handle it in commands)
- **Environment:** `Node`
- **Build Command:**
  ```bash
  cd server && npm install
  ```
- **Start Command:**
  ```bash
  cd server && npm start
  ```

### Plan
- Select **"Free"** (or upgrade later)
  - Free plan limitations:
    - Spins down after 15 min of inactivity
    - Takes 30-60 sec to spin back up
    - 750 hours/month free
  - For production, consider **"Starter"** ($7/month) for always-on

## Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Required |
| `PORT` | `5001` | Optional (Render sets this automatically) |
| `MONGODB_URI` | Your MongoDB connection string | From MongoDB Atlas |
| `JWT_SECRET` | Generate a secure random string | Use: `openssl rand -base64 32` |
| `STRIPE_SECRET_KEY` | `sk_test_...` or `sk_live_...` | From Stripe Dashboard |
| `STRIPE_PUBLISHABLE_KEY` | `pk_test_...` or `pk_live_...` | From Stripe Dashboard |
| `CORS_ORIGIN` | Your frontend URL | Will be Vercel URL later |

### Getting Your Values:

**MongoDB URI:**
```
mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
```
- Get from MongoDB Atlas → Clusters → Connect → Connect your application

**JWT Secret:**
```bash
openssl rand -base64 32
```
Run this in your terminal to generate

**Stripe Keys:**
- Dashboard → Developers → API keys
- Use test keys for testing, live keys for production

**CORS_ORIGIN:**
- Use `*` for testing
- Update with your Vercel URL after frontend deployment
- Example: `https://your-app.vercel.app`

## Step 5: Add Health Check (Optional but Recommended)

First, add a health check endpoint to your backend:

```javascript
// In server/src/server.js, add:
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});
```

Then in Render:
- Scroll to **"Health Check Path"**
- Enter: `/api/health`

## Step 6: Deploy

1. Click **"Create Web Service"**
2. Render will:
   - Clone your repository
   - Install dependencies
   - Start your server
3. Watch the logs for any errors
4. Once complete, you'll get a URL like: `https://ecommerce-backend.onrender.com`

## Step 7: Test Your Backend

```bash
# Test health check
curl https://your-app.onrender.com/api/health

# Test products endpoint
curl https://your-app.onrender.com/api/products

# Test with auth (replace with your token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-app.onrender.com/api/orders
```

## Step 8: Enable Auto-Deploy (Recommended)

1. Go to your service → **Settings**
2. Under **"Build & Deploy"**:
   - **Auto-Deploy:** `Yes`
   - Now every push to `main` branch will auto-deploy!

## Step 9: Get Deploy Hook for GitHub Actions

1. In Render Dashboard → Your Service → **Settings**
2. Scroll to **"Deploy Hook"**
3. Click **"Create Deploy Hook"**
4. Copy the URL (looks like: `https://api.render.com/deploy/srv-xxxxx?key=yyyyy`)
5. In GitHub:
   - Go to your repo → **Settings** → **Secrets and variables** → **Actions**
   - Click **"New repository secret"**
   - Name: `RENDER_DEPLOY_HOOK_URL`
   - Value: Paste the deploy hook URL
6. Also add:
   - Name: `API_URL`
   - Value: Your Render URL (e.g., `https://ecommerce-backend.onrender.com`)

## Troubleshooting

### Build Fails
- Check logs in Render dashboard
- Verify `package.json` is in `server/` directory
- Ensure all dependencies are listed in `package.json`

### Service Won't Start
- Check environment variables are set correctly
- Look for errors in logs
- Verify MongoDB URI is correct and IP whitelist allows Render

### Connection Timeout
- Free tier spins down after inactivity
- First request takes 30-60 seconds to wake up
- Consider upgrading to Starter plan ($7/mo) for always-on

### CORS Errors
- Update `CORS_ORIGIN` environment variable with your frontend URL
- Or temporarily set to `*` for testing

### Can't Connect to MongoDB
- In MongoDB Atlas:
  - Network Access → Add IP Address → Allow Access from Anywhere (`0.0.0.0/0`)
  - Or add Render's IPs (check Render docs)
- Verify connection string has correct username/password

## Monitoring

### View Logs
- Dashboard → Your Service → **Logs**
- Real-time logs show all server activity

### Metrics
- Dashboard → Your Service → **Metrics**
- See CPU, Memory, Request rate

### Alerts
- Can set up email alerts for service failures

## Upgrade Considerations

Free tier is great for development, but for production:

| Feature | Free | Starter ($7/mo) |
|---------|------|-----------------|
| Always-on | ❌ | ✅ |
| Custom domain | ❌ | ✅ |
| More resources | ❌ | ✅ |
| Priority support | ❌ | ✅ |

## Next Steps

After backend is deployed:
1. Update `CORS_ORIGIN` with your frontend URL
2. Deploy frontend to Vercel (see VERCEL_DEPLOYMENT.md)
3. Update frontend `VITE_API_URL` to point to Render URL
4. Test the full flow end-to-end

## Useful Commands

```bash
# Manually trigger deployment
curl -X POST https://api.render.com/deploy/srv-xxxxx?key=yyyyy

# Check service status
curl https://your-app.onrender.com/api/health
```

# Deployment Guide

## Prerequisites

### 1. GitHub Secrets Configuration

Go to your repository Settings → Secrets and variables → Actions, and add these secrets:

#### Vercel Secrets (Frontend)
- `VERCEL_TOKEN`: Your Vercel token (get from https://vercel.com/account/tokens)
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID
- `VITE_API_URL`: Your backend API URL (e.g., https://your-app.onrender.com)
- `VITE_STAGING_API_URL`: Staging backend URL (optional)

#### Render Secrets (Backend)
- `RENDER_DEPLOY_HOOK_URL`: Your Render deploy hook URL
- `RENDER_STAGING_DEPLOY_HOOK`: Staging deploy hook (optional)
- `BACKEND_URL`: Your production backend URL

#### MongoDB & App Secrets
- `MONGODB_URI`: Production MongoDB connection string
- `MONGODB_TEST_URI`: Test database connection string (for CI)
- `JWT_SECRET`: Your JWT secret key
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key

## Deployment Platforms

### Frontend: Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Link your project:**
   ```bash
   cd client
   vercel link
   ```

4. **Get your Project & Org IDs:**
   ```bash
   cat .vercel/project.json
   ```
   Add `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` to GitHub Secrets.

5. **Set Environment Variables in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `VITE_API_URL` = your backend URL

### Backend: Render

1. **Sign up at [render.com](https://render.com)**

2. **Create New Web Service:**
   - Connect your GitHub repository
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Add Environment Variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret
   STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
   PORT=5001
   ```

4. **Get Deploy Hook:**
   - Settings → Deploy Hook → Create
   - Add URL to GitHub Secrets as `RENDER_DEPLOY_HOOK_URL`

5. **Add Health Check Endpoint** (server/src/server.js):
   ```javascript
   app.get('/health', (req, res) => {
     res.status(200).json({ status: 'ok' });
   });
   ```

## Automated Workflows

### 1. CI Pipeline (`ci.yml`)
Runs on every push and PR to `main` or `develop`:
- ✅ Backend linting and tests
- ✅ Frontend linting, type checking, and build
- ✅ Security audits
- ✅ Multi-version Node.js testing

### 2. Production Deployment
Automatic deployment when pushing to `main`:
- **Frontend** (`deploy-frontend.yml`): Deploys to Vercel
- **Backend** (`deploy-backend.yml`): Deploys to Render

### 3. Staging Deployment (`deploy-staging.yml`)
Automatic deployment when pushing to `develop`:
- Deploys to staging environments
- Creates Vercel preview deployments

## Manual Deployment

### Deploy Frontend Manually:
```bash
cd client
vercel --prod
```

### Deploy Backend Manually:
Push to main branch or trigger via Render dashboard.

## Workflow Triggers

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| CI Pipeline | Push/PR to main/develop | Run tests and checks |
| Deploy Frontend | Push to main (client/\*\*) | Deploy to Vercel |
| Deploy Backend | Push to main (server/\*\*) | Deploy to Render |
| Deploy Staging | Push to develop | Deploy to staging |

## Testing Deployments

### Frontend:
```bash
# Check if build works
cd client
npm run build

# Preview locally
npm run preview
```

### Backend:
```bash
# Test production mode locally
cd server
NODE_ENV=production npm start
```

## Monitoring

### Check Deployment Status:
- **Vercel**: https://vercel.com/dashboard
- **Render**: https://dashboard.render.com
- **GitHub Actions**: Repository → Actions tab

### Health Checks:
- Frontend: Visit your Vercel URL
- Backend: `curl https://your-backend.onrender.com/health`

## Rollback

### Vercel (Frontend):
1. Go to Vercel Dashboard
2. Select your project
3. Deployments → Find previous working version
4. Click "..." → Promote to Production

### Render (Backend):
1. Go to Render Dashboard
2. Select your service
3. Events → Find previous deploy
4. Manual Deploy → Deploy from that commit

## Troubleshooting

### Build Fails on Vercel:
- Check build logs in Vercel dashboard
- Verify `VITE_API_URL` environment variable is set
- Ensure all dependencies are in `package.json`

### Deploy Fails on Render:
- Check deploy logs in Render dashboard
- Verify environment variables are set
- Check MongoDB connection string
- Ensure PORT is set correctly

### GitHub Actions Fails:
- Check Actions tab for error logs
- Verify all secrets are configured
- Check if external services are accessible

## Branch Strategy

- `main`: Production branch (auto-deploys to production)
- `develop`: Staging branch (auto-deploys to staging)
- `feature/*`: Feature branches (CI checks only)

## Cost Estimates

### Free Tier Limits:
- **Vercel**: Unlimited deployments, 100GB bandwidth/month
- **Render**: 750 hours/month (1 service always on)
- **MongoDB Atlas**: 512MB storage
- **GitHub Actions**: 2,000 minutes/month

All platforms offer free tiers suitable for development and small production apps.

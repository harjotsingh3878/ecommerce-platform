# Deploy Frontend on Vercel - Step by Step

## Prerequisites
- GitHub account with your repository
- Backend deployed on Render (see RENDER_DEPLOYMENT.md)
- Stripe publishable key

## Step 1: Sign Up for Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your repositories

## Step 2: Import Your Project

1. From Vercel Dashboard, click **"Add New..."** → **"Project"**
2. Find your repository: **"ecommerce-platform"**
3. Click **"Import"**

## Step 3: Configure Project Settings

### Framework Preset
- Vercel should auto-detect **"Vite"**
- If not, select it manually

### Root Directory
- Click **"Edit"** next to Root Directory
- Set to: `client`
- This tells Vercel where your frontend code is

### Build and Output Settings
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `dist` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

## Step 4: Add Environment Variables

Click **"Environment Variables"** and add:

| Name | Value | Notes |
|------|-------|-------|
| `VITE_API_URL` | `https://your-backend.onrender.com` | Your Render backend URL |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` or `pk_live_...` | From Stripe Dashboard |

**Important:** 
- Use your actual Render URL (e.g., `https://ecommerce-backend.onrender.com`)
- No trailing slash in the URL
- For all environments (Production, Preview, Development)

## Step 5: Deploy

1. Click **"Deploy"**
2. Vercel will:
   - Clone your repository
   - Install dependencies
   - Build your Vite app
   - Deploy to global CDN
3. Wait 1-2 minutes
4. You'll get a URL like: `https://ecommerce-platform-xxxxx.vercel.app`

## Step 6: Update API Service

Currently, your frontend uses a proxy. Let's update it to use the environment variable:

The API service at `client/src/services/api.ts` should use:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  // ... rest of config
});
```

This is already set up, but verify the file uses `import.meta.env.VITE_API_URL`.

## Step 7: Update Backend CORS

Your backend needs to allow requests from Vercel:

1. Go to Render Dashboard → Your Service → **Environment**
2. Update or add `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://ecommerce-platform-xxxxx.vercel.app
   ```
   Replace with your actual Vercel URL
3. Click **"Save Changes"**
4. Service will automatically redeploy

## Step 8: Set Up Custom Domain (Optional)

1. In Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Add your domain (e.g., `myshop.com`)
3. Follow DNS instructions to point domain to Vercel
4. Vercel automatically provisions SSL certificate

Update backend CORS to include custom domain.

## Step 9: Enable Automatic Deployments

Already enabled! Every push to `main` branch will:
- Trigger automatic deployment
- Build and deploy in ~1 minute
- Update your live site

**Preview Deployments:**
- Every pull request gets a preview URL
- Test changes before merging
- URL format: `https://ecommerce-platform-git-branch-name.vercel.app`

## Step 10: Get Vercel Tokens for GitHub Actions

For the GitHub Actions workflow to work:

1. Go to Vercel Dashboard → **Settings** → **Tokens**
2. Click **"Create Token"**
3. Name it: `GitHub Actions`
4. Copy the token

5. Get Project IDs:
   ```bash
   cd client
   npx vercel link
   ```
   This creates `.vercel/project.json` with your IDs

6. Add to GitHub Secrets:
   - Go to GitHub repo → **Settings** → **Secrets and variables** → **Actions**
   - Add these secrets:
     - `VERCEL_TOKEN`: Your token from step 3
     - `VERCEL_ORG_ID`: From `.vercel/project.json` (orgId field)
     - `VERCEL_PROJECT_ID`: From `.vercel/project.json` (projectId field)
     - `VITE_API_URL`: Your Render backend URL
     - `VITE_STRIPE_PUBLISHABLE_KEY`: Your Stripe key

## Testing Your Deployment

1. **Open your Vercel URL** in browser
2. **Test key features:**
   - Browse products (should load from backend)
   - Register/Login
   - Add items to cart
   - Complete checkout (test mode)
   - View orders

3. **Check browser console** for any CORS or API errors

4. **Common issues:**
   - If products don't load: Check `VITE_API_URL` is correct
   - If CORS errors: Update backend `CORS_ORIGIN`
   - If checkout fails: Verify Stripe key is correct

## Monitoring

### Vercel Analytics (Free)
1. Go to your project → **Analytics**
2. See page views, performance metrics
3. Real-time visitor data

### Function Logs
1. Project → **Deployments** → Select a deployment
2. Click **"Functions"** tab
3. View server-side logs (if using serverless functions)

## Performance Tips

### Enable Vercel Speed Insights
```bash
npm install @vercel/speed-insights --prefix client
```

In `client/src/main.tsx`:
```typescript
import { SpeedInsights } from '@vercel/speed-insights/react';

// In your render:
<SpeedInsights />
```

### Enable Web Vitals
Already included with `@vercel/analytics` - tracks Core Web Vitals automatically.

### Image Optimization
If you add more images, use Vercel's Image Optimization:
```typescript
import Image from 'next/image'; // If using Next.js
// Or use Vite's built-in optimization
```

## Environment-Specific Configurations

### Production
- Full URL: `https://your-domain.com`
- Live Stripe keys
- Production MongoDB

### Preview (PR Deployments)
- Automatic for each PR
- Test Stripe keys
- Can use staging database

### Development
- Run locally
- `localhost:3000`
- Test keys and local DB

## Rollback Deployments

If something goes wrong:

1. Go to **Deployments**
2. Find a previous working deployment
3. Click **"..."** → **"Promote to Production"**
4. Site rolls back instantly!

## Cost

### Free Tier Includes:
- Unlimited deployments
- 100 GB bandwidth/month
- Automatic HTTPS
- Preview deployments
- Edge network (CDN)

### Pro Tier ($20/month):
- More bandwidth
- Better analytics
- Priority support
- Team features

Free tier is sufficient for most projects!

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all dependencies in `package.json`
- Ensure TypeScript has no errors: `npm run type-check`

### Environment Variables Not Working
- Prefix must be `VITE_` for Vite to expose them
- Redeploy after adding new variables
- Check in build logs that variables are set

### API Calls Fail
- Verify `VITE_API_URL` is set correctly
- Check backend CORS allows your Vercel domain
- Open browser DevTools → Network tab to see actual requests

### Site Shows Old Version
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Check deployment was successful in Vercel dashboard
- Clear browser cache

## GitHub Actions Integration

The workflows are already set up! They will:

1. **CI (ci.yml):** Run on every push/PR
   - Test frontend build
   - Check for errors
   - Run security scans

2. **Deploy Frontend (deploy-frontend.yml):** Run on push to `main`
   - Build and deploy to Vercel
   - Update production site

3. **Preview (preview.yml):** Run on pull requests
   - Create preview deployment
   - Comment PR with preview URL

All automatic - just push your code!

## Next Steps

1. ✅ Backend deployed on Render
2. ✅ Frontend deployed on Vercel
3. Update README with your live URLs
4. Test end-to-end checkout flow
5. Set up monitoring/analytics
6. Configure custom domain (optional)
7. Switch to production Stripe keys when ready

## Useful Commands

```bash
# Deploy from CLI
cd client
vercel --prod

# Check deployment status
vercel list

# View logs
vercel logs

# Link project (one-time setup)
vercel link
```

## Support

- Vercel Docs: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- GitHub Issues: Your repository issues page

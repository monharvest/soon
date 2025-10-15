# Deploying to Cloudflare Pages with Wrangler

This guide will help you deploy your Mongolian blog to Cloudflare Pages using Wrangler CLI.

## Prerequisites

1. **Cloudflare Account** - Sign up at https://dash.cloudflare.com
2. **Wrangler CLI** - Already included in devDependencies
3. **Node.js** - Version 18 or higher

## Step 1: Install Dependencies

\`\`\`bash
npm install
\`\`\`

## Step 2: Login to Cloudflare

\`\`\`bash
npx wrangler login
\`\`\`

This will open a browser window to authenticate with your Cloudflare account.

## Step 3: Build Your Next.js App

\`\`\`bash
npm run build
\`\`\`

This creates an optimized production build in the `.next` directory.

## Step 4: Deploy to Cloudflare Pages

\`\`\`bash
npx wrangler pages deploy .next --project-name=blogcopy
\`\`\`

On first deployment, Wrangler will:
1. Create a new Cloudflare Pages project named `blogcopy`
2. Upload your built files
3. Provide you with a deployment URL: `https://blogcopy.pages.dev`

## Step 5: Set Environment Variables

After deployment, add your environment variables in the Cloudflare Dashboard:

1. Go to https://dash.cloudflare.com
2. Navigate to **Pages** → **blogcopy** → **Settings** → **Environment variables**
3. Add the following variables for **Production**:

**Required Variables:**
- `CLOUDFLARE_API_TOKEN`: Your KV API token with read/write permissions
- `ADMIN_PASSWORD`: Your chosen admin panel password
- `R2_ACCESS_KEY_ID`: Your R2 access key ID
- `R2_SECRET_ACCESS_KEY`: Your R2 secret access key
- `CLOUDFLARE_ACCOUNT_ID`: `01644e982bf4fd61e45c31c2dc1a2a57`
- `CLOUDFLARE_NAMESPACE_ID`: `221b29add0c440658fdbab5c5665340c`
- `NEXT_PUBLIC_R2_PUBLIC_URL`: `https://01644e982bf4fd61e45c31c2dc1a2a57.r2.cloudflarestorage.com/blog-images`

4. Click **Save** and **Redeploy** for changes to take effect

## Step 6: Access Your Site

After deployment and environment variable setup:
- **Main site**: `https://blogcopy.pages.dev`
- **Admin panel**: `https://blogcopy.pages.dev/admin/login`

## Subsequent Deployments

After the initial setup, deploying updates is simple:

\`\`\`bash
npm run build
npx wrangler pages deploy .next --project-name=blogcopy
\`\`\`

## Step 7: Configure Custom Domain (Optional)

1. Go to Cloudflare Dashboard → Pages
2. Select your project (`blogcopy`)
3. Go to "Custom domains"
4. Add your domain and follow DNS setup instructions

## Troubleshooting

### Build Errors

If you encounter build errors, check:
- Node.js version (should be 18+)
- All dependencies are installed
- TypeScript errors are resolved

### Runtime Errors

If the deployed site has errors:
- Check Cloudflare Pages logs in the dashboard
- Verify environment variables are set correctly in Cloudflare Dashboard
- Ensure KV namespace and R2 bucket are accessible

### API Routes Not Working

- Verify all environment variables are set in Cloudflare Dashboard
- Check that your Cloudflare API token has the correct permissions
- Review the deployment logs for any errors

## Useful Commands

\`\`\`bash
# View deployment logs
npx wrangler pages deployment list --project-name=blogcopy

# View project info
npx wrangler pages project list

# Tail live logs
npx wrangler pages deployment tail --project-name=blogcopy
\`\`\`

## Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler/)

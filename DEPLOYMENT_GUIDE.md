# Static Site Deployment Guide

Your blog is now configured as a **static site** that pre-renders all posts at build time.

## How It Works

1. **Build time**: Fetches all posts from Cloudflare KV and generates static HTML
2. **Deploy**: Upload static files to Cloudflare Pages with Wrangler
3. **Runtime**: Fast, static site with no server needed

## Local Development

\`\`\`bash
# Make sure .env.local has your credentials
npm run dev
\`\`\`

## Deployment Steps

### 1. Build the static site

\`\`\`bash
npm run build
\`\`\`

This will:
- Fetch all posts from Cloudflare KV
- Generate static HTML for all pages
- Output to the `out` folder

### 2. Deploy to Cloudflare Pages

\`\`\`bash
npm run deploy
\`\`\`

Or manually:

\`\`\`bash
wrangler pages deploy out --project-name=blogcopy
\`\`\`

### 3. Set Environment Variables (First Deploy Only)

Go to Cloudflare Dashboard → Pages → blogcopy → Settings → Environment variables

Add these for **Production**:
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_NAMESPACE_ID`
- `CLOUDFLARE_API_TOKEN`
- `NEXT_PUBLIC_R2_PUBLIC_URL`

Note: Build-time variables are used during `npm run build` on your local machine, so the deployed site doesn't need API access.

## Updating Content

When you create/edit posts:

1. Use admin panel locally: `npm run dev` → http://localhost:3000/admin/login
2. Create/edit posts (saves to Cloudflare KV)
3. Rebuild: `npm run build`
4. Redeploy: `npm run deploy`

## Admin Panel

The admin panel (`/admin/*`) won't work on the deployed site since it requires API routes. Use it locally to manage content, then rebuild and redeploy.

## Your Site

After deployment, your blog will be live at:
- Production: `https://blogcopy.pages.dev`
- Preview: `https://[commit-hash].blogcopy.pages.dev`

## Benefits of Static Export

- Super fast loading (pre-rendered HTML)
- No server costs
- Works perfectly with Cloudflare Pages
- Simple deployment with Wrangler
</markdown>

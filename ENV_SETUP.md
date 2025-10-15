# Environment Variables Setup

This file explains how to set up your environment variables for building and deploying the blog.

## Required Environment Variables

The `.env.local` file contains all the environment variables needed to build your static blog. You need to replace the placeholder values with your actual credentials.

### 1. CLOUDFLARE_API_TOKEN

**Already configured:** Account ID and Namespace ID are set.

**You need to add:** Your Cloudflare API token with KV Storage permissions.

**Where to find it:**
1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Find your "Blog admin" token (or create a new one)
3. Copy the token value
4. Replace `YOUR_CLOUDFLARE_API_TOKEN_HERE` in `.env.local`

### 2. R2 Storage Credentials (Optional)

**Already configured:** The public R2 URL is set.

**You need to add:** R2 Access Key ID and Secret Access Key (only if you want to upload images through the admin panel locally).

**Where to find it:**
1. Go to https://dash.cloudflare.com → R2
2. Click "Manage R2 API Tokens"
3. Create a new API token with Read & Write permissions
4. Copy the Access Key ID and Secret Access Key
5. Replace the placeholders in `.env.local`

**Note:** For the static export deployment, you only need the R2 public URL. The access keys are only needed if you want to upload images locally.

### 3. Admin Password

**Already configured:** Set to `789Hosanna7-`

**Note:** The admin panel doesn't work in the static export deployment. It's only available when running locally with `npm run dev` (which requires API routes).

## Building and Deploying

Once you've added your CLOUDFLARE_API_TOKEN:

\`\`\`bash
# Build the static site (fetches posts from KV)
npm run build

# Deploy to Cloudflare Pages
npm run deploy
\`\`\`

The build process will fetch all posts from Cloudflare KV and generate static HTML files in the `out` folder.

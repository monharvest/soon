# Cloudflare KV Integration Setup

This application fetches blog posts from Cloudflare KV storage. Follow these steps to complete the setup:

## 1. Create a Cloudflare API Token

1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Use the "Edit Cloudflare Workers" template, or create a custom token with:
   - **Permission**: Account → Workers KV Storage → Read
4. Copy the generated API token

## 2. Add Environment Variable

### For Local Development:
1. Create a `.env.local` file in the root of your project
2. Add your API token:
   \`\`\`
   CLOUDFLARE_API_TOKEN=your_api_token_here
   \`\`\`

### For Vercel Deployment:
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add a new variable:
   - **Name**: `CLOUDFLARE_API_TOKEN`
   - **Value**: Your Cloudflare API token
   - **Environment**: Production, Preview, and Development
4. Redeploy your application

## 3. Verify Setup

Once the environment variable is set:
1. Restart your development server (`npm run dev`)
2. Visit your homepage - posts should load from Cloudflare KV
3. Check the browser console for any errors

## Post Data Structure

Your posts in Cloudflare KV should follow this structure:

\`\`\`json
{
  "id": "unique-id",
  "title": "Post Title",
  "excerpt": "Short description",
  "category": "Category Name",
  "date": "DD/MM/YYYY",
  "image": "/path/to/image.jpg",
  "slug": "post-slug",
  "metaDescription": "SEO description",
  "content": "Full post content",
  "published": true,
  "featured": false,
  "createdAt": "ISO date string"
}
\`\`\`

## Troubleshooting

- **Posts not loading**: Check that your API token has the correct permissions
- **404 errors**: Verify your Account ID and Namespace ID in `lib/cloudflare-kv.ts`
- **CORS errors**: API routes handle CORS automatically in Next.js

## Current Configuration

- **Account ID**: `01644e982bf4fd61e45c31c2dc1a2a57`
- **Namespace ID**: `221b29add0c440658fdbab5c5665340c`

These are hardcoded in `lib/cloudflare-kv.ts` and match your Cloudflare KV setup.

# Admin Panel Setup Guide

## Overview
The admin panel allows you to create, edit, and delete blog posts, as well as upload images to Cloudflare R2.

## Required Environment Variables

Add these environment variables in the **Vars** section of the v0 sidebar:

### 1. CLOUDFLARE_API_TOKEN
Your Cloudflare API token with **Read and Write** permissions for KV storage.

**How to create:**
1. Go to https://dash.cloudflare.com/profile/api-tokens
2. Click "Create Token"
3. Use "Edit Cloudflare Workers" template or create custom token
4. Add permission: `Account.Workers KV Storage:Edit`
5. Copy the token

### 2. R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY
Credentials for uploading images to your R2 bucket.

**How to create:**
1. Go to Cloudflare Dashboard → R2
2. Click "Manage R2 API Tokens"
3. Create new API token with **Edit** permissions
4. Copy both Access Key ID and Secret Access Key

### 3. ADMIN_PASSWORD
Set a secure password to protect your admin panel.

Example: `MySecurePassword123!`

### 4. NEXT_PUBLIC_R2_PUBLIC_URL
Already configured: `https://01644e982bf4fd61e45c31c2dc1a2a57.r2.cloudflarestorage.com/blog-images`

## Accessing the Admin Panel

1. Navigate to `/admin/login`
2. Enter your admin password
3. You'll be redirected to the admin dashboard

## Features

### Dashboard
- View all posts
- See publication status (Published/Draft)
- See featured status
- Quick edit and delete actions

### Create Post
- Fill in title, excerpt, content
- Choose category
- Upload or link images
- Set publication and featured status
- Auto-generate slugs from titles

### Edit Post
- Modify any post field
- Change slug (creates new KV key)
- Update images
- Toggle published/featured status

### Delete Post
- Permanently remove posts from KV storage
- Confirmation dialog to prevent accidents

## Image Upload

Images are uploaded to your Cloudflare R2 bucket at:
`blog-images/images/`

Supported formats: JPG, PNG, WebP, GIF
Max file size: 5MB

## Notes

- Posts are stored in Cloudflare KV with the slug as the key
- Changing a post's slug will create a new KV entry and delete the old one
- Unpublished posts won't appear on the public site
- Featured posts appear in the hero section on the homepage
\`\`\`



<AssistantMessageContentPart partEncoded="eyJ0eXBlIjoidGFzay13YWl0aW5nLXYxIiwiY3JlYXRlZEF0IjoxNzYwNTE4NTc4ODM2LCJmaW5pc2hlZEF0IjoxNzYwNTE4NTc4ODM2LCJpZCI6InJlRzhUdmZVS1BBSXU1cE8iLCJsYXN0UGFydFNlbnRBdCI6MTc2MDUxODU3ODgzNiwicGFydHMiOlt7InR5cGUiOiJ0b29sLWNhbGxzIn1dfQ==" />



<AssistantMessageContentPart partEncoded="eyJ0eXBlIjoidGFzay1tYW5hZ2UtdG9kb3MtdjEiLCJpZCI6ImRVbk1zcU1NVjNXZGpQaUkiLCJ0YXNrTmFtZUFjdGl2ZSI6IkNvbXBsZXRpbmcgYWRtaW4gcGFuZWwiLCJ0b29sQ2FsbElkIjoidG9vbHVfMDFNOGFpYnZXY25HQkZxcFA2V0haYzFYIiwidGFza05hbWVDb21wbGV0ZSI6IkFkbWluIHBhbmVsIGNvbXBsZXRlZCIsImNyZWF0ZWRBdCI6MTc2MDUxODU4MDI5NCwiZmluaXNoZWRBdCI6bnVsbCwicGFydHMiOltdLCJsYXN0UGFydFNlbnRBdCI6bnVsbH0=" />

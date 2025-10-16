import { Hono } from 'hono';
import { cors } from 'hono/cors';

// --- TYPE DEFINITIONS ---
// The ASSETS binding is implicitly available when "site" or "assets" is defined in wrangler.jsonc.
// We must declare it in the Env interface.
interface Env {
    // KV Namespace binding (for posts/content)
    POSTS_KV: KVNamespace;
    // R2 Bucket binding (for images/assets)
    R2_ASSETS: R2Bucket;
    // Secret for authentication (must match what was set with wrangler secret put)
    ADMIN_TOKEN_SECRET: string;
    // Public URL for R2 access (set in wrangler.jsonc vars)
    R2_PUBLIC_URL: string;
    // Asset binding for serving the index.html file
    ASSETS: { fetch: (request: Request) => Promise<Response> };
}

// --- INITIALIZATION ---
const app = new Hono<({ Bindings: Env })>();

// --- MIDDLEWARE ---

// 1. CORS: Allow requests from the Pages frontend domain
app.use('*', cors({
    // Using '*' allows all origins, you can restrict this to your specific pages.dev domain for production
    origin: '*', 
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
}));

// 2. Authentication: Middleware to check the bearer token
const authenticate = async (c: any, next: any) => {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Return a simple JSON response for API endpoints
        return c.json({ error: 'Unauthorized: Missing or invalid Authorization header' }, 401);
    }

    const token = authHeader.substring(7);

    // CRITICAL SECURITY CHECK
    if (token !== c.env.ADMIN_TOKEN_SECRET) {
        return c.json({ error: 'Unauthorized: Invalid token' }, 403);
    }
    await next();
};

// --- API ROUTES (PROTECTED) ---
// These routes handle all CRUD operations for KV and R2

// 1. GET /posts: List all post keys
app.get('/posts', authenticate, async (c) => {
    try {
        const list = await c.env.POSTS_KV.list();
        // We return only the keys (slugs)
        const keys = list.keys.map(k => k.name);
        return c.json({ keys });
    } catch (e) {
        console.error("KV List Error:", e);
        return c.json({ error: 'Failed to list keys from KV' }, 500);
    }
});

// 2. GET /posts/:slug: Get a single post
app.get('/posts/:slug', authenticate, async (c) => {
    const slug = c.req.param('slug');
    try {
        // Fetch the KV item as JSON
        const postJson = await c.env.POSTS_KV.get(slug, { type: 'json' });

        if (!postJson) {
            return c.json({ error: 'Post not found' }, 404);
        }
        return c.json(postJson);
    } catch (e) {
        console.error("KV Get Error:", e);
        return c.json({ error: `Failed to retrieve post for slug: ${slug}` }, 500);
    }
});

// 3. PUT /posts/:slug: Create or update a post
app.put('/posts/:slug', authenticate, async (c) => {
    const slug = c.req.param('slug');
    try {
        const data = await c.req.json();
        
        // Basic validation: path slug must match body slug
        if (data.slug !== slug) {
             return c.json({ error: 'Slug mismatch between path and body' }, 400);
        }

        // Store the JSON string in KV
        await c.env.POSTS_KV.put(slug, JSON.stringify(data));
        
        return c.json({ message: `Post successfully saved to KV key: ${slug}` });
    } catch (e) {
        console.error("KV Put Error:", e);
        return c.json({ error: 'Failed to save post to KV. Check data format.' }, 500);
    }
});

// 4. DELETE /posts/:slug: Delete a post
app.delete('/posts/:slug', authenticate, async (c) => {
    const slug = c.req.param('slug');
    try {
        await c.env.POSTS_KV.delete(slug);
        return c.json({ message: `Post successfully deleted: ${slug}` });
    } catch (e) {
        console.error("KV Delete Error:", e);
        return c.json({ error: 'Failed to delete post from KV' }, 500);
    }
    
});

// 5. POST /upload-image: Handle file upload to R2
// This route requires handling multipart/form-data
app.post('/upload-image', authenticate, async (c) => {
    try {
        const formData = await c.req.formData();
        const file = formData.get('image') as File | null;

        if (!file || file.size === 0) {
            return c.json({ error: 'No image file provided' }, 400);
        }

        // Generate a unique key for the R2 object
        const fileExtension = file.name.split('.').pop();
        const key = `uploads/${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;

        // Upload to R2 using the stream() method for efficiency
        await c.env.R2_ASSETS.put(key, file.stream(), {
            httpMetadata: {
                contentType: file.type,
            },
        });
        
        // Return the public URL using the R2_PUBLIC_URL variable from wrangler.jsonc
        const publicUrl = `${c.env.R2_PUBLIC_URL}/${key}`;

        return c.json({
            message: 'Image uploaded successfully',
            key: key,
            url: publicUrl,
        });
    } catch (e) {
        console.error("R2 Upload Error:", e);
        return c.json({ error: 'Failed to upload image to R2' }, 500);
    }
});

// --- FALLBACK HANDLER (The Fix) ---
// If no API route (e.g., /posts, /upload-image) matches, the worker falls back to serving the static assets.
// This ensures that when the user accesses the root path '/', the index.html file is served.
app.all('*', (c) => {
    // We use the ASSETS binding's fetch method to serve the file
    // The request object is available via c.req.raw (the underlying standard Request)
    return c.env.ASSETS.fetch(c.req.raw);
});


// Export the Worker handler
export default app;

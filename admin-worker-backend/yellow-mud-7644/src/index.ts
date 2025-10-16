import type { KVNamespace, R2Bucket } from "@cloudflare/workers-types"

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const path = url.pathname

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders })
    }

    // Authentication check
    const authHeader = request.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders })
    }

    const token = authHeader.substring(7)
    if (token !== env.ADMIN_TOKEN_SECRET) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders })
    }

    try {
      // GET /posts - List all posts
      if (path === "/posts" && request.method === "GET") {
        const list = await env.POSTS_KV.list({ prefix: "post:" })
        const keys = list.keys.map((k) => k.name.replace(/^post:/, ""))
        return new Response(JSON.stringify({ keys }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      // GET /posts/:slug - Get single post
      if (path.startsWith("/posts/") && request.method === "GET") {
        const slug = decodeURIComponent(path.substring(7))
        let post = await env.POSTS_KV.get(`post:${slug}`, "json")
        if (!post) {
          post = await env.POSTS_KV.get(slug, "json")
        }

        if (!post) {
          return new Response("Post not found", { status: 404, headers: corsHeaders })
        }

        return new Response(JSON.stringify(post), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      // PUT /posts/:slug - Create or update post
      if (path.startsWith("/posts/") && request.method === "PUT") {
        const slug = decodeURIComponent(path.substring(7))
        const postData = await request.json()

        let existingPost = await env.POSTS_KV.get(`post:${slug}`, "json")
        if (!existingPost) {
          existingPost = await env.POSTS_KV.get(slug, "json")
        }

        const now = new Date().toISOString()
        const post = {
          ...postData,
          createdAt: existingPost?.createdAt || now,
          updatedAt: now,
        }

        await env.POSTS_KV.put(`post:${slug}`, JSON.stringify(post))

        if (existingPost && !(await env.POSTS_KV.get(`post:${slug}`))) {
          await env.POSTS_KV.delete(slug)
        }

        return new Response(JSON.stringify(post), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      // DELETE /posts/:slug - Delete post
      if (path.startsWith("/posts/") && request.method === "DELETE") {
        const slug = decodeURIComponent(path.substring(7))
        await env.POSTS_KV.delete(`post:${slug}`)
        await env.POSTS_KV.delete(slug)

        return new Response("Post deleted", {
          headers: { ...corsHeaders, "Content-Type": "text/plain" },
        })
      }

      // POST /upload-image - Upload image to R2
      if (path === "/upload-image" && request.method === "POST") {
        const formData = await request.formData()
        const file = formData.get("image")

        if (!file || !(file instanceof File)) {
          return new Response("No image file provided", { status: 400, headers: corsHeaders })
        }

        const timestamp = Date.now()
        const filename = file.name
        const key = `posts/images/${timestamp}-${filename}`

        await env.R2_ASSETS.put(key, file.stream())

        const imageUrl = `/posts/images/${timestamp}-${filename}`

        return new Response(JSON.stringify({ url: imageUrl }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      // GET /images - List all images from R2
      if (path === "/images" && request.method === "GET") {
        const list = await env.R2_ASSETS.list({ prefix: "posts/images/" })
        const images = list.objects.map((obj) => ({
          key: obj.key,
          url: `/${obj.key}`,
          uploaded: obj.uploaded,
          size: obj.size,
        }))
        return new Response(JSON.stringify({ images }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      return new Response("Not found", { status: 404, headers: corsHeaders })
    } catch (error) {
      console.error("Worker error:", error)
      return new Response(`Internal server error: ${error.message}`, {
        status: 500,
        headers: corsHeaders,
      })
    }
  },
}

interface Env {
  POSTS_KV: KVNamespace
  R2_ASSETS: R2Bucket
  ADMIN_TOKEN_SECRET: string
  R2_PUBLIC_URL: string
}

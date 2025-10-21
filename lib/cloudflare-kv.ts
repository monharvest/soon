import fs from "fs"
import path from "path"

const ACCOUNT_ID = "01644e982bf4fd61e45c31c2dc1a2a57"
const NAMESPACE_ID = "221b29add0c440658fdbab5c5665340c"

export interface Post {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  image: string
  slug: string
  metaDescription: string
  content: string
  published: boolean
  featured: boolean
  createdAt: string
}

// In-process cache to avoid reading fallback file repeatedly during build.
let _cachedPosts: Post[] | null = null
let _fallbackLogged = false

export async function getAllPosts(): Promise<Post[]> {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN

  // Return cached if we've already loaded posts (from KV or local fallback)
  if (_cachedPosts) return _cachedPosts

  // If the Cloudflare API token is not available during a build (e.g. Pages
  // builds that don't have the secret set), attempt a local fallback to
  // `data/posts.json`. This lets static exports succeed without requiring
  // secrets in the build environment.
  if (!apiToken || apiToken === "YOUR_CLOUDFLARE_API_TOKEN_HERE") {
    if (!_fallbackLogged) {
      console.warn(
        "[v0] CLOUDFLARE_API_TOKEN not available during build. Attempting local fallback: data/posts.json",
      )
    }

    try {
      const fallbackPath = path.resolve(process.cwd(), "data/posts.json")
      if (fs.existsSync(fallbackPath)) {
        const raw = fs.readFileSync(fallbackPath, "utf-8")
        const localPosts = JSON.parse(raw) as Array<any>
        const mapped = localPosts.map((p, i) => ({
          id: p.id || `local-${i}`,
          title: p.title || p.slug || "",
          excerpt: p.excerpt || "",
          category: p.category || "",
          date: p.date || new Date().toISOString(),
          image: p.image || "",
          slug: p.slug || "",
          metaDescription: p.metaDescription || "",
          content: p.content || "",
          published: typeof p.published === "boolean" ? p.published : true,
          featured: typeof p.featured === "boolean" ? p.featured : false,
          createdAt: p.createdAt || new Date().toISOString(),
        })) as Post[]

        _cachedPosts = mapped
        _fallbackLogged = true
        console.warn("[v0] Using local posts.json fallback for getAllPosts()")
        return mapped
      }
    } catch (err) {
      if (!_fallbackLogged) console.warn("[v0] Failed to read local posts.json fallback in getAllPosts():", err)
    }

    if (!_fallbackLogged) {
      console.warn(
        "[v0] No local fallback found. Returning empty posts array. Posts will be fetched at runtime when the token is available.",
      )
      _fallbackLogged = true
    }

    _cachedPosts = []
    return []
  }

  try {
    const keysResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/keys`,
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      },
    )

    if (!keysResponse.ok) {
      const errorText = await keysResponse.text()
      console.error("[v0] Failed to fetch keys:", errorText)
      throw new Error(`Failed to fetch keys: ${keysResponse.statusText}`)
    }

  const keysData: any = await keysResponse.json()
  const allKeys = keysData?.result || []

    const postKeys = allKeys.filter((key: { name: string }) => key.name.startsWith("post:"))

    console.log(
      "[v0] Found post keys in KV:",
      postKeys.map((k: any) => k.name),
    )

  const postPromises = postKeys.map(async (key: { name: string }) => {
      try {
        const encodedKey = encodeURIComponent(key.name)
        const valueResponse = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/${encodedKey}`,
          {
            headers: {
              Authorization: `Bearer ${apiToken}`,
            },
            next: { revalidate: 60 }, // Revalidate every 60 seconds
          },
        )

        if (!valueResponse.ok) {
          console.error(`[v0] Failed to fetch value for key "${key.name}": ${valueResponse.status}`)
          return null
        }

        const post = await valueResponse.json()
        return post as Post
      } catch (error) {
        console.error(`[v0] Error fetching post for key "${key.name}":`, error)
        return null
      }
    })

  const posts = await Promise.all(postPromises)

    const validPosts = (posts.filter((post: any) => post !== null) as Post[])

    _cachedPosts = validPosts
    console.log("[v0] Successfully fetched", validPosts.length, "posts")

    return validPosts
  } catch (error) {
    console.error("[v0] Error fetching posts from Cloudflare KV:", error)
    throw error
  }
}

export async function getPublishedPosts(): Promise<Post[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter((post) => post.published === true)
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getAllPosts()
  return posts.find((post) => post.slug === slug) || null
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const posts = await getAllPosts()
  return posts.filter((post) => post.category === category)
}

export async function getFeaturedPosts(): Promise<Post[]> {
  const posts = await getAllPosts()
  return posts.filter((post) => post.featured)
}

export async function createPost(post: Omit<Post, "id" | "createdAt">): Promise<Post> {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN

  if (!apiToken) {
    throw new Error("CLOUDFLARE_API_TOKEN is not set")
  }

  const newPost: Post = {
    ...post,
    id: `post_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    createdAt: new Date().toISOString(),
  }

  try {
    const key = `post:${newPost.slug}`
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/${encodeURIComponent(key)}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to create post: ${response.statusText}`)
    }

    return newPost
  } catch (error) {
    console.error("Error creating post in Cloudflare KV:", error)
    throw error
  }
}

export async function updatePost(slug: string, post: Partial<Post>): Promise<Post> {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN

  if (!apiToken) {
    throw new Error("CLOUDFLARE_API_TOKEN is not set")
  }

  try {
    const existingPost = await getPostBySlug(slug)
    if (!existingPost) {
      throw new Error("Post not found")
    }

    const updatedPost: Post = {
      ...existingPost,
      ...post,
      id: existingPost.id,
      createdAt: existingPost.createdAt,
    }

    if (post.slug && post.slug !== slug) {
      await deletePost(slug)

      const newKey = `post:${post.slug}`
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/${encodeURIComponent(newKey)}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPost),
        },
      )

      if (!response.ok) {
        throw new Error(`Failed to update post: ${response.statusText}`)
      }
    } else {
      const key = `post:${slug}`
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/${encodeURIComponent(key)}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPost),
        },
      )

      if (!response.ok) {
        throw new Error(`Failed to update post: ${response.statusText}`)
      }
    }

    return updatedPost
  } catch (error) {
    console.error("Error updating post in Cloudflare KV:", error)
    throw error
  }
}

export async function deletePost(slug: string): Promise<void> {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN

  if (!apiToken) {
    throw new Error("CLOUDFLARE_API_TOKEN is not set")
  }

  try {
    const key = `post:${slug}`
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/${encodeURIComponent(key)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to delete post: ${response.statusText}`)
    }
  } catch (error) {
    console.error("Error deleting post from Cloudflare KV:", error)
    throw error
  }
}

import { Header } from "@/components/header"
import { ContentSection } from "@/components/content-section"
import { Footer } from "@/components/footer"
import { getAllPosts, type Post } from "@/lib/cloudflare-kv"
import fs from "fs"
import path from "path"
import { getImageUrl } from "@/lib/image-utils"

export default async function Home() {
  let allPosts: Post[] = []

  try {
    allPosts = await getAllPosts()
  } catch (err) {
    console.error("[v0] Error fetching posts for niitlel page:", err)
    allPosts = []
  }

  // If KV returned nothing (or token missing), attempt local fallback to
  // `data/posts.json` so static builds succeed in Pages without secrets.
  if (!allPosts || allPosts.length === 0) {
    try {
      const fallbackPath = path.resolve(process.cwd(), "data/posts.json")
      if (fs.existsSync(fallbackPath)) {
        const raw = fs.readFileSync(fallbackPath, "utf-8")
        const localPosts = JSON.parse(raw) as Array<any>
        allPosts = localPosts.map((p, i) => ({
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

        console.warn("[v0] Using local posts.json fallback for niitlel page")
      }
    } catch (err) {
      console.warn("[v0] Failed to read local posts.json fallback for niitlel page:", err)
    }
  }

  const posts = allPosts.filter((post) => post.published === true)

  const featuredPost = posts.find((post) => post.featured) || posts[0] || null
  const heroImageUrl = featuredPost ? getImageUrl(featuredPost.image) : null

  return (
    <div className="min-h-screen flex flex-col">
      {heroImageUrl && <link rel="preload" as="image" href={heroImageUrl} fetchPriority="high" />}
      <Header />
      <main className="flex-1">
        <ContentSection posts={posts} />
      </main>
      <Footer />
    </div>
  )
}

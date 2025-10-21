import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArticleCard } from "@/components/article-card"
import { getAllPosts, type Post } from "@/lib/cloudflare-kv"
import fs from "fs"
import path from "path"

const getCategoryColor = (category: string) => "bg-blue-100 text-blue-700"

export default async function SainMedeePage() {
  let allPosts: Post[] = []

  try {
    allPosts = await getAllPosts()
  } catch (err) {
    console.error("[v0] Error fetching posts for SainMedee page:", err)
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

        console.warn("[v0] Using local posts.json fallback for SainMedee page")
      }
    } catch (err) {
      console.warn("[v0] Failed to read local posts.json fallback for SainMedee page:", err)
    }
  }

  const posts = allPosts.filter((post) => post.category === "Сайн мэдээ")

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4 text-center">Сайн мэдээ</h1>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Есүс Христийн сайн мэдээний тухай нийтлэлүүд
          </p>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <ArticleCard
                  key={post.id}
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  date={post.date}
                  category={post.category}
                  categoryColor={getCategoryColor(post.category)}
                  image={post.image}
                  number=""
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">Нийтлэл олдсонгүй.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

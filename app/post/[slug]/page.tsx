import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getPostBySlug, getAllPosts, type Post } from "@/lib/cloudflare-kv"
import { notFound } from "next/navigation"
import { getImageUrl } from "@/lib/image-utils"

export const dynamicParams = false

export async function generateStaticParams() {
  try {
    console.log("[v0] Starting generateStaticParams...")
    const posts = await getAllPosts()
    console.log(`[v0] Fetched ${posts?.length || 0} posts from KV`)

    if (!posts || posts.length === 0) {
      console.error("[v0] No posts found!")
      return []
    }

    const params = posts.map((post) => ({
      slug: post.slug,
    }))

    console.log(`[v0] Generated params:`, params)
    return params
  } catch (error) {
    console.error("❌ Error in generateStaticParams:", error)
    return []
  }
}

const getCategoryColor = (category: string) => {
  const colorMap: Record<string, string> = {
    "Сайн мэдээ": "bg-blue-100 text-blue-700",
    Advent: "bg-purple-100 text-purple-700",
    "Сургаалт зүйрлэлүүд": "bg-pink-100 text-pink-700",
    "Үхэл ба амилал": "bg-orange-100 text-orange-700",
    "Мөнх үүлийн өвлөөт": "bg-amber-100 text-amber-700",
    "Таван тухай": "bg-red-100 text-red-700",
  }
  return colorMap[category] || "bg-gray-100 text-gray-700"
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  let article: Post | null = null
  let relatedPosts: Post[] = []

  try {
    const { slug } = await params
    const decodedSlug = decodeURIComponent(slug)
    article = await getPostBySlug(decodedSlug)

    if (!article) {
      notFound()
    }

    const allPosts = await getAllPosts()
    relatedPosts = allPosts.filter((p) => p.category === article!.category && p.slug !== article!.slug).slice(0, 2)
  } catch (error) {
    console.error("Error loading post:", error)
    // If there's an API error (like missing token), show error page
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Алдаа гарлаа</h1>
            <p className="text-muted-foreground mb-8">Нийтлэлийг ачаалахад алдаа гарлаа. Та дахин оролдоно уу.</p>
            <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Нүүр хуудас руу буцах
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <article className="container mx-auto px-4 py-12 max-w-4xl">
          {article && (
            <>
              <Badge className={`${getCategoryColor(article.category)} mb-4`}>{article.category}</Badge>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">{article.title}</h1>

              <div className="flex items-center gap-4 text-muted-foreground mb-8">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time>{article.date}</time>
                </div>
              </div>

              <hr className="mb-8 border-border" />

              <div className="relative mb-8 rounded-lg overflow-hidden aspect-video">
                <img
                  src={getImageUrl(article.image) || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                {article.content.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="mb-6 leading-relaxed text-foreground/90">
                    {paragraph}
                  </p>
                ))}
              </div>

              {relatedPosts.length > 0 && (
                <div className="mt-16 pt-8 border-t">
                  <h2 className="text-2xl font-bold mb-6">Холбоотой нийтлэлүүд</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.slug}
                        href={`/post/${relatedPost.slug}`}
                        className="group block bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="relative aspect-video overflow-hidden">
                          <img
                            src={getImageUrl(relatedPost.image) || "/placeholder.svg"}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <Badge className={`${getCategoryColor(relatedPost.category)} mb-2 text-xs`}>
                            {relatedPost.category}
                          </Badge>
                          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                            {relatedPost.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{relatedPost.excerpt}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </article>
      </main>

      <Footer />
    </div>
  )
}

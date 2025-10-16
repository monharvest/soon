import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getPostBySlug, getAllPosts, type Post } from "@/lib/cloudflare-kv"
import { notFound } from "next/navigation"
import { getImageUrl } from "@/lib/image-utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export async function generateStaticParams() {
  try {
    console.log("[v0] Starting generateStaticParams...")
    console.log("[v0] CLOUDFLARE_API_TOKEN exists:", !!process.env.CLOUDFLARE_API_TOKEN)
    console.log("[v0] R2_PUBLIC_URL:", process.env.NEXT_PUBLIC_R2_PUBLIC_URL)

    if (!process.env.CLOUDFLARE_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN === "YOUR_CLOUDFLARE_API_TOKEN_HERE") {
      console.warn("[v0] CLOUDFLARE_API_TOKEN not available during build")
      console.warn("[v0] Please ensure environment variables are set in your deployment settings")
      // Return empty array - this will cause build to fail with a clear error
      // User needs to set up environment variables before building
      return []
    }

    const posts = await getAllPosts()
    console.log(`[v0] Fetched ${posts?.length || 0} posts from KV`)

    if (!posts || posts.length === 0) {
      console.warn("[v0] No posts found in Cloudflare KV during build")
      console.warn("[v0] Make sure posts are added to your KV store before building")
      return []
    }

    const params = posts.map((post) => ({
      slug: post.slug,
    }))

    console.log(`[v0] Generated ${params.length} static params:`, params.map((p) => p.slug).join(", "))
    return params
  } catch (error) {
    console.error("[v0] Error in generateStaticParams:", error)
    console.error("[v0] Stack:", error instanceof Error ? error.stack : "No stack trace")
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

export default async function PostPage({ params }: { params: { slug: string } }) {
  let article: Post | null = null
  let relatedPosts: Post[] = []

  try {
    const { slug } = params
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
                  loading="eager"
                  fetchPriority="high"
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="prose-custom max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => <h1 className="text-4xl font-bold mt-8 mb-4 text-foreground">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-2xl font-bold mt-6 mb-3 text-foreground">{children}</h3>,
                    h4: ({ children }) => <h4 className="text-xl font-bold mt-6 mb-3 text-foreground">{children}</h4>,
                    p: ({ children }) => <p className="mb-6 leading-relaxed text-lg text-foreground/90">{children}</p>,
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-6 space-y-2 text-lg text-foreground/90">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-6 space-y-2 text-lg text-foreground/90">{children}</ol>
                    ),
                    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary pl-4 py-2 my-6 italic text-foreground/80 bg-muted/30 rounded-r">
                        {children}
                      </blockquote>
                    ),
                    code: ({ inline, children, ...props }: any) =>
                      inline ? (
                        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary" {...props}>
                          {children}
                        </code>
                      ) : (
                        <code
                          className="block bg-muted p-4 rounded-lg my-6 overflow-x-auto text-sm font-mono text-foreground"
                          {...props}
                        >
                          {children}
                        </code>
                      ),
                    pre: ({ children }) => <pre className="my-6">{children}</pre>,
                    a: ({ children, href }) => (
                      <a
                        href={href}
                        className="text-primary hover:underline font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                    em: ({ children }) => <em className="italic">{children}</em>,
                    hr: () => <hr className="my-8 border-border" />,
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-6">
                        <table className="min-w-full border-collapse border border-border">{children}</table>
                      </div>
                    ),
                    thead: ({ children }) => <thead className="bg-muted">{children}</thead>,
                    tbody: ({ children }) => <tbody>{children}</tbody>,
                    tr: ({ children }) => <tr className="border-b border-border">{children}</tr>,
                    th: ({ children }) => (
                      <th className="px-4 py-2 text-left font-bold text-foreground border border-border">{children}</th>
                    ),
                    td: ({ children }) => (
                      <td className="px-4 py-2 text-foreground/90 border border-border">{children}</td>
                    ),
                  }}
                >
                  {article.content}
                </ReactMarkdown>
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
                            loading="lazy"
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
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

import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getPostBySlug, getAllPosts, type Post } from "@/lib/cloudflare-kv"
import fs from "fs"
import path from "path"
import { notFound } from "next/navigation"
import { getImageUrl, getResponsiveImage } from "@/lib/image-utils"
import ReactMarkdown, { Components } from "react-markdown"
import remarkGfm from "remark-gfm"

export async function generateStaticParams() {
  try {
    console.log("[v0] Starting generateStaticParams...")
    console.log("[v0] CLOUDFLARE_API_TOKEN exists:", !!process.env.CLOUDFLARE_API_TOKEN)
    console.log("[v0] R2_PUBLIC_URL:", process.env.NEXT_PUBLIC_R2_PUBLIC_URL)

    if (!process.env.CLOUDFLARE_API_TOKEN || process.env.CLOUDFLARE_API_TOKEN === "YOUR_CLOUDFLARE_API_TOKEN_HERE") {
      console.warn("[v0] CLOUDFLARE_API_TOKEN not available during build")
      console.warn("[v0] Attempting local fallback: data/posts.json")

      // Try a local fallback so `next build` / `next export` can succeed in environments
      // where the Cloudflare API token isn't available (useful for local/offline builds).
      try {
        const fallbackPath = path.resolve(process.cwd(), "data/posts.json")
        if (fs.existsSync(fallbackPath)) {
          const json = fs.readFileSync(fallbackPath, "utf8")
          const localPosts: Array<{ slug: string }> = JSON.parse(json)
          const params = localPosts.map((p) => ({ slug: encodeURIComponent(p.slug) }))
          console.warn("[v0] Using local posts.json fallback for generateStaticParams()")
          console.log(`[v0] Generated ${params.length} static params (local):`, params.map((p) => p.slug).join(", "))
          return params
        }
      } catch (err) {
        console.error("[v0] Error reading local posts.json fallback:", err)
      }

      // No fallback available: throw a descriptive error so the build fails loudly instead
      // of returning an empty array which leads to the confusing "missing param" runtime error.
      throw new Error(
        "CLOUDFLARE_API_TOKEN is not set during build and no data/posts.json fallback was found. Please set CLOUDFLARE_API_TOKEN or provide data/posts.json with posts to allow static export.",
      )
    }

    const posts = await getAllPosts()
    console.log(`[v0] Fetched ${posts?.length || 0} posts from KV`)

    if (!posts || posts.length === 0) {
      console.warn("[v0] No posts found in Cloudflare KV during build")
      console.warn("[v0] Make sure posts are added to your KV store before building")
      return []
    }

    // Create a deduplicated set containing both decoded and encoded slug variants.
    // Some clients/requests arrive percent-encoded while others use raw Unicode paths.
    const slugSet = new Set<string>()
    for (const post of posts) {
      try {
        const decoded = decodeURIComponent(post.slug)
        slugSet.add(decoded)
        slugSet.add(encodeURIComponent(decoded))
      } catch (e) {
        // If decodeURIComponent fails, fall back to raw + encoded
        slugSet.add(post.slug)
        try {
          slugSet.add(encodeURIComponent(post.slug))
        } catch {}
      }
    }

    const params = Array.from(slugSet).map((slug) => ({ slug }))

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
  "Мөнх үүлийн өвлөөт": "bg-amber-700 text-white",
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
                {(() => {
                  const base = getImageUrl(article.image) || "/placeholder.svg"
                  // Build responsive attributes capped at 600px for hero LCP
                  const img = getResponsiveImage(article.image, [360, 600], "(max-width:600px) 100vw, 600px")
                  // Ensure primary src is the 600px variant so the browser decodes the right size
                  let primarySrc = img.src
                  try {
                    const u = new URL(img.src)
                    u.searchParams.set('w', '600')
                    primarySrc = u.toString()
                  } catch (e) {
                    // fallback to base
                    primarySrc = base
                  }

                  return (
                    <img
                      src={primarySrc}
                      srcSet={img.srcSet}
                      sizes={img.sizes}
                      alt={article.title}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="object-cover w-full h-full"
                    />
                  )
                })()}
              </div>

              <div className="prose-custom max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: (props: any) => <h1 className="text-4xl font-bold mt-8 mb-4 text-foreground">{props.children}</h1>,
                    h2: (props: any) => <h2 className="text-3xl font-bold mt-8 mb-4 text-foreground">{props.children}</h2>,
                    h3: (props: any) => <h3 className="text-2xl font-bold mt-6 mb-3 text-foreground">{props.children}</h3>,
                    h4: (props: any) => <h4 className="text-xl font-bold mt-6 mb-3 text-foreground">{props.children}</h4>,
                    p: (props: any) => <p className="mb-6 leading-relaxed text-lg text-foreground/90">{props.children}</p>,
                    ul: (props: any) => (
                      <ul className="list-disc list-inside mb-6 space-y-2 text-lg text-foreground/90">{props.children}</ul>
                    ),
                    ol: (props: any) => (
                      <ol className="list-decimal list-inside mb-6 space-y-2 text-lg text-foreground/90">{props.children}</ol>
                    ),
                    li: (props: any) => <li className="leading-relaxed">{props.children}</li>,
                    blockquote: (props: any) => (
                      <blockquote className="border-l-4 border-primary pl-4 py-2 my-6 italic text-foreground/80 bg-muted/30 rounded-r">
                        {props.children}
                      </blockquote>
                    ),
                    code: (props: any) => {
                      const { inline, ...rest } = props || {}
                      return inline ? (
                        <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary" {...rest}>
                          {props.children}
                        </code>
                      ) : (
                        <code
                          className="block bg-muted p-4 rounded-lg my-6 overflow-x-auto text-sm font-mono text-foreground"
                          {...rest}
                        >
                          {props.children}
                        </code>
                      )
                    },
                    pre: (props: any) => <pre className="my-6">{props.children}</pre>,
                    a: (props: any) => (
                      <a
                        href={props.href}
                        className="text-primary hover:underline font-medium"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {props.children}
                      </a>
                    ),
                    strong: (props: any) => <strong className="font-bold text-foreground">{props.children}</strong>,
                    em: (props: any) => <em className="italic">{props.children}</em>,
                    hr: (props: any) => <hr className="my-8 border-border" />,
                    table: (props: any) => (
                      <div className="overflow-x-auto my-6">
                        <table className="min-w-full border-collapse border border-border">{props.children}</table>
                      </div>
                    ),
                    thead: (props: any) => <thead className="bg-muted">{props.children}</thead>,
                    tbody: (props: any) => <tbody>{props.children}</tbody>,
                    tr: (props: any) => <tr className="border-b border-border">{props.children}</tr>,
                    th: (props: any) => (
                      <th className="px-4 py-2 text-left font-bold text-foreground border border-border">{props.children}</th>
                    ),
                    td: (props: any) => (
                      <td className="px-4 py-2 text-foreground/90 border border-border">{props.children}</td>
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

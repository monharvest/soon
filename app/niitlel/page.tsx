import { Header } from "@/components/header"
import { ArticleTabs } from "@/components/article-tabs"
import { ArticlesGrid } from "@/components/articles-grid"
import { Footer } from "@/components/footer"
import { getAllPosts } from "@/lib/cloudflare-kv"

export default async function NiitlelPage() {
  const posts = await getAllPosts()

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8 text-center">Нийтлэлүүд</h1>
          <ArticleTabs />
          <ArticlesGrid posts={posts} />
        </div>
      </main>
      <Footer />
    </div>
  )
}

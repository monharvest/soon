import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArticleCard } from "@/components/article-card"
import { getAllPosts } from "@/lib/cloudflare-kv"

const getCategoryColor = (category: string) => "bg-blue-100 text-blue-700"

export default async function SainMedeePage() {
  const allPosts = await getAllPosts()
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
                  key={post.slug}
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

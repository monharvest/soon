import { Header } from "@/components/header"
import { ContentSection } from "@/components/content-section"
import { Footer } from "@/components/footer"
import { getAllPosts } from "@/lib/cloudflare-kv"

export default async function Home() {
  const allPosts = await getAllPosts()
  const posts = allPosts.filter((post) => post.published === true)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ContentSection posts={posts} />
      </main>
      <Footer />
    </div>
  )
}

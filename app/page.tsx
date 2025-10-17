import { Header } from "@/components/header"
import { ContentSection } from "@/components/content-section"
import { Footer } from "@/components/footer"
import { getAllPosts } from "@/lib/cloudflare-kv"
import { getImageUrl } from "@/lib/image-utils"

export default async function Home() {
  const allPosts = await getAllPosts()
  const posts = allPosts.filter((post) => post.published === true)

  const featuredPost = posts.find((post) => post.featured) || posts[0]
  const heroImageUrl = featuredPost ? getImageUrl(featuredPost.image) : null

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

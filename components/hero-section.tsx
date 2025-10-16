import Link from "next/link"
import type { Post } from "@/lib/cloudflare-kv"
import { getImageUrl } from "@/lib/image-utils"

interface HeroSectionProps {
  posts: Post[]
}

const truncateExcerpt = (text: string, wordCount = 20) => {
  const words = text.split(" ")
  if (words.length <= wordCount) return text
  return words.slice(0, wordCount).join(" ") + "..."
}

export function HeroSection({ posts }: HeroSectionProps) {
  const featuredPost = posts.find((post) => post.featured) || posts[0]

  if (!featuredPost) {
    return null
  }

  return (
    <section className="bg-[#1e293b] text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          <Link href={`/post/${featuredPost.slug}`} className="block">
            <div className="relative rounded-2xl overflow-hidden aspect-video hover:opacity-90 transition-opacity">
              <img
                src={getImageUrl(featuredPost.image) || "/placeholder.svg"}
                alt={featuredPost.title}
                loading="eager"
                fetchPriority="high"
                className="object-cover w-full h-full"
              />
            </div>
          </Link>

          <div>
            <Link href={`/post/${featuredPost.slug}`}>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-balance hover:text-blue-300 transition-colors">
                {featuredPost.title}
              </h1>
            </Link>
            <p className="text-gray-300 leading-relaxed mb-6">{truncateExcerpt(featuredPost.excerpt, 20)}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-400">{featuredPost.date}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

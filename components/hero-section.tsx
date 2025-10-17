import Link from "next/link"
import type { Post } from "@/lib/cloudflare-kv"

interface HeroSectionProps {
  posts: Post[]
}

const truncateExcerpt = (text: string, wordCount = 20) => {
  const words = text.split(" ")
  if (words.length <= wordCount) return text
  return words.slice(0, wordCount).join(" ") + "..."
}

const getCategoryColor = (category: string) => {
  const colorMap: Record<string, string> = {
    "Сайн мэдээ": "bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 text-yellow-900",
    Advent: "bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 text-white",
    "Сургаалт зүйрлэлүүд": "bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 text-white",
    "Үхэл ба амилал": "bg-gradient-to-br from-red-600 via-red-700 to-rose-700 text-white",
    "Мөнх үгийн ойлголт": "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white",
    "Тамын тухай": "bg-gradient-to-br from-gray-600 via-gray-700 to-slate-700 text-gray-100",
  }
  return colorMap[category] || "bg-gradient-to-br from-gray-500 to-gray-600 text-white"
}

export function HeroSection({ posts }: HeroSectionProps) {
  const featuredPost = posts.find((post) => post.featured) || posts[0]

  if (!featuredPost) {
    return null
  }

  return (
    <section className="bg-[#1e293b] text-white py-16 relative overflow-hidden">
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
          <Link href={`/post/${featuredPost.slug}`} className="block group">
            <div
              className={`${getCategoryColor(featuredPost.category)} rounded-2xl p-12 shadow-xl hover:shadow-2xl transition-all duration-300 aspect-video flex flex-col justify-center group-hover:scale-[1.02] relative overflow-hidden`}
            >
              <div
                className="absolute inset-0 opacity-70 mix-blend-overlay"
                style={{
                  backgroundImage:
                    "url(https://soon.udaxgui.com/posts/images/light.avif)",
                  backgroundSize: "cover",
                  backgroundPosition: "left bottom",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-bl from-white/30 via-transparent to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="text-sm font-medium mb-4 uppercase tracking-wide opacity-90 drop-shadow-sm">
                  {featuredPost.category}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-balance drop-shadow-md">{featuredPost.title}</h1>
              </div>
            </div>
          </Link>

          <div>
            <p className="text-gray-300 leading-relaxed mb-6 text-lg">{truncateExcerpt(featuredPost.excerpt, 20)}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-400">{featuredPost.date}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

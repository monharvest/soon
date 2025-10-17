import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface ArticleCardProps {
  slug: string
  image: string
  badge?: string
  badgeColor?: string
  category: string
  categoryColor?: string
  title: string
  excerpt: string
  date: string
  number?: string
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

export function ArticleCard({
  slug,
  image,
  badge,
  badgeColor = "bg-white",
  category,
  categoryColor,
  title,
  excerpt,
  date,
  number,
}: ArticleCardProps) {
  return (
    <article className="bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
      <Link href={`/post/${slug}`} className="block">
        <div className={`${getCategoryColor(category)} p-8 relative overflow-hidden`}>
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
            <div className="text-sm font-medium mb-3 uppercase tracking-wide opacity-90 drop-shadow-sm">{category}</div>
            <h3 className="text-2xl font-bold text-balance drop-shadow-md">{title}</h3>
          </div>
          {number && (
            <div className="absolute bottom-4 right-4 text-5xl font-bold opacity-20 drop-shadow-lg">{number}</div>
          )}
        </div>
      </Link>
      <div className="p-6">
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">{excerpt}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{date}</span>
          <Link
            href={`/post/${slug}`}
            className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            Унших <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}

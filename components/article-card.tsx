import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { getImageUrl } from "@/lib/image-utils"

interface ArticleCardProps {
  slug: string // Added slug prop
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

export function ArticleCard({
  slug, // Destructure slug
  image,
  badge,
  badgeColor = "bg-white",
  category,
  categoryColor = "bg-blue-100 text-blue-700",
  title,
  excerpt,
  date,
  number,
}: ArticleCardProps) {
  return (
    <article className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link href={`/post/${slug}`} className="block">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={getImageUrl(image) || "/placeholder.svg"}
            alt={title}
            loading="lazy"
            className="object-cover w-full h-full"
          />
          {number && <div className="absolute bottom-4 right-4 text-5xl font-bold text-white opacity-90">{number}</div>}
          {badge && (
            <div className={`absolute top-4 left-4 ${badgeColor} px-4 py-2 rounded-lg font-bold text-2xl`}>{badge}</div>
          )}
        </div>
      </Link>
      <div className="p-6">
        <Badge className={`${categoryColor} mb-3`}>{category}</Badge>
        <Link href={`/post/${slug}`}>
          <h3 className="text-xl font-bold mb-3 text-balance hover:text-primary transition-colors">{title}</h3>
        </Link>
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

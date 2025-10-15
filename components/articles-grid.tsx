"use client"

import { ArticleCard } from "./article-card"
import type { Post } from "@/lib/cloudflare-kv"
import { useState, useEffect } from "react"

interface ArticlesGridProps {
  posts: Post[]
  selectedCategory?: string
}

const getCategoryColor = (category: string) => {
  const colorMap: Record<string, string> = {
    "Сайн мэдээ": "bg-blue-100 text-blue-700",
    Advent: "bg-purple-100 text-purple-700",
    "Сургаалт зүйрлэлүүд": "bg-pink-100 text-pink-700",
    "Үхэл ба амилал": "bg-orange-100 text-orange-700",
    "Мөнх үгийн ойлголт": "bg-amber-100 text-amber-700",
    "Тамын тухай": "bg-red-100 text-red-700",
  }
  return colorMap[category] || "bg-gray-100 text-gray-700"
}

export function ArticlesGrid({ posts, selectedCategory }: ArticlesGridProps) {
  const [activeCategory, setActiveCategory] = useState(selectedCategory || "Бүгд")

  useEffect(() => {
    const handleCategoryChange = (event: CustomEvent) => {
      setActiveCategory(event.detail)
    }

    window.addEventListener("categoryChange" as any, handleCategoryChange)

    return () => {
      window.removeEventListener("categoryChange" as any, handleCategoryChange)
    }
  }, [])

  const filteredPosts = activeCategory === "Бүгд" ? posts : posts.filter((post) => post.category === activeCategory)

  const articles = filteredPosts.map((post) => ({
    slug: post.slug,
    image: post.image,
    category: post.category,
    categoryColor: getCategoryColor(post.category),
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    number: "",
    content: post.content,
  }))

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">{activeCategory !== "Бүгд" ? activeCategory : "Нийтлэлүүд"}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <ArticleCard key={index} {...article} />
          ))}
        </div>
        {articles.length === 0 && (
          <p className="text-center text-muted-foreground py-12">Энэ ангилалд нийтлэл байхгүй байна.</p>
        )}
      </div>
    </section>
  )
}

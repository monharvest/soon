"use client"

import { useState, useEffect } from "react"
import { HeroSection } from "./hero-section"
import { ArticlesGrid } from "./articles-grid"
import { ArticleTabs } from "./article-tabs"
import { useIsMobile } from "@/hooks/use-mobile"
import type { Post } from "@/lib/cloudflare-kv"

interface ContentSectionProps {
  posts: Post[]
}

export function ContentSection({ posts }: ContentSectionProps) {
  const [activeCategory, setActiveCategory] = useState("Бүгд")
  const isMobile = useIsMobile()

  useEffect(() => {
    const handleCategoryChange = (event: CustomEvent<{ category: string }>) => {
      console.log("[v0] ContentSection received category change:", event.detail.category)
      setActiveCategory(event.detail.category)
    }

    window.addEventListener("categoryChange" as any, handleCategoryChange)

    return () => {
      window.removeEventListener("categoryChange" as any, handleCategoryChange)
    }
  }, [])

  const shouldShowHero = !isMobile || activeCategory === "Бүгд"

  return (
    <>
      {shouldShowHero && <HeroSection posts={posts} />}
      <div className="hidden md:block md:sticky md:top-0 md:z-20 md:bg-background md:border-b">
        <ArticleTabs />
      </div>
      <ArticlesGrid posts={posts} />
    </>
  )
}

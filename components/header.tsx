"use client"

import type React from "react"
import { Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ToggleTheme } from "@/components/toggle-theme"
import Link from "next/link"
import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"

const categories = [
  "Бүгд",
  "Сайн мэдээ",
  "Advent",
  "Сургаалт зүйрлэлүүд",
  "Үхэл ба амилал",
  "Мөнх үгийн ойлголт",
  "Тамын тухай",
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleCategoryClick = (category: string) => {
    console.log("[v0] Category clicked:", category)

    if (pathname?.startsWith("/post/")) {
      router.push("/")
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("categoryChange", { detail: category }))
      }, 100)
    } else {
      window.dispatchEvent(new CustomEvent("categoryChange", { detail: category }))
    }

    console.log("[v0] Event dispatched, closing menu")
    setMobileMenuOpen(false)
  }

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    handleCategoryClick("Бүгд")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <header className="border-b border-border bg-background sticky top-0 z-30 md:relative md:z-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-semibold hover:text-primary transition-colors"
            onClick={(e) => {
              if (window.innerWidth < 768) {
                handleLogoClick(e)
              }
            }}
          >
            Udaxgui.com
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm hover:text-primary transition-colors">
              Нүүр
            </Link>
            <Link href="/niitlel" className="text-sm hover:text-primary transition-colors">
              Нийтлэлүүд
            </Link>
            <Link href="/sain-medee" className="text-sm hover:text-primary transition-colors">
              Сайн мэдээ
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Хайх..." className="pl-9 w-64 bg-muted/50" />
            </div>
            <ToggleTheme />
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            style={{ touchAction: "auto" }}
          />

          <div className="fixed top-0 right-0 bottom-0 w-[280px] bg-background border-l border-border z-50 md:hidden overflow-hidden">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <span className="font-semibold">Цэс</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-4 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input type="search" placeholder="Хайх..." className="pl-9 bg-muted/50" />
                </div>
              </div>

              <nav className="flex flex-col p-4 gap-2 overflow-y-auto flex-1">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant="ghost"
                    className="justify-start px-4 py-6 h-auto text-base"
                    onClick={() => handleCategoryClick(category)}
                    style={{ touchAction: "manipulation" }}
                  >
                    {category}
                  </Button>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  )
}

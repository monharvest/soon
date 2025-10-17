"use client"

import { Button } from "@/components/ui/button"

const tabs = [
  "Бүгд",
  "Сайн мэдээ",
  "Advent",
  "Сургаалт зүйрлэлүүд",
  "Үхэл ба амилал",
  "Мөнх үгийн ойлголт",
  "Тамын тухай",
]

export function ArticleTabs() {
  const handleTabChange = (tab: string) => {
    window.dispatchEvent(new CustomEvent("categoryChange", { detail: tab }))
  }

  return (
    <div className="border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-4 py-6">
          {tabs.map((tab) => (
            <Button
              key={tab}
              variant="ghost"
              className="rounded-full px-6 py-2 hover:bg-[#1e293b] hover:text-white dark:hover:bg-primary dark:hover:text-primary-foreground border border-border"
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

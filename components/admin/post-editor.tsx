"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save } from "lucide-react"
import ImageUploader from "./image-uploader"

interface PostEditorProps {
  slug?: string
}

interface PostData {
  id?: string
  title: string
  excerpt: string
  content: string
  category: string
  slug: string
  image: string
  published: boolean
  featured: boolean
  metaDescription: string
}

const categories = [
  "Бүгд",
  "Сайн мэдээ",
  "Advent",
  "Сургаалт зүйрлэлүүд",
  "Үхэл ба амилал",
  "Мөнх үгийн ойлголт",
  "Тамын тухай",
]

export default function PostEditor({ slug }: PostEditorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState<PostData>({
    title: "",
    excerpt: "",
    content: "",
    category: "Сайн мэдээ",
    slug: "",
    image: "",
    published: true,
    featured: false,
    metaDescription: "",
  })

  useEffect(() => {
    if (slug) {
      loadPost()
    }
  }, [slug])

  const loadPost = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/posts/${slug}`)
      if (response.ok) {
        const post = await response.json()
        setFormData({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          slug: post.slug,
          image: post.image,
          published: post.published,
          featured: post.featured,
          metaDescription: post.metaDescription || "",
        })
      } else {
        setError("Post not found")
      }
    } catch (err) {
      setError("Failed to load post")
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: slug ? prev.slug : generateSlug(title),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const url = slug ? `/api/admin/posts/${slug}` : "/api/admin/posts"
      const method = slug ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/admin")
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to save post")
      }
    } catch (err) {
      setError("Failed to save post")
    } finally {
      setSaving(false)
    }
  }

  const handleImageUploaded = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground font-sans">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="font-sans">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-2xl font-serif font-bold">{slug ? "Edit Post" : "New Post"}</h1>
          </div>
          <Button onClick={handleSubmit} disabled={saving} className="font-sans">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 dark:bg-red-950/20">
            <CardContent className="pt-6">
              <p className="text-red-600 dark:text-red-400 font-sans">{error}</p>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="font-sans">
                  Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  className="font-sans"
                  placeholder="Post title"
                />
              </div>

              <div>
                <Label htmlFor="slug" className="font-sans">
                  Slug (URL)
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  className="font-sans"
                  placeholder="post-slug"
                />
              </div>

              <div>
                <Label htmlFor="category" className="font-sans">
                  Category
                </Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background font-sans"
                  required
                >
                  {categories
                    .filter((cat) => cat !== "Бүгд")
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <Label htmlFor="excerpt" className="font-sans">
                  Excerpt
                </Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  required
                  className="font-sans min-h-[80px]"
                  placeholder="Brief description of the post"
                />
              </div>

              <div>
                <Label htmlFor="metaDescription" className="font-sans">
                  Meta Description (SEO)
                </Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  className="font-sans min-h-[60px]"
                  placeholder="Description for search engines"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader currentImage={formData.image} onImageUploaded={handleImageUploaded} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                className="font-sans min-h-[400px]"
                placeholder="Full post content"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="published" className="font-sans">
                    Published
                  </Label>
                  <p className="text-sm text-muted-foreground font-sans">Make this post visible on the site</p>
                </div>
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="featured" className="font-sans">
                    Featured
                  </Label>
                  <p className="text-sm text-muted-foreground font-sans">Show on homepage hero section</p>
                </div>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}

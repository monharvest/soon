"use client"

import { useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Plus, LogOut } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Post {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  slug: string
  published: boolean
  featured: boolean
}

export default function AdminDashboard() {
  const router = useRouter()
  const { data: posts, error, isLoading, mutate } = useSWR<Post[]>("/api/posts", fetcher)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  const handleDelete = async (id: string, slug: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    setDeletingId(id)
    try {
      const response = await fetch(`/api/admin/posts/${slug}`, {
        method: "DELETE",
      })

      if (response.ok) {
        mutate()
      } else {
        alert("Failed to delete post")
      }
    } catch (error) {
      alert("Failed to delete post")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-serif font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link href="/admin/posts/new">
              <Button className="font-sans">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout} className="font-sans bg-transparent">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading && <p className="text-center text-muted-foreground font-sans">Loading...</p>}

        {error && (
          <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
            <CardContent className="pt-6">
              <p className="text-red-600 dark:text-red-400 font-sans">Failed to load posts</p>
            </CardContent>
          </Card>
        )}

        {posts && posts.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground font-sans mb-4">No posts yet</p>
              <Link href="/admin/posts/new">
                <Button className="font-sans">
                  <Plus className="w-4 h-4 mr-2" />
                  Create your first post
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {posts && posts.length > 0 && (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="font-sans">
                          {post.category}
                        </Badge>
                        {post.featured && (
                          <Badge variant="default" className="font-sans">
                            Featured
                          </Badge>
                        )}
                        {!post.published && (
                          <Badge variant="outline" className="font-sans">
                            Draft
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="font-serif">{post.title}</CardTitle>
                      <CardDescription className="font-sans mt-2">{post.excerpt}</CardDescription>
                      <p className="text-sm text-muted-foreground font-sans mt-2">{post.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/posts/${post.slug}`}>
                        <Button variant="outline" size="sm" className="font-sans bg-transparent">
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(post.id, post.slug)}
                        disabled={deletingId === post.id}
                        className="font-sans text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

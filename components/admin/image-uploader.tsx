"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { getImageUrl } from "@/lib/image-utils"
import Image from "next/image"

interface ImageUploaderProps {
  currentImage: string
  onImageUploaded: (imageUrl: string) => void
}

export default function ImageUploader({ currentImage, onImageUploaded }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [manualUrl, setManualUrl] = useState(currentImage)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError("")

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        onImageUploaded(data.path)
        setManualUrl(data.path)
      } else {
        const data = await response.json()
        setError(data.error || "Failed to upload image")
      }
    } catch (err) {
      setError("Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const handleManualUrlSubmit = () => {
    if (manualUrl) {
      onImageUploaded(manualUrl)
    }
  }

  const handleRemove = () => {
    onImageUploaded("")
    setManualUrl("")
  }

  return (
    <div className="space-y-4">
      {currentImage && (
        <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border">
          <Image
            src={getImageUrl(currentImage) || "/placeholder.svg"}
            alt="Current image"
            fill
            className="object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div>
        <Label htmlFor="file-upload" className="font-sans">
          Upload Image
        </Label>
        <div className="flex items-center gap-2 mt-2">
          <Input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="font-sans"
          />
          {uploading && <span className="text-sm text-muted-foreground font-sans">Uploading...</span>}
        </div>
      </div>

      <div>
        <Label htmlFor="manual-url" className="font-sans">
          Or enter image URL
        </Label>
        <div className="flex items-center gap-2 mt-2">
          <Input
            id="manual-url"
            type="text"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="/images/example.webp"
            className="font-sans"
          />
          <Button type="button" onClick={handleManualUrlSubmit} variant="outline" className="font-sans bg-transparent">
            Use
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-red-500 font-sans">{error}</p>}
    </div>
  )
}

/**
 * Constructs the full image URL from R2 storage
 * @param imagePath - The image path from KV (e.g., "/images/advnet3.webp")
 * @returns Full R2 URL or placeholder if path is invalid
 */
export function getImageUrl(imagePath: string | undefined): string {
  if (!imagePath) {
    return "/placeholder.svg"
  }

  const r2BaseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || ""

  // If the path already starts with http, return as-is
  if (imagePath.startsWith("http")) {
    return imagePath
  }

  // Remove leading slash if present to avoid double slashes
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath

  const finalUrl = r2BaseUrl ? `${r2BaseUrl}/${cleanPath}` : "/placeholder.svg"

  return finalUrl
}

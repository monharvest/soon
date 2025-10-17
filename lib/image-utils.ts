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

/**
 * Build responsive image attributes for a given image path.
 * Returns an object with src, srcSet and sizes suitable for <img> elements.
 */
export function getResponsiveImage(
  imagePath: string | undefined,
  widths: number[] = [400, 800, 1200, 1600],
  sizes = "(max-width: 768px) 100vw, 50vw",
) {
  const src = getImageUrl(imagePath)

  // If src is placeholder, return single src only
  if (!src || src === "/placeholder.svg") {
    return { src, srcSet: undefined, sizes: undefined }
  }

  // If the host supports width query param like ?w=, build srcset entries.
  // This assumes R2 is fronted by an image resizing service that accepts ?w=.
  try {
    const url = new URL(src)
    const srcSet = widths
      .map((w) => {
        const u = new URL(src)
        u.searchParams.set("w", String(w))
        return `${u.toString()} ${w}w`
      })
      .join(", ")

    return { src: url.toString(), srcSet, sizes }
  } catch (e) {
    return { src, srcSet: undefined, sizes: undefined }
  }
}

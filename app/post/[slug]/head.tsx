import React from 'react'
import { getImageUrl, getResponsiveImage } from '@/lib/image-utils'

export default function Head({ params }: { params: { slug: string } }) {
  // NOTE: This file runs on server; we can construct preload for the LCP image.
  try {
    // derive the post image url from slug - keep logic minimal here
    const slug = params?.slug || ''
    // We don't have access to the post object here, so as a safe default we won't emit preload
    // If you want per-post preload, move this head into the page and pass the article image.
    return null
  } catch (e) {
    return null
  }
}

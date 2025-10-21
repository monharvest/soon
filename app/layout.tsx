import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Udaxgui.com - Нийтлэл",
  description: "Mongolian blog and news website",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="mn" suppressHydrationWarning>
      <head>
        {/* Preconnect to R2 image host to reduce handshake time */}
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_R2_PUBLIC_URL || 'https://soon.udaxgui.com'} crossOrigin="anonymous" />
        {/* Preconnect to common font origins to speed up font loading (keeps total <=4) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.classList.toggle('dark', theme === 'dark');
              })();
            `,
          }}
        />
        {/* Minimal critical CSS: render hero area before full CSS loads to improve LCP */}
        <style dangerouslySetInnerHTML={{__html: `
          [data-hero] { min-height: 360px; display: block; }
          [data-hero] .container { padding-left: 16px; padding-right: 16px; }
          [data-hero] .rounded-2xl { border-radius: 16px; }
          [data-hero] .aspect-video { aspect-ratio: 16/9; }
        `}} />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {/* Wrap ThemeProvider with Suspense boundary */}
        <Suspense fallback={null}>
          <ThemeProvider>{children}</ThemeProvider>
        </Suspense>
      </body>
    </html>
  )
}

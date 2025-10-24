"use client"

import { Intro } from "@/components/blog/intro"
import { HeroPost } from "@/components/blog/hero-post"
import { MoreStories } from "@/components/blog/more-stories"
import { staticBlogData } from "@/lib/static-blog-data"
import { useEffect } from "react"

export default function Page() {
  useEffect(() => {
    // Set blog-specific color scheme
    if (typeof window !== 'undefined') {
      const root = document.documentElement
      
      // Set blog color scheme
      root.style.setProperty('--background', '#0f0f23')
      root.style.setProperty('--foreground', '#e2e8f0')
      root.style.setProperty('--primary', '#6366f1')
      root.style.setProperty('--primary-foreground', '#ffffff')
      root.style.setProperty('--border', '#334155')
      root.style.setProperty('--muted', '#1e293b')
      root.style.setProperty('--muted-foreground', '#94a3b8')
      root.style.setProperty('--accent', '#f59e0b')
      root.style.setProperty('--accent-foreground', '#ffffff')
      root.style.setProperty('--card', '#1e293b')
      root.style.setProperty('--card-foreground', '#e2e8f0')
    }
  }, [])
  const heroPost = staticBlogData.blog.posts.items[0]
  const morePosts = staticBlogData.blog.posts.items.slice(1)

  return (
    <main>
      <section className="mx-auto px-5 border-t border-border rounded-t-4xl">
        <section className="max-w-7xl mx-auto">
        <Intro />
        {heroPost && <HeroPost {...heroPost} />}
        <MoreStories morePosts={morePosts} title={staticBlogData.blog.morePosts} />
        </section>
      </section>
    </main>
  )
}

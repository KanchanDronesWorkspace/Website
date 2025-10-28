"use client"

import { Intro } from "@/components/blog/intro"
import { HeroPost } from "@/components/blog/hero-post"
import { MoreStories } from "@/components/blog/more-stories"
import { BlogService } from "@/lib/services/blog-service"
import { useEffect, useState } from "react"
import type { Blog } from "@/lib/types/blog-management"

export default function Page() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

    // Fetch blogs from database
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const blogsResponse = await BlogService.getPublishedBlogs(1, 10)
      setBlogs(blogsResponse.data)
    } catch (err: any) {
      console.error('Error fetching blogs:', err)
      setError('Failed to load blogs')
      // No fallback data - just show empty state
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main>
        <section className="mx-auto px-5 ">
          <section className="max-w-7xl mx-auto">
            <Intro />
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          </section>
        </section>
      </main>
    )
  }

  if (error && blogs.length === 0) {
    return (
      <main>
        <section className="mx-auto px-5 ">
          <section className="max-w-7xl mx-auto">
            <Intro />
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold text-foreground mb-4">Unable to Load Blogs</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <button
                onClick={fetchBlogs}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
              >
                Try Again
              </button>
            </div>
          </section>
        </section>
      </main>
    )
  }

  if (blogs.length === 0) {
    return (
      <main>
        <section className="mx-auto px-5 ">
          <section className="max-w-7xl mx-auto">
            <Intro />
            {/* Cool Empty State */}
            <div className="text-center py-20">
              <div className="max-w-2xl mx-auto">
                {/* Animated Drone Icon */}
                <div className="mb-8">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center animate-pulse">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full animate-bounce">
                      <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* Main Message */}
                <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  🚁 Ready for Takeoff!
                </h2>
                
                <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                  Our drone experts are preparing amazing content for you. 
                  <br />
                  <span className="text-primary font-semibold">Stay tuned for incredible aerial insights!</span>
                </p>
                
                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Latest Tech</h3>
                    <p className="text-sm text-muted-foreground">Cutting-edge drone innovations</p>
                  </div>
                  
                  <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Expert Insights</h3>
                    <p className="text-sm text-muted-foreground">Professional drone expertise</p>
                  </div>
                  
                  <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50 hover:border-primary/50 transition-all duration-300">
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">Industry News</h3>
                    <p className="text-sm text-muted-foreground">Latest drone industry updates</p>
                  </div>
                </div>
                
                {/* Call to Action */}
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-8 rounded-2xl border border-primary/20">
                  <h3 className="text-2xl font-bold text-foreground mb-4">🎯 What's Coming Next?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <span className="text-muted-foreground">Drone Technology Trends 2024</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                      <span className="text-muted-foreground">Aerial Photography Masterclass</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-muted-foreground">Commercial Drone Applications</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <span className="text-muted-foreground">Safety & Regulations Guide</span>
                    </div>
                  </div>
                </div>
                
                {/* Footer Message */}
                <div className="mt-8">
                  <p className="text-muted-foreground text-sm">
                    Follow us for updates and be the first to read our latest content!
                  </p>
                </div>
              </div>
            </div>
          </section>
        </section>
      </main>
    )
  }

  const heroPost = blogs[0]
  const morePosts = blogs.slice(1)

  return (
    <main>
      <section className="mx-auto px-5 ">
        <section className="max-w-7xl mx-auto">
        <Intro />
        {heroPost && <HeroPost {...heroPost} />}
          <MoreStories morePosts={morePosts} title="More Stories" />
        </section>
      </section>
    </main>
  )
}

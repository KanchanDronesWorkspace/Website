"use client"

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { BlogService } from '@/lib/services/blog-service'
import type { Blog } from '@/lib/types/blog-management'
import { applyBlogColorScheme } from '@/lib/utils/color-scheme'
import { toast } from 'sonner'

const parseMarkdown = (text: string): string => {
  if (!text) return ''
  
  const paragraphs = text.split(/\n\n+/)
  
  let html = paragraphs.map(paragraph => {
    if (!paragraph.trim()) return ''
    
    let parsed = paragraph
      .replace(/^### (.*)$/gim, '<h3 class="text-2xl font-bold text-foreground mt-8 mb-4">$1</h3>')
      .replace(/^## (.*)$/gim, '<h2 class="text-3xl font-bold text-foreground mt-10 mb-6">$1</h2>')
      .replace(/^# (.*)$/gim, '<h1 class="text-4xl font-bold text-foreground mt-12 mb-8">$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold text-foreground">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/gim, '<code class="bg-muted px-2 py-1 rounded text-sm font-mono text-primary">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>')
      .replace(/\n/gim, '<br>')

    if (!parsed.match(/^<h[1-6]/)) {
      parsed = `<p class="mb-6 text-foreground leading-relaxed">${parsed}</p>`
    }

    return parsed
  }).join('')

  return html
}

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([])

  useEffect(() => {
    applyBlogColorScheme()
    if (slug) {
      fetchBlog()
    }
  }, [slug])

  const fetchBlog = async () => {
    if (!slug) {
      setError('Invalid blog slug')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const fetchedBlog = await BlogService.getBlogBySlug(slug)

      if (!fetchedBlog) {
        setError('Blog not found')
        setLoading(false)
        return
      }

      if (fetchedBlog.status !== 'published') {
        setError('This blog is not available')
        setLoading(false)
        return
      }

      setBlog(fetchedBlog)

      try {
        const relatedResponse = await BlogService.getPublishedBlogs(1, 3)
        const related = relatedResponse.data.filter(
          b => b.id !== fetchedBlog.id && 
          b.tags?.some(tag => fetchedBlog.tags?.includes(tag))
        ).slice(0, 3)
        setRelatedBlogs(related)
      } catch (err) {
        console.error('Error fetching related blogs:', err)
      }
    } catch (err: any) {
      console.error('Error fetching blog:', err)
      setError(err.message || 'Failed to load blog')
      toast.error('Failed to load blog', {
        description: 'Please try again later.'
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <section className="mx-auto px-5">
          <section className="max-w-4xl mx-auto py-20">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Loading blog post...</p>
            </div>
                    </section>
                </section>
      </main>
    )
  }

  if (error || !blog) {
    return (
      <main className="min-h-screen bg-background">
        <section className="mx-auto px-5">
          <section className="max-w-4xl mx-auto py-20">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Blog Not Found</h1>
                <p className="text-muted-foreground mb-6">
                  {error || 'The blog post you are looking for does not exist or is no longer available.'}
                </p>
              </div>
              <div className="flex justify-center space-x-4">
                <Link
                  href="/blog"
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Back to Blog
                </Link>
              </div>
            </div>
          </section>
            </section>
        </main>
    )
  }

  const readTime = blog.read_time || Math.ceil(blog.content.length / 1000)
  const publishDate = blog.published_at || blog.created_at

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto px-5">
        <section className="max-w-4xl mx-auto">
          <div className="pt-8 pb-4">
            <Link
              href="/blog"
              className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>

          <header className="mb-12">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight mb-6 text-foreground">
              {blog.title}
            </h1>
            
            {blog.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                {blog.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pb-8 border-b border-border/50">
              {blog.author && (
                <div className="flex items-center space-x-3">
                  {blog.author.profile_picture_url ? (
                    <Image
                      src={blog.author.profile_picture_url}
                      alt={blog.author.full_name || 'Author'}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {blog.author.full_name?.charAt(0)?.toUpperCase() || 'A'}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="text-foreground font-medium">{blog.author.full_name || 'Unknown Author'}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(publishDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{readTime} min read</span>
              </div>

              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{blog.views_count || 0} views</span>
              </div>
            </div>
          </header>

          {blog.cover_image_url && (
            <div className="mb-12 -mx-5">
              <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
                <Image
                  src={blog.cover_image_url}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-12">
              {blog.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <article className="max-w-none mb-16">
            <div
              className="blog-content space-y-4 text-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(blog.content) }}
              style={{
                fontSize: '1.125rem',
                lineHeight: '1.75rem'
              }}
            />
          </article>

          {relatedBlogs.length > 0 && (
            <div className="border-t border-border/50 pt-12 mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <Link
                    key={relatedBlog.id}
                    href={`/blog/${relatedBlog.slug}`}
                    className="group bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden hover:border-primary/50 transition-all duration-300"
                  >
                    {relatedBlog.cover_image_url && (
                      <div className="relative w-full h-48 overflow-hidden">
                        <Image
                          src={relatedBlog.cover_image_url}
                          alt={relatedBlog.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {relatedBlog.title}
                      </h3>
                      {relatedBlog.excerpt && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {relatedBlog.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-border/50 pt-8 pb-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to All Posts
            </Link>
          </div>
        </section>
      </section>
    </main>
  )
}

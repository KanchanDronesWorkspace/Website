"use client"

import React, { useState, useEffect, useRef } from 'react'
import { withAuth, useAuth } from '@/lib/contexts/auth-context'
import { BlogService } from '@/lib/services/blog-service'
import { ImageUploadService } from '@/lib/services/image-upload-service'
import { useNotifications } from '@/lib/contexts/notification-context'
import type { BlogFormData, Blog } from '@/lib/types/blog-management'
import { useRouter, useParams } from 'next/navigation'
import { toast } from 'sonner'
import { applyBlogColorScheme } from '@/lib/utils/color-scheme'

const parseMarkdown = (text: string): string => {
  return text
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/`(.*)`/gim, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\n/gim, '<br>')
}

function EditBlogPage() {
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    cover_image_url: '',
    excerpt: '',
    tags: []
  })
  const [isPreview, setIsPreview] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [blog, setBlog] = useState<Blog | null>(null)
  const [notFound, setNotFound] = useState(false)
  
  const { success, error } = useNotifications()
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const blogId = params.id as string
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    applyBlogColorScheme()
  }, [])

  useEffect(() => {
    if (blogId) {
      fetchBlog()
    }
  }, [blogId])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      const fetchedBlog = await BlogService.getBlogById(blogId)

      if (!fetchedBlog) {
        setNotFound(true)
        return
      }
      
      if (user?.role !== 'admin' && fetchedBlog.author_id !== user?.id) {
        toast.error('Access denied', {
          description: 'You can only edit your own blogs.'
        })
        router.push('/dashboard')
        return
      }

      setBlog(fetchedBlog)
      setFormData({
        title: fetchedBlog.title,
        content: fetchedBlog.content,
        cover_image_url: fetchedBlog.cover_image_url,
        excerpt: fetchedBlog.excerpt,
        tags: fetchedBlog.tags || []
      })
    } catch (err: any) {
      console.error('Error fetching blog:', err)
      toast.error('Failed to load blog', {
        description: err.message || 'An unexpected error occurred'
      })
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const handleAutoSave = async () => {
    if (!formData.title || !formData.content || saving || !blog) return
    
    try {
      setSaving(true)
      await BlogService.updateBlog(blog.id, formData, user!.id)
      console.log('Auto-saved successfully')
    } catch (err) {
      console.error('Auto-save failed:', err)
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    if (formData.title || formData.content) {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current)
      }
      
      autoSaveRef.current = setTimeout(() => {
        handleAutoSave()
      }, 2000)
    }

    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current)
      }
    }
  }, [formData, handleAutoSave])

  const handleInputChange = (field: keyof BlogFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSaveBlog = async () => {
    if (!user || !blog) return

    if (!formData.title || !formData.content || !formData.cover_image_url) {
      toast.error('Missing required fields', {
        description: 'Please fill in title, content, and cover image.'
      })
      return
    }

    try {
      setLoading(true)
      await BlogService.updateBlog(blog.id, formData, user.id)
      
      toast.success('Blog updated successfully!', {
        description: 'Your blog has been saved.'
      })
      
      router.push('/dashboard')
    } catch (err: any) {
      toast.error('Failed to update blog', {
        description: err.message || 'An unexpected error occurred'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)
      
      toast.info('Uploading image...', {
        description: 'Please wait while your image is being uploaded.'
      })

      const result = await ImageUploadService.uploadImage(file, 'blog-images')
      
      if (result.success && result.url) {
        handleInputChange('cover_image_url', result.url)
        toast.success('Image uploaded successfully!', {
          description: 'Your cover image has been uploaded and is ready to use.'
        })
      } else {
        toast.error('Image upload failed', {
          description: result.error || 'Failed to upload image. Please try again.'
        })
      }
    } catch (error: any) {
      console.error('Image upload error:', error)
      toast.error('Image upload failed', {
        description: error.message || 'An unexpected error occurred during upload.'
      })
    } finally {
      setUploadingImage(false)
      event.target.value = ''
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (notFound || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Blog Not Found</h1>
          <p className="text-muted-foreground mb-4">The blog you're looking for doesn't exist or you don't have permission to edit it.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto px-5 border-t border-border rounded-t-4xl">
        <section className="max-w-7xl mx-auto py-12">
          <div className="flex-col md:flex-row flex items-center md:justify-between mb-12">
            <div>
              <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8 mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Edit.
              </h1>
              <h2 className="text-center md:text-left text-lg mt-5 md:pl-8 text-muted-foreground">
                Update your blog post
              </h2>
            </div>
            <div className="flex items-center space-x-4 mt-6 md:mt-0">
              {saving && (
                <div className="flex items-center text-sm text-muted-foreground bg-card/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-border/50">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  Auto-saving...
                </div>
              )}
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="px-6 py-3 bg-card/50 backdrop-blur-sm text-foreground rounded-lg border border-border/50 hover:border-primary/50 hover:bg-card transition-all duration-300 font-medium"
              >
                {isPreview ? '← Edit' : 'Preview →'}
              </button>
              <button
                onClick={handleSaveBlog}
                disabled={loading}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </section>
      </section>

      <section className="max-w-7xl mx-auto px-5 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50">
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-3">
                Title *
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 border border-border/50 rounded-lg bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground/50"
                placeholder="Enter your blog title..."
              />
            </div>

            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50">
              <label htmlFor="cover_image" className="block text-sm font-medium text-foreground mb-3">
                Cover Image *
              </label>
              <div className="space-y-4">
                <div className="relative">
                  <label
                    htmlFor="cover_image"
                    className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background/30 hover:bg-background/50 hover:border-primary/50 transition-all duration-200 ${uploadingImage ? 'opacity-50 cursor-not-allowed' : 'border-border/50'}`}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {uploadingImage ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                          <p className="text-sm text-muted-foreground">Uploading...</p>
                        </div>
                      ) : (
                        <>
                          <svg className="w-10 h-10 mb-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="mb-2 text-sm text-foreground">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, GIF (MAX. 10MB)</p>
                        </>
                      )}
                    </div>
                    <input
                      id="cover_image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
                {formData.cover_image_url && (
                  <div className="relative group">
                    <img
                      src={formData.cover_image_url}
                      alt="Cover preview"
                      className="w-full h-48 object-cover rounded-lg border border-border/50 group-hover:border-primary/50 transition-all duration-200"
                    />
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1">
                      {ImageUploadService.isValidImageUrl(formData.cover_image_url) ? 'Uploaded' : 'External URL'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50">
              <label htmlFor="excerpt" className="block text-sm font-medium text-foreground mb-3">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                className="w-full px-4 py-3 border border-border/50 rounded-lg bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 resize-none placeholder:text-muted-foreground/50"
                rows={3}
                placeholder="Brief description of your blog..."
              />
              <p className="mt-2 text-xs text-muted-foreground">{formData.excerpt?.length || 0}/500 characters</p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50">
              <label className="block text-sm font-medium text-foreground mb-3">
                Tags
              </label>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                    className="flex-1 px-4 py-3 border border-border/50 rounded-lg bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground/50"
                    placeholder="Add a tag and press Enter..."
                  />
                  <button
                    onClick={handleTagAdd}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium"
                  >
                    Add
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20 hover:bg-primary/20 transition-all duration-200"
                      >
                        {tag}
                        <button
                          onClick={() => handleTagRemove(tag)}
                          className="ml-2 text-primary/70 hover:text-primary transition-colors"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Add up to 10 tags to help readers find your content</p>
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50">
              <label htmlFor="content" className="block text-sm font-medium text-foreground mb-3">
                Content *
              </label>
              <div className="border border-border/50 rounded-lg overflow-hidden">
                <div className="bg-muted/50 px-4 py-2 border-b border-border/50">
                  <div className="flex space-x-4 text-sm">
                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.getElementById('content') as HTMLTextAreaElement
                        const start = textarea.selectionStart
                        const end = textarea.selectionEnd
                        const selectedText = textarea.value.substring(start, end)
                        const newText = textarea.value.substring(0, start) + `**${selectedText}**` + textarea.value.substring(end)
                        handleInputChange('content', newText)
                      }}
                      className="hover:text-primary transition-colors"
                    >
                      Bold
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.getElementById('content') as HTMLTextAreaElement
                        const start = textarea.selectionStart
                        const end = textarea.selectionEnd
                        const selectedText = textarea.value.substring(start, end)
                        const newText = textarea.value.substring(0, start) + `*${selectedText}*` + textarea.value.substring(end)
                        handleInputChange('content', newText)
                      }}
                      className="hover:text-primary transition-colors"
                    >
                      Italic
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const textarea = document.getElementById('content') as HTMLTextAreaElement
                        const start = textarea.selectionStart
                        const end = textarea.selectionEnd
                        const selectedText = textarea.value.substring(start, end)
                        const newText = textarea.value.substring(0, start) + `\`${selectedText}\`` + textarea.value.substring(end)
                        handleInputChange('content', newText)
                      }}
                      className="hover:text-primary transition-colors"
                    >
                      Code
                    </button>
                  </div>
                </div>
                <textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  rows={20}
                  className="w-full px-4 py-3 bg-background/50 text-foreground focus:outline-none resize-none font-mono text-sm"
                  placeholder="Write your blog content in markdown..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-4">Preview</h3>
              <div className="prose prose-invert max-w-none">
                {formData.title && (
                  <h1 className="text-2xl font-bold text-foreground mb-4">{formData.title}</h1>
                )}
                {formData.cover_image_url && (
                  <img
                    src={formData.cover_image_url}
                    alt={formData.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                {formData.excerpt && (
                  <p className="text-muted-foreground mb-4">{formData.excerpt}</p>
                )}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {formData.content && (
                  <div
                    className="text-foreground"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(formData.content) }}
                  />
                )}
              </div>
            </div>

            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-4">Writing Tips</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div>
                  <strong className="text-foreground">Markdown Support:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• Use # for headings</li>
                    <li>• Use **text** for bold</li>
                    <li>• Use *text* for italic</li>
                    <li>• Use `code` for inline code</li>
                    <li>• Use [text](url) for links</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-foreground">Best Practices:</strong>
                  <ul className="mt-1 space-y-1">
                    <li>• Write clear, engaging headlines</li>
                    <li>• Use proper paragraph breaks</li>
                    <li>• Include relevant tags</li>
                    <li>• Proofread before submitting</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default withAuth(EditBlogPage)

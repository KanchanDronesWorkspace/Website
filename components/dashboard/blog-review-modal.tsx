import React, { useState } from 'react'
import type { Blog, BlogFormData } from '@/lib/types/blog-management'
import { ImageUploadService } from '@/lib/services/image-upload-service'

interface BlogReviewModalProps {
  blog: Blog
  onClose: () => void
  onEdit: (blogData: BlogFormData) => Promise<void>
  onDelete: () => Promise<void>
  onApprove: () => Promise<void>
  onReject: () => void
  onPublish: () => Promise<void>
  onImageUpload: (file: File) => Promise<string | null>
}

export function BlogReviewModal({
  blog,
  onClose,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onPublish,
  onImageUpload
}: BlogReviewModalProps) {
  const [editing, setEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [blogData, setBlogData] = useState<BlogFormData>({
    title: blog.title,
    content: blog.content,
    cover_image_url: blog.cover_image_url,
    excerpt: blog.excerpt,
    tags: blog.tags || []
  })

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const url = await onImageUpload(file)
      if (url) {
        setBlogData(prev => ({ ...prev, cover_image_url: url }))
      }
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const handleSave = async () => {
    await onEdit(blogData)
    setEditing(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-card/60 backdrop-blur-sm rounded-xl border border-border/50 max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border">
          <div>
            <h3 className="text-xl font-semibold text-foreground">Blog Review</h3>
            <p className="text-sm text-muted-foreground">
              Reviewing: "{blog.title}" by {blog.author?.full_name || 'Unknown'}
            </p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Cover Image</label>
                {editing ? (
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="w-full p-3 border border-border rounded-md bg-background text-foreground disabled:opacity-50"
                    />
                    {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
                    <input
                      type="url"
                      value={blogData.cover_image_url}
                      onChange={(e) => setBlogData({ ...blogData, cover_image_url: e.target.value })}
                      className="w-full p-3 border border-border rounded-md bg-background text-foreground"
                      placeholder="Or enter URL"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    {blog.cover_image_url ? (
                      <img src={blog.cover_image_url} alt={blog.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No cover image
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Title</label>
                {editing ? (
                  <input
                    type="text"
                    value={blogData.title}
                    onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
                    className="w-full p-3 border border-border rounded-md bg-background text-foreground"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-foreground">{blog.title}</h2>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Excerpt</label>
                {editing ? (
                  <textarea
                    value={blogData.excerpt}
                    onChange={(e) => setBlogData({ ...blogData, excerpt: e.target.value })}
                    className="w-full p-3 border border-border rounded-md bg-background text-foreground"
                    rows={3}
                  />
                ) : (
                  <p className="text-muted-foreground">{blog.excerpt}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Content</label>
              {editing ? (
                <textarea
                  value={blogData.content}
                  onChange={(e) => setBlogData({ ...blogData, content: e.target.value })}
                  className="w-full p-3 border border-border rounded-md bg-background text-foreground font-mono text-sm"
                  rows={20}
                />
              ) : (
                <div className="bg-muted p-4 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-mono text-sm text-foreground">{blog.content}</pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-border bg-muted/50">
          <div className="flex space-x-3">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
              >
                Edit Blog
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-md hover:bg-accent/90"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </>
            )}
            <button
              onClick={onDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Delete Blog
            </button>
          </div>

          <div className="flex space-x-3">
            {blog.status === 'pending_approval' && (
              <>
                <button
                  onClick={onApprove}
                  className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-md hover:bg-accent/90"
                >
                  Approve
                </button>
                <button
                  onClick={onReject}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
                >
                  Reject
                </button>
              </>
            )}
            {blog.status === 'approved' && (
              <button
                onClick={onPublish}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
              >
                Publish
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

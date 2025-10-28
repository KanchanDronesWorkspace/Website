import React from 'react'
import Link from 'next/link'
import type { Blog } from '@/lib/types/blog-management'

interface AdminBlogsProps {
  blogs: Blog[]
  onReview: (blog: Blog) => void
  onApprove: (blogId: string) => void
  onReject: (blog: Blog) => void
  onPublish: (blogId: string) => void
}

export function AdminBlogs({ blogs, onReview, onApprove, onReject, onPublish }: AdminBlogsProps) {
  const getStatusBadge = (status: string) => {
    const styles = {
      published: 'bg-accent/20 text-accent border-accent/30',
      pending_approval: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
      draft: 'bg-muted text-muted-foreground border-border',
      rejected: 'bg-red-500/20 text-red-500 border-red-500/30',
      approved: 'bg-primary/20 text-primary border-primary/30'
    }
    return `inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${styles[status as keyof typeof styles] || styles.draft}`
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Blog Management</h2>
      </div>

      <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {blogs.map((blog) => (
                <tr key={blog.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-foreground">{blog.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-foreground">{blog.author?.full_name || 'Unknown'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(blog.status)}>
                      {blog.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button onClick={() => onReview(blog)} className="text-primary hover:text-primary/80">
                      Review
                    </button>
                    <Link href={`/edit-blog/${blog.id}`} className="text-accent hover:text-accent/80">
                      Edit
                    </Link>
                    {blog.status === 'pending_approval' && (
                      <>
                        <button onClick={() => onApprove(blog.id)} className="text-green-600 hover:text-green-800">Approve</button>
                        <button onClick={() => onReject(blog)} className="text-red-600 hover:text-red-800">Reject</button>
                      </>
                    )}
                    {blog.status === 'approved' && (
                      <button onClick={() => onPublish(blog.id)} className="text-blue-600 hover:text-blue-800">Publish</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


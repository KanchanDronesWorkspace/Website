import React from 'react'
import type { Blog } from '@/lib/types/blog-management'

interface BlogManagementTableProps {
  blogs: Blog[]
  onReview: (blog: Blog) => void
  onApprove: (blogId: string) => void
  onReject: (blog: Blog) => void
  onPublish: (blogId: string) => void
}

export function BlogManagementTable({ blogs, onReview, onApprove, onReject, onPublish }: BlogManagementTableProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: 'bg-accent/20 text-accent border border-accent/30',
      pending_approval: 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30',
      draft: 'bg-muted text-muted-foreground border border-border',
      rejected: 'bg-red-500/20 text-red-500 border border-red-500/30',
      approved: 'bg-primary/20 text-primary border border-primary/30'
    }

    return statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
  }

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
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
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(blog.status)}`}>
                    {blog.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {new Date(blog.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => onReview(blog)}
                    className="text-primary hover:text-primary/80 font-medium"
                  >
                    Review Blog
                  </button>
                  <a
                    href={`/edit-blog/${blog.id}`}
                    className="text-accent hover:text-accent/80 font-medium"
                  >
                    Edit Blog
                  </a>
                  {blog.status === 'pending_approval' && (
                    <>
                      <button
                        onClick={() => onApprove(blog.id)}
                        className="text-accent hover:text-accent/80"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onReject(blog)}
                        className="text-red-500 hover:text-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {blog.status === 'approved' && (
                    <button
                      onClick={() => onPublish(blog.id)}
                      className="text-primary hover:text-primary/80"
                    >
                      Publish
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


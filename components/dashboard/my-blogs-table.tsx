import React from 'react'
import Link from 'next/link'
import type { Blog } from '@/lib/types/blog-management'

interface MyBlogsTableProps {
  blogs: Blog[]
  onSubmitForApproval: (blogId: string) => void
  onDelete: (blogId: string) => void
}

export function MyBlogsTable({ blogs, onSubmitForApproval, onDelete }: MyBlogsTableProps) {
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
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Views
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
                  {blog.excerpt && (
                    <div className="text-sm text-muted-foreground">{blog.excerpt}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(blog.status)}`}>
                    {blog.status.replace('_', ' ')}
                  </span>
                  {blog.rejection_reason && (
                    <div className="text-xs text-red-600 mt-1">
                      Reason: {blog.rejection_reason}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {blog.views_count || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {new Date(blog.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Link
                    href={`/edit-blog/${blog.id}`}
                    className="text-primary hover:text-primary/80"
                  >
                    Edit
                  </Link>
                  {blog.status === 'draft' && (
                    <button
                      onClick={() => onSubmitForApproval(blog.id)}
                      className="text-accent hover:text-accent/80"
                    >
                      Submit
                    </button>
                  )}
                  {blog.status === 'rejected' && (
                    <button
                      onClick={() => onSubmitForApproval(blog.id)}
                      className="text-yellow-500 hover:text-yellow-600"
                    >
                      Resubmit
                    </button>
                  )}
                  {(blog.status === 'draft' || blog.status === 'rejected') && (
                    <button
                      onClick={() => onDelete(blog.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
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


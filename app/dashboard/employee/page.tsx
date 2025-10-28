"use client"

import React, { useState, useEffect } from 'react'
import { withAuth, useAuth } from '@/lib/contexts/auth-context'
import { DashboardService } from '@/lib/services/dashboard-service'
import { BlogService } from '@/lib/services/blog-service'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { DashboardTabs } from '@/components/dashboard/dashboard-tabs'
import { EmployeeOverview } from '@/components/dashboard/employee-overview'
import { MyBlogsTable } from '@/components/dashboard/my-blogs-table'
import { WriteBlogSection } from '@/components/dashboard/write-blog-section'
import type { DashboardStats, Blog } from '@/lib/types/blog-management'
import { toast } from 'sonner'
import { applyBlogColorScheme } from '@/lib/utils/color-scheme'
import Link from 'next/link'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'my-blogs', label: 'My Blogs' },
  { id: 'write-blog', label: 'Write Blog' }
]

function EmployeeDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'my-blogs' | 'write-blog'>('overview')
  
  const { user } = useAuth()

  useEffect(() => {
    applyBlogColorScheme()
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      if (!user) {
        toast.error('Authentication required', {
          description: 'You must be logged in to view dashboard'
        })
        return
      }
      
      const [statsData, blogsData] = await Promise.all([
        DashboardService.getEmployeeStats(user.id),
        BlogService.getUserBlogs(user.id)
      ])
      
      setStats(statsData)
      setBlogs(blogsData)
    } catch (err: any) {
      toast.error('Failed to fetch dashboard data', {
        description: err.message || 'An unexpected error occurred'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitForApproval = async (blogId: string) => {
    try {
      if (!user) {
        toast.error('Authentication required')
        return
      }
      await BlogService.submitForApproval(blogId, user.id)
      toast.success('Blog submitted!', {
        description: 'Your blog has been submitted for review.'
      })
      fetchDashboardData()
    } catch (err: any) {
      toast.error('Failed to submit blog', {
        description: err.message || 'An unexpected error occurred'
      })
    }
  }

  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return
    
    try {
      if (!user) {
        toast.error('Authentication required')
        return
      }
      await BlogService.deleteBlog(blogId, user.id)
      toast.success('Blog deleted!', {
        description: 'Your blog has been successfully deleted.'
      })
      fetchDashboardData()
    } catch (err: any) {
      toast.error('Failed to delete blog', {
        description: err.message || 'An unexpected error occurred'
      })
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader 
        title="Dashboard." 
        onRefresh={fetchDashboardData}
        customActions={
          <>
            <Link
              href="/settings"
              className="px-6 py-3 bg-card/50 backdrop-blur-sm text-foreground rounded-lg border border-border/50 hover:border-primary/50 hover:bg-card transition-all duration-300 font-medium"
            >
              Settings
            </Link>
            <Link
              href="/write-blog"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium"
            >
              Write New Blog
            </Link>
            <button
              onClick={fetchDashboardData}
              className="px-6 py-3 bg-card/50 backdrop-blur-sm text-foreground rounded-lg border border-border/50 hover:border-primary/50 hover:bg-card transition-all duration-300 font-medium"
            >
              Refresh
            </button>
          </>
        }
      />
      <DashboardTabs tabs={TABS} activeTab={activeTab} onTabChange={(tabId) => setActiveTab(tabId as any)} />

      <section className="max-w-7xl mx-auto px-5 py-8">
        {activeTab === 'overview' && stats && <EmployeeOverview stats={stats} />}

        {activeTab === 'my-blogs' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">My Blogs</h2>
            <MyBlogsTable
              blogs={blogs}
              onSubmitForApproval={handleSubmitForApproval}
              onDelete={handleDeleteBlog}
            />
          </div>
        )}

        {activeTab === 'write-blog' && <WriteBlogSection />}
      </section>
    </main>
  )
}

export default withAuth(EmployeeDashboard, 'employee')

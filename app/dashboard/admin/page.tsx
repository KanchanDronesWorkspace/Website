"use client"

import React, { useState, useEffect } from 'react'
import { withAuth, useAuth } from '@/lib/contexts/auth-context'
import { DashboardService } from '@/lib/services/dashboard-service'
import { BlogService } from '@/lib/services/blog-service'
import { ImageUploadService } from '@/lib/services/image-upload-service'
import { SettingsService } from '@/lib/services/settings-service'
import { DashboardHeader } from '@/components/dashboard/dashboard-header'
import { DashboardTabs } from '@/components/dashboard/dashboard-tabs'
import { AdminOverview } from '@/components/dashboard/admin-overview'
import { BlogManagementTable } from '@/components/dashboard/blog-management-table'
import { UserManagementTable } from '@/components/dashboard/user-management-table'
import { SettingsSection } from '@/components/dashboard/settings-section'
import { BlogReviewModal } from '@/components/dashboard/blog-review-modal'
import { RejectionModal } from '@/components/dashboard/rejection-modal'
import type { SystemSettings } from '@/lib/types/interfaces'
import type { DashboardStats, User, Blog, BlogFormData } from '@/lib/types/blog-management'
import { toast } from 'sonner'
import { applyBlogColorScheme } from '@/lib/utils/color-scheme'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'blogs', label: 'Blog Management' },
  { id: 'users', label: 'User Management' },
  { id: 'settings', label: 'Settings' }
]

function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'blogs' | 'users' | 'settings'>('overview')
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectionModal, setShowRejectionModal] = useState(false)
  const [showBlogReviewModal, setShowBlogReviewModal] = useState(false)
  const [settings, setSettings] = useState<SystemSettings | null>(null)
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [savingSettings, setSavingSettings] = useState(false)

  const { user } = useAuth()

  useEffect(() => {
    applyBlogColorScheme()
    fetchDashboardData()
    loadSettings()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsData, usersData, blogsData] = await Promise.all([
        DashboardService.getAdminStats(),
        DashboardService.getAllUsers(),
        BlogService.getAdminBlogs(1, 50)
      ])
      setStats(statsData)
      setUsers(usersData)
      setBlogs(blogsData.data)
    } catch (err: any) {
      toast.error('Failed to fetch dashboard data', {
        description: err.message || 'An unexpected error occurred'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApproveBlog = async (blogId: string) => {
    if (!user) {
      toast.error('Authentication required')
      return
    }
    try {
      await BlogService.approveBlog(blogId, user.id)
      toast.success('Blog approved!')
      fetchDashboardData()
      setShowBlogReviewModal(false)
    } catch (err: any) {
      toast.error('Failed to approve blog', { description: err.message })
    }
  }

  const handleRejectBlog = async (reason: string) => {
    if (!selectedBlog || !user) return
    try {
      await BlogService.rejectBlog(selectedBlog.id, user.id, reason)
      toast.success('Blog rejected')
      setShowRejectionModal(false)
      setShowBlogReviewModal(false)
      setSelectedBlog(null)
      setRejectionReason('')
      fetchDashboardData()
    } catch (err: any) {
      toast.error('Failed to reject blog', { description: err.message })
    }
  }

  const handlePublishBlog = async (blogId: string) => {
    if (!user) {
      toast.error('Authentication required')
      return
    }
    try {
      await BlogService.publishBlog(blogId, user.id)
      toast.success('Blog published!')
      fetchDashboardData()
      setShowBlogReviewModal(false)
    } catch (err: any) {
      toast.error('Failed to publish blog', { description: err.message })
    }
  }

  const handleUpdateUserRole = async (userId: string, role: 'admin' | 'employee') => {
    try {
      await DashboardService.updateUserRole(userId, role)
      toast.success('User role updated!')
      fetchDashboardData()
    } catch (err: any) {
      toast.error('Failed to update user role', { description: err.message })
    }
  }

  const handleReviewBlog = (blog: Blog) => {
    setSelectedBlog(blog)
    setShowBlogReviewModal(true)
  }

  const handleEditBlog = async (blogData: BlogFormData) => {
    if (!selectedBlog || !user) return
    try {
      await BlogService.updateBlog(selectedBlog.id, blogData, user.id)
      toast.success('Blog updated!')
      fetchDashboardData()
    } catch (err: any) {
      toast.error('Failed to update blog', { description: err.message })
    }
  }

  const handleDeleteBlog = async () => {
    if (!selectedBlog || !user) return
    if (!confirm('Are you sure you want to delete this blog?')) return
    try {
      await BlogService.deleteBlog(selectedBlog.id, user.id)
      toast.success('Blog deleted!')
      setShowBlogReviewModal(false)
      setSelectedBlog(null)
      fetchDashboardData()
    } catch (err: any) {
      toast.error('Failed to delete blog', { description: err.message })
    }
  }

  const handleImageUpload = async (file: File): Promise<string | null> => {
    try {
      const result = await ImageUploadService.uploadImage(file, 'blog-images')
      if (result.success && result.url) {
        toast.success('Image uploaded successfully!')
        return result.url
      } else {
        toast.error('Image upload failed', { description: result.error })
        return null
      }
    } catch (error: any) {
      toast.error('Image upload failed', { description: error.message })
      return null
    }
  }

  // Settings handlers
  const loadSettings = async () => {
    try {
      setSettingsLoading(true)
      const result = await SettingsService.getSettings()
      if (result.success && result.data) {
        setSettings(result.data)
      } else {
        toast.error('Failed to load settings', { description: result.error })
      }
    } catch (error: any) {
      toast.error('Failed to load settings', { description: error.message })
    } finally {
      setSettingsLoading(false)
    }
  }

  const handleSettingChange = (key: keyof SystemSettings, value: any) => {
    if (!settings) return
    setSettings(prev => ({ ...prev!, [key]: value }))
  }

  const handleSaveSettings = async () => {
    if (!settings) return
    try {
      setSavingSettings(true)
      const result = await SettingsService.saveSettings(settings)
      if (result.success && result.data) {
        setSettings(result.data)
        SettingsService.applySettings(result.data)
        toast.success('Settings saved successfully!')
      } else {
        toast.error('Failed to save settings', { description: result.error })
      }
    } catch (error: any) {
      toast.error('Failed to save settings', { description: error.message })
    } finally {
      setSavingSettings(false)
    }
  }

  const handleResetSettings = async () => {
    if (!confirm('Reset all settings to defaults?')) return
    try {
      setSavingSettings(true)
      const result = await SettingsService.resetToDefaults()
      if (result.success && result.data) {
        setSettings(result.data)
        SettingsService.applySettings(result.data)
        toast.success('Settings reset successfully!')
      } else {
        toast.error('Failed to reset settings', { description: result.error })
      }
    } catch (error: any) {
      toast.error('Failed to reset settings', { description: error.message })
    } finally {
      setSavingSettings(false)
    }
  }

  const refreshSystemInfo = async () => {
    try {
      const result = await SettingsService.getSystemInfo()
      if (result.success && result.data && settings) {
        setSettings(prev => ({
          ...prev!,
          database_status: result.data!.database_status,
          storage_usage: result.data!.storage_usage,
          last_backup: result.data!.last_backup
        }))
        toast.success('System information updated!')
      } else {
        toast.error('Failed to refresh system info', { description: result.error })
      }
    } catch (error: any) {
      toast.error('Failed to refresh system info', { description: error.message })
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
      <DashboardHeader title="Dashboard." onRefresh={fetchDashboardData} />
      <DashboardTabs tabs={TABS} activeTab={activeTab} onTabChange={(tabId) => setActiveTab(tabId as any)} />

      <section className="max-w-7xl mx-auto px-5 py-8">
        {activeTab === 'overview' && stats && <AdminOverview stats={stats} />}

        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Blog Management</h2>
            <BlogManagementTable
              blogs={blogs}
              onReview={handleReviewBlog}
              onApprove={handleApproveBlog}
              onReject={(blog) => {
                setSelectedBlog(blog)
                setShowRejectionModal(true)
              }}
              onPublish={handlePublishBlog}
            />
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">User Management</h2>
            <UserManagementTable users={users} onRoleChange={handleUpdateUserRole} />
          </div>
        )}

        {activeTab === 'settings' && settings && (
          <SettingsSection
            settings={settings}
            loading={settingsLoading}
            saving={savingSettings}
            onSettingChange={handleSettingChange}
            onSave={handleSaveSettings}
            onReset={handleResetSettings}
            onRefresh={refreshSystemInfo}
          />
        )}
      </section>

      {showBlogReviewModal && selectedBlog && (
        <BlogReviewModal
          blog={selectedBlog}
          onClose={() => {
            setShowBlogReviewModal(false)
            setSelectedBlog(null)
          }}
          onEdit={handleEditBlog}
          onDelete={handleDeleteBlog}
          onApprove={() => handleApproveBlog(selectedBlog.id)}
          onReject={() => {
            setShowBlogReviewModal(false)
            setShowRejectionModal(true)
          }}
          onPublish={() => handlePublishBlog(selectedBlog.id)}
          onImageUpload={handleImageUpload}
        />
      )}

      {showRejectionModal && selectedBlog && (
        <RejectionModal
          blogTitle={selectedBlog.title}
          onClose={() => {
            setShowRejectionModal(false)
            setSelectedBlog(null)
          }}
          onConfirm={handleRejectBlog}
        />
      )}
    </main>
  )
}

export default withAuth(AdminDashboard, 'admin')
import { supabase } from '@/lib/supabase/client'
import type { DashboardStats, User } from '@/lib/types/blog-management'
import type { ServiceResult } from '@/lib/types/interfaces'

export class DashboardService {
  static async getAdminStats(): Promise<DashboardStats> {
    try {
      const { data: blogData, error: blogError } = await supabase
        .from('blogs')
        .select('status')

      if (blogError) {
        console.error('Error fetching blog counts:', blogError)
        throw new Error('Failed to fetch blog counts')
      }

      const blogCounts = blogData?.reduce((acc, blog) => {
        if (blog.status) {
          acc[blog.status] = (acc[blog.status] || 0) + 1
        }
        return acc
      }, {} as Record<string, number>) || {}

      const { data: viewsData, error: viewsError } = await supabase
        .from('blogs')
        .select('views_count')
        .eq('status', 'published')

      if (viewsError) {
        console.error('Error fetching views data:', viewsError)
        throw new Error('Failed to fetch views data')
      }

      const totalViews = viewsData?.reduce((sum, blog) => sum + (blog.views_count || 0), 0) || 0

      const { data: recentActivity, error: activityError } = await supabase
        .from('notifications')
        .select(`
          type,
          message,
          created_at,
          blog:blogs!notifications_blog_id_fkey(title)
        `)
        .order('created_at', { ascending: false })
        .limit(10)

      if (activityError) {
        console.error('Error fetching recent activity:', activityError)
      }

      return {
        total_blogs: Object.values(blogCounts).reduce((sum, count) => sum + count, 0),
        published_blogs: blogCounts.published || 0,
        pending_approvals: blogCounts.pending_approval || 0,
        draft_blogs: blogCounts.draft || 0,
        total_views: totalViews,
        recent_activity: recentActivity?.map(activity => ({
          type: activity.type,
          message: activity.message,
          created_at: activity.created_at || new Date().toISOString()
        })) || []
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error)
      throw new Error('Failed to fetch admin stats')
    }
  }

  static async getEmployeeStats(userId: string): Promise<DashboardStats> {
    try {
      if (!userId || userId.trim().length === 0) {
        throw new Error('User ID is required')
      }

      const { data: blogData, error: blogError } = await supabase
        .from('blogs')
        .select('status')
        .eq('author_id', userId)

      if (blogError) {
        console.error('Error fetching user blog counts:', blogError)
        throw new Error('Failed to fetch user blog counts')
      }

      const blogCounts = blogData?.reduce((acc, blog) => {
        if (blog.status) {
          acc[blog.status] = (acc[blog.status] || 0) + 1
        }
        return acc
      }, {} as Record<string, number>) || {}

      const { data: viewsData, error: viewsError } = await supabase
        .from('blogs')
        .select('views_count')
        .eq('author_id', userId)
        .eq('status', 'published')

      if (viewsError) {
        console.error('Error fetching user views data:', viewsError)
        throw new Error('Failed to fetch user views data')
      }

      const totalViews = viewsData?.reduce((sum, blog) => sum + (blog.views_count || 0), 0) || 0

      const { data: recentActivity, error: activityError } = await supabase
        .from('notifications')
        .select(`
          type,
          message,
          created_at,
          blog:blogs!notifications_blog_id_fkey(title)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10)

      if (activityError) {
        console.error('Error fetching user recent activity:', activityError)
      }

      return {
        total_blogs: Object.values(blogCounts).reduce((sum, count) => sum + count, 0),
        published_blogs: blogCounts.published || 0,
        pending_approvals: blogCounts.pending_approval || 0,
        draft_blogs: blogCounts.draft || 0,
        total_views: totalViews,
        recent_activity: recentActivity?.map(activity => ({
          type: activity.type,
          message: activity.message,
          created_at: activity.created_at || new Date().toISOString()
        })) || []
      }
    } catch (error) {
      console.error('Error fetching employee stats:', error)
      throw new Error('Failed to fetch employee stats')
    }
  }

  static async getAllUsers(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching users:', error)
        throw new Error('Failed to fetch users')
      }

      return data as User[]
    } catch (error) {
      console.error('Error fetching users:', error)
      throw new Error('Failed to fetch users')
    }
  }

  static async updateUserRole(userId: string, role: 'admin' | 'employee'): Promise<void> {
    try {
      if (!userId || userId.trim().length === 0) {
        throw new Error('User ID is required')
      }

      if (!role || !['admin', 'employee'].includes(role)) {
        throw new Error('Invalid role. Must be admin or employee')
      }

      const { error } = await supabase
        .from('users')
        .update({
          role,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        console.error('Error updating user role:', error)
        throw new Error('Failed to update user role')
      }
    } catch (error) {
      console.error('Error updating user role:', error)
      throw new Error('Failed to update user role')
    }
  }

  static async deactivateUser(userId: string): Promise<void> {
    try {
      if (!userId || userId.trim().length === 0) {
        throw new Error('User ID is required')
      }

      const { error } = await supabase
        .from('users')
        .update({
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        console.error('Error deactivating user:', error)
        throw new Error('Failed to deactivate user')
      }
    } catch (error) {
      console.error('Error deactivating user:', error)
      throw new Error('Failed to deactivate user')
    }
  }

  static async getUserAnalytics(userId: string) {
    try {
      if (!userId || userId.trim().length === 0) {
        throw new Error('User ID is required')
      }

      const { data: blogStats, error: blogError } = await supabase
        .from('blogs')
        .select('views_count, created_at, status')
        .eq('author_id', userId)
        .eq('status', 'published')

      if (blogError) {
        console.error('Error fetching user blog stats:', blogError)
        throw new Error('Failed to fetch user blog stats')
      }

      const monthlyStats = blogStats?.reduce((acc, blog) => {
        if (blog.created_at) {
          const month = new Date(blog.created_at).toISOString().slice(0, 7) // YYYY-MM
          if (!acc[month]) {
            acc[month] = { blogs: 0, views: 0 }
          }
          acc[month].blogs += 1
          acc[month].views += blog.views_count || 0
        }
        return acc
      }, {} as Record<string, { blogs: number; views: number }>) || {}

      const totalViews = blogStats?.reduce((sum, blog) => sum + (blog.views_count || 0), 0) || 0
      const totalPublishedBlogs = blogStats?.length || 0
      const averageViewsPerBlog = totalPublishedBlogs > 0 ? totalViews / totalPublishedBlogs : 0

      return {
        totalViews,
        totalPublishedBlogs,
        averageViewsPerBlog,
        monthlyStats
      }
    } catch (error) {
      console.error('Error fetching user analytics:', error)
      throw new Error('Failed to fetch user analytics')
    }
  }

  static async getDashboardStats(userId: string, isAdmin: boolean = false): Promise<ServiceResult<DashboardStats>> {
    try {
      const stats = isAdmin
        ? await this.getAdminStats()
        : await this.getEmployeeStats(userId)

      return {
        data: stats,
        error: null,
        success: true
      }
    } catch (error: any) {
      return {
        data: null,
        error: error.message || 'Failed to fetch dashboard stats',
        success: false
      }
    }
  }

  static async getUsers(): Promise<ServiceResult<User[]>> {
    try {
      const users = await this.getAllUsers()
      return {
        data: users,
        error: null,
        success: true
      }
    } catch (error: any) {
      return {
        data: null,
        error: error.message || 'Failed to fetch users',
        success: false
      }
    }
  }

  static async updateRole(userId: string, role: 'admin' | 'employee'): Promise<ServiceResult<void>> {
    try {
      await this.updateUserRole(userId, role)
      return {
        data: null,
        error: null,
        success: true
      }
    } catch (error: any) {
      return {
        data: null,
        error: error.message || 'Failed to update user role',
        success: false
      }
    }
  }

  static async deactivate(userId: string): Promise<ServiceResult<void>> {
    try {
      await this.deactivateUser(userId)
      return {
        data: null,
        error: null,
        success: true
      }
    } catch (error: any) {
      return {
        data: null,
        error: error.message || 'Failed to deactivate user',
        success: false
      }
    }
  }

  static async getAnalytics(userId: string): Promise<ServiceResult<any>> {
    try {
      const analytics = await this.getUserAnalytics(userId)
      return {
        data: analytics,
        error: null,
        success: true
      }
    } catch (error: any) {
      return {
        data: null,
        error: error.message || 'Failed to fetch analytics',
        success: false
      }
    }
  }
}

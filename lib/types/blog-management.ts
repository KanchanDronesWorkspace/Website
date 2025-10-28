export type UserRole = 'admin' | 'employee'

export type BlogStatus = 'draft' | 'pending_approval' | 'approved' | 'published' | 'rejected' | 'archived'

export type NotificationType = 'blog_approved' | 'blog_rejected' | 'new_submission' | 'blog_published' | 'system_announcement'

export interface User {
  id: string
  email: string
  role: UserRole
  created_at: string
  updated_at: string
  profile_picture_url?: string
  bio?: string
  is_active: boolean
  full_name?: string
  avatar_uploaded?: boolean 
  phone?: string
  location?: string
  website?: string
  social_links?: {
    twitter?: string
    linkedin?: string
    github?: string
  }
}

export interface Blog {
  id: string
  title: string
  slug: string
  content: string 
  cover_image_url: string
  excerpt: string
  author_id: string
  status: BlogStatus
  created_at: string
  updated_at: string
  published_at?: string
  approved_by?: string
  approved_at?: string
  rejection_reason?: string
  tags: string[]
  read_time: number
  views_count: number
  author?: User
  approver?: User
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  blog_id?: string
  message: string
  is_read: boolean
  created_at: string
  blog?: Blog
}

export interface BlogFormData {
  title: string
  content: string
  cover_image_url: string
  excerpt: string
  tags: string[]
}

export interface ApprovalAction {
  blog_id: string
  action: 'approve' | 'reject'
  rejection_reason?: string
}

export interface ApiResponse<T> {
  data: T
  error?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  has_more: boolean
}

export interface DashboardStats {
  total_blogs: number
  published_blogs: number
  pending_approvals: number
  draft_blogs: number
  total_views: number
  recent_activity: {
    type: string
    message: string
    created_at: string
  }[]
}

export interface RealtimeSubscription {
  channel: string
  callback: (payload: any) => void
}

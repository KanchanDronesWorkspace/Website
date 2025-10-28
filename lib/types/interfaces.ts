import type { User, UserRole } from '@/lib/types/blog-management'

export interface AuthError {
    message: string
    code?: string
    details?: string
    hint?: string
}

export interface AuthResult<T = any> {
    data: T | null
    error: AuthError | null
    success: boolean
}

export interface SignUpData {
    email: string
    password: string
    fullName: string
    role?: UserRole
}

export interface SignInData {
    email: string
    password: string
}

export interface UpdateProfileData {
    userId: string
    updates: Partial<User>
}

export interface ServiceResult<T> {
    data: T | null
    error: string | null
    success: boolean
}

export interface ImageUploadResult {
    success: boolean
    url?: string
    error?: string
}

export interface SystemSettings {
    site_name: string
    site_description: string
    default_blog_status: 'draft' | 'pending_approval' | 'published'
    posts_per_page: number

    require_avatar_upload: boolean
    auto_approve_employee_blogs: boolean
    allow_user_registration: boolean

    enable_comments: boolean
    enable_social_sharing: boolean
    enable_email_notifications: boolean
    max_file_upload_size: number

    require_email_verification: boolean
    enable_two_factor_auth: boolean
    session_timeout_minutes: number

    platform_version: string
    database_status: 'connected' | 'disconnected' | 'error'
    storage_usage: string
    last_backup: string
}

export interface SettingsResult<T> {
    success: boolean
    data?: T
    error?: string
}
import { z } from 'zod'
import type { UserRole, BlogStatus } from '@/lib/types/blog-management'

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .max(255, 'Email must be less than 255 characters')
  .transform(email => email.toLowerCase().trim())

export const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters long')
  .max(128, 'Password must be less than 128 characters')

export const fullNameSchema = z
  .string()
  .min(1, 'Full name is required')
  .min(2, 'Full name must be at least 2 characters long')
  .max(100, 'Full name must be less than 100 characters')
  .transform(name => name.trim())

export const userRoleSchema = z.enum(['admin', 'employee'] as const)

export const blogStatusSchema = z.enum([
  'draft',
  'pending_approval', 
  'approved',
  'published',
  'rejected',
  'archived'
] as const)

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: fullNameSchema,
  role: userRoleSchema.optional().default('employee')
})

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required')
})

export const updateProfileSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  updates: z.object({
    full_name: fullNameSchema.optional(),
    email: emailSchema.optional(),
    bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
    phone: z.string().max(20, 'Phone number must be less than 20 characters').optional(),
    location: z.string().max(100, 'Location must be less than 100 characters').optional(),
    website: z.string().url('Please enter a valid website URL').optional(),
    social_links: z.object({
      twitter: z.string().url('Please enter a valid Twitter URL').optional(),
      linkedin: z.string().url('Please enter a valid LinkedIn URL').optional(),
      github: z.string().url('Please enter a valid GitHub URL').optional()
    }).optional(),
    avatar_uploaded: z.boolean().optional(),
    is_active: z.boolean().optional()
  })
})

export const resetPasswordSchema = z.object({
  email: emailSchema
})

export const updatePasswordSchema = z.object({
  newPassword: passwordSchema
})

export const blogFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters long')
    .max(200, 'Title must be less than 200 characters')
    .transform(title => title.trim()),
  content: z
    .string()
    .min(1, 'Content is required')
    .min(10, 'Content must be at least 10 characters long')
    .max(50000, 'Content must be less than 50,000 characters'),
  cover_image_url: z
    .string()
    .url('Please enter a valid image URL')
    .optional()
    .or(z.literal('')),
  excerpt: z
    .string()
    .max(500, 'Excerpt must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  tags: z
    .array(z.string().min(1, 'Tag cannot be empty').max(50, 'Tag must be less than 50 characters'))
    .max(10, 'Maximum 10 tags allowed')
    .optional()
    .default([])
})

export const createBlogSchema = blogFormSchema.extend({
  author_id: z.string().uuid('Invalid author ID')
})

export const updateBlogSchema = blogFormSchema.extend({
  id: z.string().uuid('Invalid blog ID'),
  status: blogStatusSchema.optional()
})

export const blogQuerySchema = z.object({
  page: z.coerce.number().int().min(1, 'Page must be at least 1').default(1),
  limit: z.coerce.number().int().min(1, 'Limit must be at least 1').max(100, 'Limit must be less than 100').default(10),
  status: blogStatusSchema.optional(),
  author_id: z.string().uuid('Invalid author ID').optional(),
  search: z.string().max(100, 'Search term must be less than 100 characters').optional()
})

export const updateUserRoleSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  role: userRoleSchema
})

export const deactivateUserSchema = z.object({
  userId: z.string().uuid('Invalid user ID')
})

export const systemSettingsSchema = z.object({
  site_name: z.string().min(1, 'Site name is required').max(100, 'Site name must be less than 100 characters'),
  site_description: z.string().max(500, 'Site description must be less than 500 characters'),
  default_blog_status: blogStatusSchema,
  posts_per_page: z.number().int().min(1, 'Posts per page must be at least 1').max(100, 'Posts per page must be less than 100'),

  require_avatar_upload: z.boolean(),
  auto_approve_employee_blogs: z.boolean(),
  allow_user_registration: z.boolean(),

  enable_comments: z.boolean(),
  enable_social_sharing: z.boolean(),
  enable_email_notifications: z.boolean(),
  max_file_upload_size: z.number().int().min(1, 'Max file size must be at least 1MB').max(100, 'Max file size must be less than 100MB'),

  require_email_verification: z.boolean(),
  enable_two_factor_auth: z.boolean(),
  session_timeout_minutes: z.number().int().min(5, 'Session timeout must be at least 5 minutes').max(1440, 'Session timeout must be less than 24 hours'),

  platform_version: z.string(),
  database_status: z.enum(['connected', 'disconnected', 'error']),
  storage_usage: z.string(),
  last_backup: z.string()
})

export const imageUploadSchema = z.object({
  file: z.instanceof(File, { message: 'Please select a valid file' }),
  bucket: z.string().min(1, 'Bucket name is required'),
  folder: z.string().optional()
})

export const notificationSchema = z.object({
  user_id: z.string().uuid('Invalid user ID'),
  type: z.enum(['info', 'success', 'warning', 'error']),
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  message: z.string().min(1, 'Message is required').max(500, 'Message must be less than 500 characters'),
  data: z.record(z.any()).optional()
})

export type SignUpInput = z.infer<typeof signUpSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>
export type BlogFormInput = z.infer<typeof blogFormSchema>
export type CreateBlogInput = z.infer<typeof createBlogSchema>
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>
export type BlogQueryInput = z.infer<typeof blogQuerySchema>
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>
export type DeactivateUserInput = z.infer<typeof deactivateUserSchema>
export type SystemSettingsInput = z.infer<typeof systemSettingsSchema>
export type ImageUploadInput = z.infer<typeof imageUploadSchema>
export type NotificationInput = z.infer<typeof notificationSchema>
  
export const validateWithZod = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } => {
  try {
    const result = schema.parse(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
      return { success: false, error: errorMessage }
    }
    return { success: false, error: 'Validation failed' }
  }
}

export const validateWithZodAsync = async <T>(schema: z.ZodSchema<T>, data: unknown): Promise<{ success: true; data: T } | { success: false; error: string }> => {
  try {
    const result = await schema.parseAsync(data)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
      return { success: false, error: errorMessage }
    }
    return { success: false, error: 'Validation failed' }
  }
}

import { supabase } from '@/lib/supabase/client'
import type { 
  Blog, 
  BlogFormData,
  PaginatedResponse, 
} from '@/lib/types/blog-management'
import { 
  createBlogSchema, 
  updateBlogSchema, 
  validateWithZod,
  type CreateBlogInput,
  type UpdateBlogInput,
} from '@/lib/schemas/validation'

export class BlogService {
  static async createBlog(blogData: BlogFormData, authorId: string): Promise<Blog> {
    try {
      const validation = validateWithZod(createBlogSchema, { ...blogData, author_id: authorId })
      if (!validation.success) {
        throw new Error(`Validation failed: ${validation.error}`)
      }

      const validatedData = validation.data as CreateBlogInput

      const slug = validatedData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim()

      const { data, error } = await supabase
        .from('blogs')
        .insert({
          title: validatedData.title,
          content: validatedData.content,
          cover_image_url: validatedData.cover_image_url || '',
          excerpt: validatedData.excerpt || '',
          tags: validatedData.tags,
          slug,
          author_id: validatedData.author_id,
          status: 'draft'
        })
        .select(`
          *,
          author:users!blogs_author_id_fkey(*),
          approver:users!blogs_approved_by_fkey(*)
        `)
        .single()

      if (error) throw error
      return data as Blog
    } catch (error) {
      console.error('Error creating blog:', error)
      throw new Error('Failed to create blog')
    }
  }
  static async updateBlog(blogId: string, blogData: Partial<BlogFormData>, userId: string): Promise<Blog> {
    try {
      const validation = validateWithZod(updateBlogSchema, { id: blogId, ...blogData })
      if (!validation.success) {
        throw new Error(`Validation failed: ${validation.error}`)
      }

      const validatedData = validation.data as UpdateBlogInput

      const { data: existingBlog } = await supabase
        .from('blogs')
        .select('author_id')
        .eq('id', blogId)
        .single()

      if (!existingBlog) {
        throw new Error('Blog not found')
      }

      const userProfile = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

      if (userProfile.data?.role !== 'admin' && existingBlog.author_id !== userId) {
        throw new Error('Unauthorized to update this blog')
      }

      const updateData: any = {
        updated_at: new Date().toISOString()
      }

      if (validatedData.title) {
        updateData.title = validatedData.title
        updateData.slug = validatedData.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim()
      }

      if (validatedData.content !== undefined) updateData.content = validatedData.content
      if (validatedData.cover_image_url !== undefined) updateData.cover_image_url = validatedData.cover_image_url
      if (validatedData.excerpt !== undefined) updateData.excerpt = validatedData.excerpt
      if (validatedData.tags !== undefined) updateData.tags = validatedData.tags
      if (validatedData.status) updateData.status = validatedData.status

      const { data, error } = await supabase
        .from('blogs')
        .update(updateData)
        .eq('id', blogId)
        .select(`
          *,
          author:users!blogs_author_id_fkey(*),
          approver:users!blogs_approved_by_fkey(*)
        `)
        .single()

      if (error) throw error
      return data as Blog
    } catch (error) {
      console.error('Error updating blog:', error)
      throw new Error('Failed to update blog')
    }
  }

  static async deleteBlog(blogId: string, userId: string): Promise<void> {
    try {
      const { data: existingBlog } = await supabase
        .from('blogs')
        .select('author_id, status')
        .eq('id', blogId)
        .single()

      if (!existingBlog) {
        throw new Error('Blog not found')
      }

      const userProfile = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

      const canDelete = userProfile.data?.role === 'admin' || 
        (existingBlog.author_id === userId && existingBlog.status === 'draft')

      if (!canDelete) {
        throw new Error('Unauthorized to delete this blog')
      }

      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', blogId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting blog:', error)
      throw new Error('Failed to delete blog')
    }
  }

  static async getBlogById(blogId: string): Promise<Blog | null> {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select(`
          *,
          author:users!blogs_author_id_fkey(*),
          approver:users!blogs_approved_by_fkey(*)
        `)
        .eq('id', blogId)
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null
        throw error
      }
      return data as Blog
    } catch (error) {
      console.error('Error fetching blog:', error)
      throw new Error('Failed to fetch blog')
    }
  }

  static async getBlogBySlug(slug: string): Promise<Blog | null> {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select(`
          *,
          author:users!blogs_author_id_fkey(*),
          approver:users!blogs_approved_by_fkey(*)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (error) {
        if (error.code === 'PGRST116') return null
        throw error
      }

      if (data) {
        await supabase
          .from('blogs')
          .update({ views_count: (data.views_count || 0) + 1 })
          .eq('id', data.id)

        data.views_count = (data.views_count || 0) + 1
      }

      return data as Blog
    } catch (error) {
      console.error('Error fetching blog by slug:', error)
      throw new Error('Failed to fetch blog')
    }
  }
  static async getPublishedBlogs(page: number = 1, limit: number = 10): Promise<PaginatedResponse<Blog>> {
    try {
      const offset = (page - 1) * limit

      const { data, error, count } = await supabase
        .from('blogs')
        .select(`
          *,
          author:users!blogs_author_id_fkey(*),
          approver:users!blogs_approved_by_fkey(*)
        `, { count: 'exact' })
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error

      return {
        data: data as Blog[],
        total: count || 0,
        page,
        limit,
        has_more: (count || 0) > offset + limit
      }
    } catch (error) {
      console.error('Error fetching published blogs:', error)
      throw new Error('Failed to fetch blogs')
    }
  }

  static async getUserBlogs(userId: string, status?: string): Promise<Blog[]> {
    try {
      let query = supabase
        .from('blogs')
        .select(`
          *,
          author:users!blogs_author_id_fkey(*),
          approver:users!blogs_approved_by_fkey(*)
        `)
        .eq('author_id', userId)
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status as any)
      }

      const { data, error } = await query

      if (error) throw error
      return data as Blog[]
    } catch (error) {
      console.error('Error fetching user blogs:', error)
      throw new Error('Failed to fetch user blogs')
    }
  }

  static async getAdminBlogs(page: number = 1, limit: number = 10, status?: string): Promise<PaginatedResponse<Blog>> {
    try {
      const offset = (page - 1) * limit

      let query = supabase
        .from('blogs')
        .select(`
          *,
          author:users!blogs_author_id_fkey(*),
          approver:users!blogs_approved_by_fkey(*)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (status) {
        query = query.eq('status', status as any)
      }

      const { data, error, count } = await query

      if (error) throw error

      return {
        data: data as Blog[],
        total: count || 0,
        page,
        limit,
        has_more: (count || 0) > offset + limit
      }
    } catch (error) {
      console.error('Error fetching admin blogs:', error)
      throw new Error('Failed to fetch admin blogs')
    }
  }

  static async submitForApproval(blogId: string, userId: string): Promise<void> {
    try {
      const { data: blog } = await supabase
        .from('blogs')
        .select('author_id, status')
        .eq('id', blogId)
        .single()

      if (!blog || blog.author_id !== userId) {
        throw new Error('Unauthorized or blog not found')
      }

      if (blog.status !== 'draft') {
        throw new Error('Only draft blogs can be submitted for approval')
      }

      const { error: updateError } = await supabase
        .from('blogs')
        .update({ 
          status: 'pending_approval',
          updated_at: new Date().toISOString()
        })
        .eq('id', blogId)

      if (updateError) throw updateError

      const { data: admins } = await supabase
        .from('users')
        .select('id')
        .eq('role', 'admin')
        .eq('is_active', true)

      if (admins) {
        const notifications = admins.map(admin => ({
          user_id: admin.id,
          type: 'new_submission' as const,
          blog_id: blogId,
          message: 'A new blog has been submitted for approval'
        }))

        await supabase
          .from('notifications')
          .insert(notifications)
      }
    } catch (error) {
      console.error('Error submitting blog for approval:', error)
      throw new Error('Failed to submit blog for approval')
    }
  }

  static async approveBlog(blogId: string, approverId: string): Promise<void> {
    try {
      const { data, error } = await supabase.rpc('approve_blog', {
        p_blog_id: blogId,
        p_approver_id: approverId
      })

      if (error) throw error
      if (!data) throw new Error('Failed to approve blog')
    } catch (error) {
      console.error('Error approving blog:', error)
      throw new Error('Failed to approve blog')
    }
  }

  static async rejectBlog(blogId: string, rejectorId: string, rejectionReason?: string): Promise<void> {
    try {
      const { data, error } = await supabase.rpc('reject_blog', {
        p_blog_id: blogId,
        p_rejector_id: rejectorId,
        p_rejection_reason: rejectionReason
      })

      if (error) throw error
      if (!data) throw new Error('Failed to reject blog')
    } catch (error) {
      console.error('Error rejecting blog:', error)
      throw new Error('Failed to reject blog')
    }
  }

  static async publishBlog(blogId: string, publisherId: string): Promise<void> {
    try {
      const { data: blog } = await supabase
        .from('blogs')
        .select('author_id, status')
        .eq('id', blogId)
        .single()

      if (!blog) {
        throw new Error('Blog not found')
      }

      if (blog.status !== 'approved') {
        throw new Error('Only approved blogs can be published')
      }

      const { error: updateError } = await supabase
        .from('blogs')
        .update({ 
          status: 'published',
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', blogId)

      if (updateError) throw updateError

      await supabase.rpc('create_notification', {
        p_user_id: blog.author_id,
        p_type: 'blog_published',
        p_message: 'Your blog has been published and is now live!',
        p_blog_id: blogId
      })
    } catch (error) {
      console.error('Error publishing blog:', error)
      throw new Error('Failed to publish blog')
    }
  }

  static async incrementViewCount(blogId: string): Promise<void> {
    try {
      await supabase.rpc('increment_blog_views', { blog_id: blogId })
    } catch (error) {
      console.error('Error incrementing view count:', error)
    }
  }
}

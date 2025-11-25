import { supabase } from '@/lib/supabase/client'
import type { ImageUploadResult } from '@/lib/types/interfaces'

export class ImageUploadService {
  static async uploadImage(file: File, folder: string = 'blog-images'): Promise<ImageUploadResult> {
    try {
      if (!file.type.startsWith('image/')) {
        return {
          success: false,
          error: 'Please select a valid image file'
        }
      }

      const maxSize = 5 * 1024 * 1024 
      if (file.size > maxSize) {
        return {
          success: false,
          error: 'Image size must be less than 5MB'
        }
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${folder}/${fileName}`

      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Supabase storage upload error:', error)
        return {
          success: false,
          error: `Upload failed: ${error.message}`
        }
      }

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath)

      return {
        success: true,
        url: publicUrl
      }
    } catch (error: any) {
      console.error('Image upload error:', error)
      return {
        success: false,
        error: error.message || 'An unexpected error occurred during upload'
      }
    }
  }

  static async deleteImage(url: string): Promise<ImageUploadResult> {
    try {
      const urlParts = url.split('/')
      const fileName = urlParts[urlParts.length - 1]
      const folder = urlParts[urlParts.length - 2]
      const filePath = `${folder}/${fileName}`

      const { error } = await supabase.storage
        .from('blog-images')
        .remove([filePath])

      if (error) {
        console.error('Supabase storage delete error:', error)
        return {
          success: false,
          error: `Delete failed: ${error.message}`
        }
      }

      return {
        success: true
      }
    } catch (error: any) {
      console.error('Image delete error:', error)
      return {
        success: false,
        error: error.message || 'An unexpected error occurred during deletion'
      }
    }
  }

  static async getImages(folder: string = 'blog-images'): Promise<{success: boolean, images?: string[], error?: string}> {
    try {
      const { data, error } = await supabase.storage
        .from('blog-images')
        .list(folder, {
          limit: 100,
          offset: 0
        })

      if (error) {
        console.error('Supabase storage list error:', error)
        return {
          success: false,
          error: `Failed to list images: ${error.message}`
        }
      }

      const images = data.map(file => {
        const { data: { publicUrl } } = supabase.storage
          .from('blog-images')
          .getPublicUrl(`${folder}/${file.name}`)
        return publicUrl
      })

      return {
        success: true,
        images
      }
    } catch (error: any) {
      console.error('Get images error:', error)
      return {
        success: false,
        error: error.message || 'An unexpected error occurred while fetching images'
      }
    }
  }

  static isValidImageUrl(url: string): boolean {
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === 'https:' && (
        urlObj.hostname.includes('supabase') ||
        urlObj.hostname.includes('kanchandroneswebsite.vercel.app') 
      )
    } catch {
      return false
    }
  }

  static async getImageSize(url: string): Promise<number | null> {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      const contentLength = response.headers.get('content-length')
      return contentLength ? parseInt(contentLength) : null
    } catch {
      return null
    }
  }
}

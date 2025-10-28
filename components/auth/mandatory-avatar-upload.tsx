"use client"

import React, { useState } from 'react'
import { useAuth } from '@/lib/contexts/auth-context'
import { ImageUploadService } from '@/lib/services/image-upload-service'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

function MandatoryAvatarUpload() {
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const { user, updateProfile } = useAuth()
  const router = useRouter()

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)

      toast.info('Uploading avatar...', {
        description: 'Please wait while your avatar is being uploaded.'
      })

      const result = await ImageUploadService.uploadImage(file, 'user-avatars')

      if (result.success && result.url) {
        setAvatarUrl(result.url)

        const updateResult = await updateProfile({
          profile_picture_url: result.url,
          avatar_uploaded: true
        })

        if (updateResult.success) {
          toast.success('Avatar uploaded successfully!', {
            description: 'Welcome to Kanchan Drones! You can now access all features.'
          })

          setTimeout(() => {
            router.push('/dashboard')
          }, 1500)
        } else {
          toast.error('Failed to update profile', {
            description: updateResult.error || 'Failed to update profile with new avatar.'
          })
        }
      } else {
        toast.error('Avatar upload failed', {
          description: result.error || 'Failed to upload avatar. Please try again.'
        })
      }
    } catch (error: any) {
      console.error('Avatar upload error:', error)
      toast.error('Avatar upload failed', {
        description: error.message || 'An unexpected error occurred during upload.'
      })
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-lg border border-border p-8 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-white font-bold">
              {user?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Welcome to Kanchan Drones!
          </h1>
          <p className="text-muted-foreground">
            To complete your profile setup, please upload your avatar image.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-border">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-2xl text-muted-foreground">
                      {user?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>
              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Upload Your Avatar
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Choose a clear profile picture that represents you professionally.
            </p>

            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploading}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className={`inline-flex items-center px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 cursor-pointer transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Choose Avatar
                  </>
                )}
              </label>

              <div className="text-xs text-muted-foreground">
                <p>Supported formats: JPG, PNG, GIF</p>
                <p>Maximum size: 5MB</p>
                <p>Recommended: Square image, 400x400px or larger</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <button
              onClick={() => {
                updateProfile({ avatar_uploaded: true })
                router.push('/dashboard')
              }}
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              Skip for now (you can upload later in settings)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MandatoryAvatarUpload

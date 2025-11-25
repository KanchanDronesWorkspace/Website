"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/contexts/auth-context'
import { ImageUploadService } from '@/lib/services/image-upload-service'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { applyBlogColorScheme } from '@/lib/utils/color-scheme'

function MandatoryAvatarUpload() {
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const { user, updateProfile } = useAuth()
  const router = useRouter()

  useEffect(() => {
    applyBlogColorScheme()
  }, [])

  useEffect(() => {
    if (user?.profile_picture_url) {
      setAvatarUrl(user.profile_picture_url)
    }
  }, [user])

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

  const handleSkip = async () => {
    try {
      const result = await updateProfile({ avatar_uploaded: true })
      if (result.success) {
        router.push('/dashboard')
      } else {
        toast.error('Failed to skip', {
          description: result.error || 'An error occurred while skipping avatar upload.'
        })
      }
    } catch (error: any) {
      toast.error('Failed to skip', {
        description: error.message || 'An unexpected error occurred.'
      })
    }
  }

  const initialLetter = user?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card/60 backdrop-blur-sm rounded-2xl border border-border/50 p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-primary/30">
            <span className="text-3xl text-primary font-bold">
              {initialLetter}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to Kanchan Drones!
          </h1>
          <p className="text-muted-foreground">
            To complete your profile setup, please upload your avatar image.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative group">
              <div className={`w-32 h-32 rounded-full overflow-hidden border-4 transition-all duration-300 ${
                avatarUrl ? 'border-primary/60 shadow-lg shadow-primary/20' : 'border-border'
              }`}>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image load error:', avatarUrl)
                      setAvatarUrl('')
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <span className="text-5xl text-primary/70 font-bold">
                      {initialLetter}
                    </span>
                  </div>
                )}
              </div>
              {uploading && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
                    <div className="absolute inset-0 animate-ping rounded-full border-2 border-white/30"></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              Upload Your Avatar
            </h3>
            <p className="text-sm text-muted-foreground">
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
                className={`inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 cursor-pointer transition-all duration-200 font-medium shadow-lg shadow-primary/20 ${
                  uploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {avatarUrl ? 'Change Avatar' : 'Choose Avatar'}
                  </>
                )}
              </label>

              {avatarUrl && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setAvatarUrl('')
                      const input = document.getElementById('avatar-upload') as HTMLInputElement
                      if (input) input.value = ''
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Remove image
                  </button>
                </div>
              )}

              <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
                <p>• Supported formats: JPG, PNG, GIF</p>
                <p>• Maximum size: 5MB</p>
                <p>• Recommended: Square image, 400×400px or larger</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border/50">
            <button
              onClick={handleSkip}
              disabled={uploading}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed py-2"
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

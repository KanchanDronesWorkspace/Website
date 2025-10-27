"use client"

import React, { useState, useEffect } from 'react'
import { withAuth, useAuth } from '@/lib/contexts/auth-context'
import { AuthService } from '@/lib/services/auth-service'
import { ImageUploadService } from '@/lib/services/image-upload-service'
import { toast } from 'sonner'
import type { User } from '@/lib/types/blog-management'
import { updateProfileSchema, updatePasswordSchema, validateWithZod } from '@/lib/schemas/validation'

interface UserSettings {
  full_name: string
  bio: string
  phone: string
  location: string
  website: string
  social_links: {
    twitter: string
    linkedin: string
    github: string
  }
}

function SettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [settings, setSettings] = useState<UserSettings>({
    full_name: '',
    bio: '',
    phone: '',
    location: '',
    website: '',
    social_links: {
      twitter: '',
      linkedin: '',
      github: ''
    }
  })
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  
  const { user, updateProfile } = useAuth()

  useEffect(() => {
    if (user) {
      setSettings({
        full_name: user.full_name || '',
        bio: user.bio || '',
        phone: user.phone || '',
        location: user.location || '',
        website: user.website || '',
        social_links: {
          twitter: user.social_links?.twitter || '',
          linkedin: user.social_links?.linkedin || '',
          github: user.social_links?.github || ''
        }
      })
      setAvatarUrl(user.profile_picture_url || '')
      setLoading(false)
    }
  }, [user])

  const handleInputChange = (field: keyof UserSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSocialLinkChange = (platform: keyof UserSettings['social_links'], value: string) => {
    setSettings(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value
      }
    }))
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploadingAvatar(true)
      
      toast.info('Uploading avatar...', {
        description: 'Please wait while your avatar is being uploaded.'
      })

      const result = await ImageUploadService.uploadImage(file, 'user-avatars')
      
      if (result.success && result.url) {
        setAvatarUrl(result.url)
        
        // Update user profile with new avatar
        const updateResult = await updateProfile({
          profile_picture_url: result.url,
          avatar_uploaded: true
        })
        
        if (updateResult.success) {
          toast.success('Avatar uploaded successfully!', {
            description: 'Your profile picture has been updated.'
          })
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
      setUploadingAvatar(false)
      event.target.value = ''
    }
  }

  const handleSaveSettings = async () => {
    if (!user) return

    // Validate settings with Zod
    const validation = validateWithZod(updateProfileSchema, {
      userId: user.id,
      updates: settings
    })

    if (!validation.success) {
      toast.error('Validation failed', {
        description: validation.error
      })
      return
    }

    try {
      setSaving(true)
      
      const updateResult = await updateProfile(settings)
      
      if (updateResult.success) {
        toast.success('Settings saved successfully!', {
          description: 'Your profile has been updated.'
        })
      } else {
        toast.error('Failed to save settings', {
          description: updateResult.error || 'An unexpected error occurred.'
        })
      }
    } catch (error: any) {
      console.error('Settings save error:', error)
      toast.error('Failed to save settings', {
        description: error.message || 'An unexpected error occurred.'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    const newPassword = prompt('Enter new password (minimum 6 characters):')
    
    // Validate password with Zod
    const validation = validateWithZod(updatePasswordSchema, { newPassword })
    if (!validation.success) {
      toast.error('Invalid password', {
        description: validation.error
      })
      return
    }

    try {
      const result = await AuthService.updatePassword(newPassword!)
      
      if (result.success) {
        toast.success('Password updated successfully!', {
          description: 'Your password has been changed.'
        })
      } else {
        toast.error('Failed to update password', {
          description: result.error?.message || 'An unexpected error occurred.'
        })
      }
    } catch (error: any) {
      console.error('Password update error:', error)
      toast.error('Failed to update password', {
        description: error.message || 'An unexpected error occurred.'
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </div>
            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-6">Profile Picture</h2>
              
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-border">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-4xl text-muted-foreground">
                          {user?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={uploadingAvatar}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingAvatar ? 'Uploading...' : 'Upload Avatar'}
                  </label>
                  <p className="text-xs text-muted-foreground mt-2">
                    JPG, PNG, GIF up to 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div className="bg-card p-6 rounded-lg border border-border mt-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">Account Security</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-border rounded-md bg-muted text-muted-foreground"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Email cannot be changed
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={user?.role || ''}
                    disabled
                    className="w-full px-3 py-2 border border-border rounded-md bg-muted text-muted-foreground capitalize"
                  />
                </div>
                
                <button
                  onClick={handleChangePassword}
                  className="w-full px-4 py-2 bg-secondary text-foreground rounded-md hover:bg-secondary/90"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Settings Form */}
          <div className="lg:col-span-2">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-6">Profile Information</h2>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <input
                      id="full_name"
                      type="text"
                      value={settings.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={settings.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-2">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={settings.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-primary focus:border-primary"
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
                      Location
                    </label>
                    <input
                      id="location"
                      type="text"
                      value={settings.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Enter your location"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-foreground mb-2">
                      Website
                    </label>
                    <input
                      id="website"
                      type="url"
                      value={settings.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="https://your-website.com"
                    />
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-4">Social Links</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="twitter" className="block text-sm font-medium text-foreground mb-2">
                        Twitter
                      </label>
                      <input
                        id="twitter"
                        type="url"
                        value={settings.social_links.twitter}
                        onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="linkedin" className="block text-sm font-medium text-foreground mb-2">
                        LinkedIn
                      </label>
                      <input
                        id="linkedin"
                        type="url"
                        value={settings.social_links.linkedin}
                        onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="github" className="block text-sm font-medium text-foreground mb-2">
                        GitHub
                      </label>
                      <input
                        id="github"
                        type="url"
                        value={settings.social_links.github}
                        onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withAuth(SettingsPage)

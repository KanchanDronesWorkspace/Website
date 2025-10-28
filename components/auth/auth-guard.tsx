"use client"

import React from 'react'
import { useAuth } from '@/lib/contexts/auth-context'
import MandatoryAvatarUpload from '@/components/auth/mandatory-avatar-upload'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, needsAvatarUpload } = useAuth()

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // If user is not authenticated, show children (login/signup pages)
  if (!user) {
    return <>{children}</>
  }

  // If user is authenticated but hasn't uploaded avatar, show mandatory upload
  if (needsAvatarUpload) {
    return <MandatoryAvatarUpload />
  }

  // User is authenticated and has uploaded avatar, show protected content
  return <>{children}</>
}

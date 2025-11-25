"use client"

import React from 'react'
import { useAuth } from '@/lib/contexts/auth-context'
import MandatoryAvatarUpload from '@/components/auth/mandatory-avatar-upload'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, needsAvatarUpload } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return <>{children}</>
  }

  if (needsAvatarUpload) {
    return <MandatoryAvatarUpload />
  }

  return <>{children}</>
}

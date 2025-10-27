"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthService } from '../services/auth-service'
import type { User } from '../types/blog-management'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  loading: boolean
  needsAvatarUpload: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, fullName: string, role?: 'admin' | 'employee') => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; error?: string }>
  isAdmin: boolean
  isEmployee: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [needsAvatarUpload, setNeedsAvatarUpload] = useState(false)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const sessionResult = await AuthService.getSession()
        if (!sessionResult.success || sessionResult.error) {
          console.error('Error getting initial session:', sessionResult.error)
          setLoading(false)
          return
        }
        
        if (sessionResult.data?.user) {
          const userResult = await AuthService.getCurrentUser()
          if (!userResult.success || userResult.error) {
            console.error('Error getting user profile:', userResult.error)
            // Don't set user if there's an error
          } else {
            setUser(userResult.data)
            // Check if user needs to upload avatar
            setNeedsAvatarUpload(!userResult.data?.avatar_uploaded)
          }
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Subscribe to auth state changes
    const { data: { subscription } } = AuthService.onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const result = await AuthService.signIn({ email, password })
      
      if (!result.success || result.error) {
        toast.error('Sign in failed', {
          description: result.error?.message || 'Invalid credentials'
        })
        return { success: false, error: result.error?.message }
      }
      
      // Get user profile after successful sign in
      const userResult = await AuthService.getCurrentUser()
      if (userResult.success && userResult.data) {
        setUser(userResult.data)
        // Check if user needs to upload avatar
        setNeedsAvatarUpload(!userResult.data?.avatar_uploaded)
      }
      
      toast.success('Welcome back!', {
        description: 'You have successfully signed in.'
      })
      return { success: true }
    } catch (error: any) {
      toast.error('Sign in failed', {
        description: error.message || 'An unexpected error occurred'
      })
      return { success: false, error: error.message || 'Sign in failed' }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string, role: 'admin' | 'employee' = 'employee') => {
    try {
      setLoading(true)
      const result = await AuthService.signUp({ email, password, fullName, role })
      
      if (!result.success || result.error) {
        toast.error('Sign up failed', {
          description: result.error?.message || 'An unexpected error occurred'
        })
        return { success: false, error: result.error?.message }
      }
      
      toast.success('Account created!', {
        description: 'Welcome to Kanchan Drones blog platform.'
      })
      return { success: true }
    } catch (error: any) {
      toast.error('Sign up failed', {
        description: error.message || 'An unexpected error occurred'
      })
      return { success: false, error: error.message || 'Sign up failed' }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const result = await AuthService.signOut()
      
      if (!result.success) {
        toast.error('Sign out failed', {
          description: result.error?.message || 'An unexpected error occurred'
        })
        console.error('Sign out error:', result.error)
      } else {
        setUser(null)
        toast.success('Signed out', {
          description: 'You have been successfully signed out.'
        })
      }
    } catch (error) {
      toast.error('Sign out failed', {
        description: 'An unexpected error occurred'
      })
      console.error('Sign out error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' }
      }

      const result = await AuthService.updateProfile({ userId: user.id, updates })
      
      if (!result.success || result.error) {
        return { success: false, error: result.error?.message }
      }
      
      setUser(result.data)
      // Update avatar upload status if avatar was uploaded
      if (updates.avatar_uploaded !== undefined) {
        setNeedsAvatarUpload(!updates.avatar_uploaded)
      }
      
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || 'Profile update failed' }
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    needsAvatarUpload,
    signIn,
    signUp,
    signOut,
    updateProfile,
    isAdmin: user?.role === 'admin',
    isEmployee: user?.role === 'employee'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: 'admin' | 'employee'
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth()

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-muted-foreground">Please sign in to access this page.</p>
          </div>
        </div>
      )
    }

    if (requiredRole && user.role !== requiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}

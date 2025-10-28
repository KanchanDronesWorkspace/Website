"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/contexts/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { signInSchema, validateWithZod } from '@/lib/schemas/validation'
import { applyBlogColorScheme } from '@/lib/utils/color-scheme'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    applyBlogColorScheme()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const validation = validateWithZod(signInSchema, {
      email,
      password
    })

    if (!validation.success) {
      toast.error('Validation failed', {
        description: validation.error
      })
      setLoading(false)
      return
    }

    try {
      const result = await signIn(email, password)
      
      if (result.success) {
        toast.success('Welcome back!', {
          description: 'You have successfully signed in.'
        })
        router.push('/dashboard')
      } else {
        if (result.error?.includes('Email not confirmed')) {
          toast.error('Email not confirmed', {
            description: 'Please check your email and click the confirmation link before signing in.'
          })
        } else if (result.error?.includes('Invalid login credentials')) {
          toast.error('Invalid credentials', {
            description: 'Please check your email and password.'
          })
        } else {
          toast.error('Sign in failed', {
            description: result.error || 'An unexpected error occurred'
          })
        }
      }
    } catch (err: any) {
      toast.error('Sign in failed', {
        description: err.message || 'An unexpected error occurred'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="hidden lg:block space-y-8">
            <div>
              <h1 className="text-7xl font-bold tracking-tighter leading-tight mb-6 bg-gradient-to-r from-primary via-primary/90 to-accent bg-clip-text text-transparent">
                Welcome Back.
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Sign in to access your dashboard and continue creating amazing content for the Kanchan Drones community.
              </p>
            </div>
            
            <div className="space-y-4 pt-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Secure Access</h3>
                  <p className="text-sm text-muted-foreground">Your account is protected with advanced security measures</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Quick Dashboard</h3>
                  <p className="text-sm text-muted-foreground">Access all your blogs and analytics in one place</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Team Collaboration</h3>
                  <p className="text-sm text-muted-foreground">Work seamlessly with your team members</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="w-full">
            <div className="lg:hidden mb-8">
              <h1 className="text-5xl font-bold tracking-tighter leading-tight mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Sign In.
              </h1>
              <p className="text-lg text-muted-foreground">
                Access your blog management dashboard
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm p-8 lg:p-10 rounded-2xl border border-border/50 shadow-xl">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">Sign In</h2>
                <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-border/50 rounded-lg bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground/50"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-border/50 rounded-lg bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground/50"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 border-border/50 rounded bg-background/50 text-primary focus:ring-primary/50"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                      Remember me
                    </label>
                  </div>
                  
                  <Link href="/forgot-password" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </Link>
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-base shadow-lg shadow-primary/20"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>

                <div className="text-center pt-4 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link href="/auth/signup" className="font-medium text-primary hover:text-primary/80 transition-colors">
                      Sign up
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

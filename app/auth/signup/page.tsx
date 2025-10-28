"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/contexts/auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { signUpSchema, validateWithZod } from '@/lib/schemas/validation'
import { applyBlogColorScheme } from '@/lib/utils/color-scheme'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'admin' | 'employee'>('employee')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signUp } = useAuth()
  const router = useRouter()

  useEffect(() => {
    applyBlogColorScheme()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const validation = validateWithZod(signUpSchema, {
      email,
      password,
      fullName,
      role
    })

    if (!validation.success) {
      toast.error('Validation failed', {
        description: validation.error
      })
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      toast.error('Password mismatch', {
        description: 'Passwords do not match'
      })
      setLoading(false)
      return
    }

    try {
      const result = await signUp(email, password, fullName, role)
      
      if (result.success) {
        toast.success('Account created!', {
          description: 'Welcome to Kanchan Drones blog platform.'
        })
        router.push('/dashboard')
      } else {
        toast.error('Sign up failed', {
          description: result.error || 'An unexpected error occurred'
        })
      }
    } catch (err: any) {
      toast.error('Sign up failed', {
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
                Join Us.
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Start your journey with Kanchan Drones. Create your account and begin sharing your expertise with our community.
              </p>
            </div>
            
            <div className="space-y-4 pt-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Easy Setup</h3>
                  <p className="text-sm text-muted-foreground">Get started in minutes with our simple registration process</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Secure Platform</h3>
                  <p className="text-sm text-muted-foreground">Your data is protected with industry-standard security</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Powerful Tools</h3>
                  <p className="text-sm text-muted-foreground">Access advanced features for content creation and management</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="w-full">
            <div className="lg:hidden mb-8">
              <h1 className="text-5xl font-bold tracking-tighter leading-tight mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Sign Up.
              </h1>
              <p className="text-lg text-muted-foreground">
                Join the Kanchan Drones team
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm p-8 lg:p-10 rounded-2xl border border-border/50 shadow-xl">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">Create Account</h2>
                <p className="text-sm text-muted-foreground">Fill in your details to get started</p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 border border-border/50 rounded-lg bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground/50"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="md:col-span-2">
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

                  <div className="md:col-span-2">
                    <label htmlFor="role" className="block text-sm font-medium text-foreground mb-2">
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'admin' | 'employee')}
                      className="w-full px-4 py-3 border border-border/50 rounded-lg bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                    >
                      <option value="employee">Employee</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-border/50 rounded-lg bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground/50"
                      placeholder="••••••••"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-border/50 rounded-lg bg-background/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground/50"
                      placeholder="••••••••"
                    />
                  </div>
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
                      Creating account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>

                <div className="text-center pt-4 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/auth/signin" className="font-medium text-primary hover:text-primary/80 transition-colors">
                      Sign in
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

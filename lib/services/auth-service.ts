import { supabase } from '@/lib/supabase/client'
import type { User, UserRole } from '@/lib/types/blog-management'
import type { AuthResult, SignUpData, SignInData, UpdateProfileData, AuthError } from '@/lib/types/interfaces'
import { 
  signUpSchema, 
  signInSchema, 
  updateProfileSchema, 
  resetPasswordSchema, 
  updatePasswordSchema,
  validateWithZod,
  type SignUpInput,
  type SignInInput,
  type UpdateProfileInput,
  type ResetPasswordInput,
  type UpdatePasswordInput
} from '@/lib/schemas/validation'

const createFallbackUser = (authUser: any): User => {
  const now = new Date().toISOString()
  return {
    id: authUser.id,
    email: authUser.email || '',
    role: (authUser.user_metadata?.role as UserRole) || 'employee',
    full_name: authUser.user_metadata?.full_name ||
      authUser.email?.split('@')[0] ||
      'User',
    is_active: true,
    created_at: now,
    updated_at: now,
    profile_picture_url: authUser.user_metadata?.avatar_url || null,
    bio: authUser.user_metadata?.bio || null
  }
}

const handleSupabaseError = (error: any): AuthError => {
  if (!error) {
    return {
      message: 'An unknown error occurred',
      code: 'UNKNOWN_ERROR'
    }
  }

  // Handle specific Supabase error codes
  switch (error.code) {
    case 'invalid_credentials':
      return {
        message: 'Invalid email or password',
        code: error.code,
        details: 'Please check your credentials and try again'
      }
    case 'email_not_confirmed':
      return {
        message: 'Email not confirmed',
        code: error.code,
        details: 'Please check your email and click the confirmation link'
      }
    case 'user_not_found':
      return {
        message: 'User not found',
        code: error.code,
        details: 'No account exists with this email address'
      }
    case 'weak_password':
      return {
        message: 'Password is too weak',
        code: error.code,
        details: 'Please choose a stronger password'
      }
    case 'email_address_invalid':
      return {
        message: 'Invalid email address',
        code: error.code,
        details: 'Please enter a valid email address'
      }
    case 'signup_disabled':
      return {
        message: 'Sign up is currently disabled',
        code: error.code,
        details: 'Please contact support for assistance'
      }
    case 'too_many_requests':
      return {
        message: 'Too many requests',
        code: error.code,
        details: 'Please wait a moment before trying again'
      }
    case 'PGRST116':
      return {
        message: 'Profile not found',
        code: error.code,
        details: 'User profile does not exist'
      }
    default:
      return {
        message: error.message || 'An unexpected error occurred',
        code: error.code || 'UNKNOWN_ERROR',
        details: error.details,
        hint: error.hint
      }
  }
}

export class AuthService {
  static async signUp(data: SignUpData): Promise<AuthResult> {
    try {
      console.log('Starting signup process for:', data.email)

      const validation = validateWithZod(signUpSchema, data)
      if (!validation.success) {
        console.log('Validation failed:', validation.error)
        return {
          data: null,
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: validation.error
          },
          success: false
        }
      }

      const validatedData = validation.data as SignUpInput
      console.log('All validations passed, attempting Supabase signup...')

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          data: {
            full_name: validatedData.fullName,
            role: validatedData.role
          }
        }
      })

      if (authError) {
        console.error('Supabase auth error:', authError)
        return {
          data: null,
          error: handleSupabaseError(authError),
          success: false
        }
      }

      if (!authData.user) {
        console.error('No user returned from Supabase')
        return {
          data: null,
          error: {
            message: 'Sign up failed',
            code: 'NO_USER_RETURNED',
            details: 'No user data was returned from authentication service'
          },
          success: false
        }
      }

      console.log('Supabase signup successful, creating user profile...')

      try {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: authData.user.email!,
            role: validatedData.role,
            full_name: validatedData.fullName,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (profileError) {
          console.warn('Profile creation failed, but auth succeeded:', profileError)
        } else {
          console.log('User profile created successfully')
        }
      } catch (profileErr) {
        console.warn('Profile creation error:', profileErr)
      }

      console.log('Signup process completed successfully')
      return {
        data: authData.user,
        error: null,
        success: true
      }
    } catch (error) {
      console.error('Sign up error:', error)
      return {
        data: null,
        error: handleSupabaseError(error),
        success: false
      }
    }
  }

  static async signIn(data: SignInData): Promise<AuthResult> {
    try {
      const validation = validateWithZod(signInSchema, data)
      if (!validation.success) {
        return {
          data: null,
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: validation.error
          },
          success: false
        }
      }

      const validatedData = validation.data as SignInInput

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password
      })

      if (authError) {
        return {
          data: null,
          error: handleSupabaseError(authError),
          success: false
        }
      }

      if (!authData.user) {
        return {
          data: null,
          error: {
            message: 'Sign in failed',
            code: 'NO_USER_RETURNED',
            details: 'No user data was returned from authentication service'
          },
          success: false
        }
      }

      try {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single()

        if (profile) {
          return {
            data: { ...authData.user, profile },
            error: null,
            success: true
          }
        }
      } catch (profileError) {
        console.warn('Profile fetch failed during sign in:', profileError)
      }

      return {
        data: authData.user,
        error: null,
        success: true
      }
    } catch (error) {
      console.error('Sign in error:', error)
      return {
        data: null,
        error: handleSupabaseError(error),
        success: false
      }
    }
  }

  static async signOut(): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        return {
          data: null,
          error: handleSupabaseError(error),
          success: false
        }
      }

      return {
        data: null,
        error: null,
        success: true
      }
    } catch (error) {
      console.error('Sign out error:', error)
      return {
        data: null,
        error: handleSupabaseError(error),
        success: false
      }
    }
  }

  static async getCurrentUser(): Promise<AuthResult<User>> {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

      if (authError) {
        return {
          data: null,
          error: handleSupabaseError(authError),
          success: false
        }
      }

      if (!authUser) {
        return {
          data: null,
          error: null,
          success: true
        }
      }

      let profile: User | null = null
      let profileError: any = null

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()

        profile = data as User
        profileError = error
      } catch (err) {
        profileError = err
      }

      if (profile && !profileError) {
        return {
          data: profile,
          error: null,
          success: true
        }
      }

      if (profileError && (
        profileError.code === 'PGRST116' ||
        profileError.message?.includes('infinite recursion') ||
        profileError.message?.includes('permission denied')
      )) {
        try {
          const { data: newProfile, error: createError } = await supabase
            .from('users')
            .insert({
              id: authUser.id,
              email: authUser.email!,
              role: (authUser.user_metadata?.role as UserRole) || 'employee',
              full_name: authUser.user_metadata?.full_name ||
                authUser.email?.split('@')[0] ||
                'User',
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single()

          if (newProfile && !createError) {
            return {
              data: newProfile as User,
              error: null,
              success: true
            }
          }
        } catch (createErr) {
          console.warn('Profile creation failed:', createErr)
        }
      }

      const fallbackUser = createFallbackUser(authUser)
      return {
        data: fallbackUser,
        error: null,
        success: true
      }
    } catch (error) {
      console.error('Get current user error:', error)
      return {
        data: null,
        error: handleSupabaseError(error),
        success: false
      }
    }
  }

  static async updateProfile(data: UpdateProfileData): Promise<AuthResult<User>> {
    try {
      const validation = validateWithZod(updateProfileSchema, data)
      if (!validation.success) {
        return {
          data: null,
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: validation.error
          },
          success: false
        }
      }

      const validatedData = validation.data as UpdateProfileInput

      const { data: updatedProfile, error } = await supabase
        .from('users')
        .update({
          ...validatedData.updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', validatedData.userId)
        .select()
        .single()

      if (error) {
        return {
          data: null,
          error: handleSupabaseError(error),
          success: false
        }
      }

      return {
        data: updatedProfile as User,
        error: null,
        success: true
      }
    } catch (error) {
      console.error('Update profile error:', error)
      return {
        data: null,
        error: handleSupabaseError(error),
        success: false
      }
    }
  }

  static async isAdmin(userId: string): Promise<boolean> {
    try {
      if (!userId || userId.trim().length === 0) {
        return false
      }

      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

      if (error || !data) {
        return false
      }

      return data.role === 'admin'
    } catch (error) {
      console.error('Check admin error:', error)
      return false
    }
  }

  static async isEmployee(userId: string): Promise<boolean> {
    try {
      if (!userId || userId.trim().length === 0) {
        return false
      }

      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

      if (error || !data) {
        return false
      }

      return data.role === 'employee'
    } catch (error) {
      console.error('Check employee error:', error)
      return false
    }
  }

  static async resetPassword(email: string): Promise<AuthResult> {
    try {
      const validation = validateWithZod(resetPasswordSchema, { email })
      if (!validation.success) {
        return {
          data: null,
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: validation.error
          },
          success: false
        }
      }

      const validatedData = validation.data as ResetPasswordInput

      const { error } = await supabase.auth.resetPasswordForEmail(validatedData.email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        return {
          data: null,
          error: handleSupabaseError(error),
          success: false
        }
      }

      return {
        data: null,
        error: null,
        success: true
      }
    } catch (error) {
      console.error('Reset password error:', error)
      return {
        data: null,
        error: handleSupabaseError(error),
        success: false
      }
    }
  }

  static async updatePassword(newPassword: string): Promise<AuthResult> {
    try {
      const validation = validateWithZod(updatePasswordSchema, { newPassword })
      if (!validation.success) {
        return {
          data: null,
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: validation.error
          },
          success: false
        }
      }

      const validatedData = validation.data as UpdatePasswordInput

      const { error } = await supabase.auth.updateUser({
        password: validatedData.newPassword
      })

      if (error) {
        return {
          data: null,
          error: handleSupabaseError(error),
          success: false
        }
      }

      return {
        data: null,
        error: null,
        success: true
      }
    } catch (error) {
      console.error('Update password error:', error)
      return {
        data: null,
        error: handleSupabaseError(error),
        success: false
      }
    }
  }

  static onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (session?.user) {
          const result = await this.getCurrentUser()
          callback(result.data)
        } else {
          callback(null)
        }
      } catch (error) {
        console.error('Auth state change error:', error)
        callback(null)
      }
    })
  }

  static async getSession(): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        return {
          data: null,
          error: handleSupabaseError(error),
          success: false
        }
      }

      return {
        data: data.session,
        error: null,
        success: true
      }
    } catch (error) {
      console.error('Get session error:', error)
      return {
        data: null,
        error: handleSupabaseError(error),
        success: false
      }
    }
  }

  static async hasRole(userId: string, role: UserRole): Promise<boolean> {
    try {
      if (!userId || userId.trim().length === 0) {
        return false
      }

      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

      if (error || !data) {
        return false
      }

      return data.role === role
    } catch (error) {
      console.error('Check role error:', error)
      return false
    }
  }

  static async getUserById(userId: string): Promise<AuthResult<User>> {
    try {
      if (!userId || userId.trim().length === 0) {
        return {
          data: null,
          error: {
            message: 'User ID is required',
            code: 'MISSING_USER_ID',
            details: 'Please provide a valid user ID'
          },
          success: false
        }
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        return {
          data: null,
          error: handleSupabaseError(error),
          success: false
        }
      }

      return {
        data: data as User,
        error: null,
        success: true
      }
    } catch (error) {
      console.error('Get user by ID error:', error)
      return {
        data: null,
        error: handleSupabaseError(error),
        success: false
      }
    }
  }

  static async deactivateUser(userId: string): Promise<AuthResult> {
    try {
      if (!userId || userId.trim().length === 0) {
        return {
          data: null,
          error: {
            message: 'User ID is required',
            code: 'MISSING_USER_ID',
            details: 'Please provide a valid user ID'
          },
          success: false
        }
      }

      const { error } = await supabase
        .from('users')
        .update({
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        return {
          data: null,
          error: handleSupabaseError(error),
          success: false
        }
      }

      return {
        data: null,
        error: null,
        success: true
      }
    } catch (error) {
      console.error('Deactivate user error:', error)
      return {
        data: null,
        error: handleSupabaseError(error),
        success: false
      }
    }
  }
}
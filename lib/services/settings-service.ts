import { supabase } from '@/lib/supabase/client'
import type { SystemSettings, SettingsResult } from '@/lib/types/interfaces'

export class SettingsService {
  private static readonly SETTINGS_KEY = 'system_settings'

  static async getSettings(): Promise<SettingsResult<SystemSettings>> {
    try {
      const stored = localStorage.getItem(this.SETTINGS_KEY)

      if (stored) {
        const settings = JSON.parse(stored) as SystemSettings
        return {
          success: true,
          data: settings
        }
      }

      const defaultSettings: SystemSettings = {
        site_name: 'Kanchan Drones Blog',
        site_description: 'Aerial Mapping Redefined - Precision. Innovation. Excellence.',
        default_blog_status: 'draft',
        posts_per_page: 10,
        require_avatar_upload: true,
        auto_approve_employee_blogs: false,
        allow_user_registration: true,
        enable_comments: true,
        enable_social_sharing: true,
        enable_email_notifications: true,
        max_file_upload_size: 5,
        require_email_verification: false,
        enable_two_factor_auth: false,
        session_timeout_minutes: 30,
        platform_version: 'v1.0.0',
        database_status: 'connected',
        storage_usage: '2.3 GB / 10 GB',
        last_backup: '2 hours ago'
      }

      return {
        success: true,
        data: defaultSettings
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to load settings'
      }
    }
  }

  static async saveSettings(settings: Partial<SystemSettings>): Promise<SettingsResult<SystemSettings>> {
    try {
      const currentResult = await this.getSettings()
      if (!currentResult.success || !currentResult.data) {
        return {
          success: false,
          error: 'Failed to load current settings'
        }
      }

      const updatedSettings: SystemSettings = {
        ...currentResult.data,
        ...settings
      }

      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(updatedSettings))

      return {
        success: true,
        data: updatedSettings
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to save settings'
      }
    }
  }

  static async resetToDefaults(): Promise<SettingsResult<SystemSettings>> {
    try {
      const defaultSettings: SystemSettings = {
        site_name: 'Kanchan Drones Blog',
        site_description: 'Aerial Mapping Redefined - Precision. Innovation. Excellence.',
        default_blog_status: 'draft',
        posts_per_page: 10,
        require_avatar_upload: true,
        auto_approve_employee_blogs: false,
        allow_user_registration: true,
        enable_comments: true,
        enable_social_sharing: true,
        enable_email_notifications: true,
        max_file_upload_size: 5,
        require_email_verification: false,
        enable_two_factor_auth: false,
        session_timeout_minutes: 30,
        platform_version: 'v1.0.0',
        database_status: 'connected',
        storage_usage: '2.3 GB / 10 GB',
        last_backup: '2 hours ago'
      }

      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(defaultSettings))

      return {
        success: true,
        data: defaultSettings
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to reset settings'
      }
    }
  }

  static async getSystemInfo(): Promise<SettingsResult<{
    database_status: 'connected' | 'disconnected' | 'error'
    storage_usage: string
    last_backup: string
  }>> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1)

      const database_status = error ? 'error' : 'connected'

      const storage_usage = '2.3 GB / 10 GB'

      const last_backup = '2 hours ago'

      return {
        success: true,
        data: {
          database_status,
          storage_usage,
          last_backup
        }
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get system information'
      }
    }
  }

  static applySettings(settings: SystemSettings): void {
    document.title = settings.site_name

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', settings.site_description)
    }

    if (typeof window !== 'undefined') {
      (window as any).systemSettings = settings
    }
  }
}

import React from 'react'
import type { SystemSettings } from '@/lib/types/interfaces'

interface SettingsSectionProps {
  settings: SystemSettings
  loading: boolean
  saving: boolean
  onSettingChange: (key: keyof SystemSettings, value: any) => void
  onSave: () => void
  onReset: () => void
  onRefresh: () => void
}

export function SettingsSection({
  settings,
  loading,
  saving,
  onSettingChange,
  onSave,
  onReset,
  onRefresh
}: SettingsSectionProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Loading settings...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">System Settings</h2>
        <button
          onClick={onRefresh}
          className="px-4 py-2 bg-secondary text-foreground rounded-md hover:bg-secondary/90"
        >
          Refresh System Info
        </button>
      </div>

      {/* Site Configuration */}
      <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50">
        <h3 className="text-lg font-semibold text-foreground mb-4">Site Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SettingInput
            label="Site Name"
            value={settings.site_name}
            onChange={(value) => onSettingChange('site_name', value)}
          />
          <SettingInput
            label="Site Description"
            value={settings.site_description}
            onChange={(value) => onSettingChange('site_description', value)}
          />
          <SettingSelect
            label="Default Blog Status"
            value={settings.default_blog_status}
            options={['draft', 'pending_approval', 'published']}
            onChange={(value) => onSettingChange('default_blog_status', value)}
          />
          <SettingInput
            label="Posts Per Page"
            type="number"
            value={settings.posts_per_page}
            onChange={(value) => onSettingChange('posts_per_page', parseInt(value))}
            min={5}
            max={50}
          />
        </div>
      </div>

      {/* Toggle Settings */}
      <ToggleSettingsGroup
        title="User Management"
        settings={[
          {
            key: 'require_avatar_upload',
            label: 'Require Avatar Upload',
            description: 'Force users to upload profile pictures',
            value: settings.require_avatar_upload
          },
          {
            key: 'auto_approve_employee_blogs',
            label: 'Auto-approve Employee Blogs',
            description: 'Skip approval process for employee blogs',
            value: settings.auto_approve_employee_blogs
          },
          {
            key: 'allow_user_registration',
            label: 'Allow User Registration',
            description: 'Enable public user registration',
            value: settings.allow_user_registration
          }
        ]}
        onToggle={onSettingChange}
      />

      <ToggleSettingsGroup
        title="Blog Platform"
        settings={[
          {
            key: 'enable_comments',
            label: 'Enable Comments',
            description: 'Allow readers to comment on blog posts',
            value: settings.enable_comments
          },
          {
            key: 'enable_social_sharing',
            label: 'Enable Social Sharing',
            description: 'Add social media sharing buttons',
            value: settings.enable_social_sharing
          },
          {
            key: 'enable_email_notifications',
            label: 'Enable Email Notifications',
            description: 'Send email notifications for blog updates',
            value: settings.enable_email_notifications
          }
        ]}
        onToggle={onSettingChange}
        extraField={
          <SettingInput
            label="Maximum File Upload Size (MB)"
            type="number"
            value={settings.max_file_upload_size}
            onChange={(value) => onSettingChange('max_file_upload_size', parseInt(value))}
            min={1}
            max={50}
          />
        }
      />

      <ToggleSettingsGroup
        title="Security Settings"
        settings={[
          {
            key: 'require_email_verification',
            label: 'Require Email Verification',
            description: 'Force users to verify email addresses',
            value: settings.require_email_verification
          },
          {
            key: 'enable_two_factor_auth',
            label: 'Enable Two-Factor Authentication',
            description: 'Require 2FA for admin accounts',
            value: settings.enable_two_factor_auth
          }
        ]}
        onToggle={onSettingChange}
        extraField={
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">Session Timeout (minutes)</h4>
              <p className="text-sm text-muted-foreground">Auto-logout inactive users</p>
            </div>
            <input
              type="number"
              value={settings.session_timeout_minutes}
              onChange={(e) => onSettingChange('session_timeout_minutes', parseInt(e.target.value))}
              min={5}
              max={480}
              className="w-20 px-3 py-2 border border-border rounded-md bg-background text-foreground"
            />
          </div>
        }
      />

      {/* System Information */}
      <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50">
        <h3 className="text-lg font-semibold text-foreground mb-4">System Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField label="Platform Version" value={settings.platform_version} />
          <InfoField 
            label="Database Status" 
            value={settings.database_status}
            status
          />
          <InfoField label="Storage Usage" value={settings.storage_usage} />
          <InfoField label="Last Backup" value={settings.last_backup} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={onReset}
          disabled={saving}
          className="px-4 py-2 bg-secondary text-foreground rounded-md hover:bg-secondary/90 disabled:opacity-50"
        >
          {saving ? 'Resetting...' : 'Reset to Defaults'}
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}

function SettingInput({ label, value, onChange, type = 'text', min, max }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-primary focus:border-primary"
      />
    </div>
  )
}

function SettingSelect({ label, value, options, onChange }: any) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}

function ToggleSettingsGroup({ title, settings, onToggle, extraField }: any) {
  return (
    <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="space-y-4">
        {settings.map((setting: any) => (
          <div key={setting.key} className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-foreground">{setting.label}</h4>
              <p className="text-sm text-muted-foreground">{setting.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={setting.value}
                onChange={(e) => onToggle(setting.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        ))}
        {extraField}
      </div>
    </div>
  )
}

function InfoField({ label, value, status = false }: any) {
  const statusColor = status
    ? value === 'connected' ? 'text-green-600' : value === 'error' ? 'text-red-600' : 'text-yellow-600'
    : 'text-foreground'

  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground">{label}</label>
      <p className={`text-sm ${statusColor}`}>
        {status ? value.charAt(0).toUpperCase() + value.slice(1) : value}
      </p>
    </div>
  )
}


import React from 'react'
import Link from 'next/link'
import { StatsCard } from './stats-card'
import { RecentActivity } from './recent-activity'
import type { DashboardStats } from '@/lib/types/blog-management'

interface EmployeeOverviewProps {
  stats: DashboardStats
}

export function EmployeeOverview({ stats }: EmployeeOverviewProps) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={<span className="text-primary font-bold">B</span>}
          label="Total Blogs"
          value={stats.total_blogs}
        />
        <StatsCard
          icon={<span className="text-accent font-bold">P</span>}
          label="Published"
          value={stats.published_blogs}
          iconBg="bg-accent/20"
          iconColor="text-accent"
        />
        <StatsCard
          icon={<span className="text-yellow-500 font-bold">!</span>}
          label="Pending Approval"
          value={stats.pending_approvals}
          iconBg="bg-yellow-500/20"
          iconColor="text-yellow-500"
        />
        <StatsCard
          icon={
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
          label="Total Views"
          value={stats.total_views}
        />
      </div>

      <RecentActivity activities={stats.recent_activity} />

      <QuickActions />
    </div>
  )
}

function QuickActions() {
  return (
    <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickActionCard
          href="/write-blog"
          icon={
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          }
          title="Write New Blog"
          description="Start creating your next blog post"
          iconBg="bg-primary/20"
          iconBorder="border-primary/30"
        />
        <QuickActionCard
          href="/my-blogs"
          icon={
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          title="Manage Blogs"
          description="View and edit your existing blogs"
          iconBg="bg-primary/20"
          iconBorder="border-primary/30"
        />
        <QuickActionCard
          href="/blog"
          icon={
            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
          title="View Published"
          description="See your published blogs"
          iconBg="bg-accent/20"
          iconBorder="border-accent/30"
        />
      </div>
    </div>
  )
}

interface QuickActionCardProps {
  href: string
  icon: React.ReactNode
  title: string
  description: string
  iconBg: string
  iconBorder: string
}

function QuickActionCard({ href, icon, title, description, iconBg, iconBorder }: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className="p-4 border border-border/50 rounded-lg hover:bg-muted/50 transition-colors"
    >
      <div className="text-center">
        <div className={`w-12 h-12 ${iconBg} border ${iconBorder} rounded-lg flex items-center justify-center mx-auto mb-2`}>
          {icon}
        </div>
        <h4 className="font-medium text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Link>
  )
}


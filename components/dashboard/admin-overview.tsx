import React from 'react'
import { StatsCard } from './stats-card'
import { RecentActivity } from './recent-activity'
import type { DashboardStats } from '@/lib/types/blog-management'

interface AdminOverviewProps {
  stats: DashboardStats
}

export function AdminOverview({ stats }: AdminOverviewProps) {
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
    </div>
  )
}

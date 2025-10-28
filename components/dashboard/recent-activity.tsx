import React from 'react'

interface Activity {
  message: string
  created_at: string
}

interface RecentActivityProps {
  activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">No recent activity</p>
      </div>
    )
  }

  return (
    <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <div>
              <p className="text-sm text-foreground">{activity.message}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(activity.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


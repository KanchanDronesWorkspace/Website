import React from 'react'

interface StatsCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  iconBg?: string
  iconColor?: string
}

export function StatsCard({ icon, label, value, iconBg = 'bg-primary/20', iconColor = 'text-primary' }: StatsCardProps) {
  return (
    <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 ${iconBg} rounded-md flex items-center justify-center border ${iconColor.includes('primary') ? 'border-primary/30' : iconColor.includes('accent') ? 'border-accent/30' : 'border-yellow-500/30'}`}>
            {icon}
          </div>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  )
}

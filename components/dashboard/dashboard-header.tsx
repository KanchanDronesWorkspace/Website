import React from 'react'
import Link from 'next/link'

interface DashboardHeaderProps {
  title: string
  onRefresh?: () => void
  showSettings?: boolean
  customActions?: React.ReactNode
}

export function DashboardHeader({ title, onRefresh, showSettings = true, customActions }: DashboardHeaderProps) {
  return (
    <section className="mx-auto px-5">
      <section className="max-w-7xl mx-auto py-12">
        <div className="flex-col md:flex-row flex items-center md:justify-between mb-12">
          <div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight md:pr-8 mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {title}
            </h1>
          </div>
          <div className="flex items-center space-x-4 mt-6 md:mt-0">
            {customActions ? (
              customActions
            ) : (
              <>
                {showSettings && (
                  <Link
                    href="/settings"
                    className="px-6 py-3 bg-card/50 backdrop-blur-sm text-foreground rounded-lg border border-border/50 hover:border-primary/50 hover:bg-card transition-all duration-300 font-medium"
                  >
                    Settings
                  </Link>
                )}
                {onRefresh && (
                  <button
                    onClick={onRefresh}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium"
                  >
                    Refresh
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </section>
  )
}


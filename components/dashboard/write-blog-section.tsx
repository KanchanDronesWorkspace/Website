import React from 'react'
import Link from 'next/link'

export function WriteBlogSection() {
  return (
    <div className="space-y-6">
      <div className="bg-card/50 backdrop-blur-sm p-8 rounded-xl border border-border/50 text-center">
        <div className="w-16 h-16 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Ready to Write?</h3>
        <p className="text-muted-foreground mb-6">
          Use our powerful editor to create your next blog post with markdown support and live preview.
        </p>
        <Link
          href="/write-blog"
          className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Start Writing
        </Link>
      </div>

      <WritingTips />
    </div>
  )
}

function WritingTips() {
  const guidelines = [
    'Write clear and engaging headlines',
    'Use proper markdown formatting',
    'Include relevant tags',
    'Add a compelling excerpt'
  ]

  const practices = [
    'Proofread before submitting',
    'Use high-quality cover images',
    'Keep content relevant and valuable',
    'Follow company guidelines'
  ]

  return (
    <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50">
      <h3 className="text-lg font-semibold text-foreground mb-4">Writing Tips</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TipSection title="Content Guidelines" items={guidelines} />
        <TipSection title="Best Practices" items={practices} />
      </div>
    </div>
  )
}

interface TipSectionProps {
  title: string
  items: string[]
}

function TipSection({ title, items }: TipSectionProps) {
  return (
    <div className="space-y-2">
      <h4 className="font-medium text-foreground">{title}</h4>
      <ul className="text-sm text-muted-foreground space-y-1">
        {items.map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>
    </div>
  )
}


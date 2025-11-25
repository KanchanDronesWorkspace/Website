export const applyBlogColorScheme = () => {
  if (typeof window !== 'undefined') {
    const root = document.documentElement
    
    root.style.setProperty('--background', '#0f0f23')
    root.style.setProperty('--foreground', '#e2e8f0')
    root.style.setProperty('--primary', '#6366f1')
    root.style.setProperty('--primary-foreground', '#ffffff')
    root.style.setProperty('--border', '#334155')
    root.style.setProperty('--muted', '#1e293b')
    root.style.setProperty('--muted-foreground', '#94a3b8')
    root.style.setProperty('--accent', '#f59e0b')
    root.style.setProperty('--accent-foreground', '#ffffff')
    root.style.setProperty('--card', '#1e293b')
    root.style.setProperty('--card-foreground', '#e2e8f0')
  }
}
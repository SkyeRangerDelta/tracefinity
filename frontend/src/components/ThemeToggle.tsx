'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { Sun, Moon } from 'lucide-react'
import { IconButton } from '@/components/IconButton'

type Theme = 'dark' | 'light'

const listeners = new Set<() => void>()

function resolveTheme(): Theme {
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback)
  const mq = window.matchMedia('(prefers-color-scheme: light)')
  mq.addEventListener('change', callback)
  return () => {
    listeners.delete(callback)
    mq.removeEventListener('change', callback)
  }
}

// Server has no DOM/storage; render the default theme to match initial markup.
function getServerSnapshot(): Theme {
  return 'dark'
}

function setTheme(theme: Theme) {
  localStorage.setItem('theme', theme)
  applyTheme(theme)
  listeners.forEach((l) => l())
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, resolveTheme, getServerSnapshot)

  // Reflect the resolved theme onto the DOM: initial load and OS-preference changes.
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  function toggle() {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <IconButton onClick={toggle} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </IconButton>
  )
}

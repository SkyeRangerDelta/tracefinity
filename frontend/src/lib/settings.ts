import type { SnapMode } from './constants'

export interface UserSettings {
  bedSize: number
  snapMode: SnapMode
  autoArrange: boolean
  arrangeRotation: boolean
}

const DEFAULTS: UserSettings = {
  bedSize: 256,
  snapMode: 'fixed-5',
  autoArrange: false,
  arrangeRotation: true,
}
const KEY = 'tracefinity-settings'

export function getSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULTS
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULTS
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return DEFAULTS
  }
}

export function saveSettings(partial: Partial<UserSettings>): void {
  const current = getSettings()
  localStorage.setItem(KEY, JSON.stringify({ ...current, ...partial }))
}

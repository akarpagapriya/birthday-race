export interface GameConfig {
  id?: string
  slug: string
  child_name: string
  age: number
  theme_color: string
  created_at?: string
}

export interface WishConfig {
  id?: string
  game_id?: string
  stage: number
  from_name: string
  avatar: string
  short_wish: string
  full_wish?: string
  photo_url?: string
}

export interface BuilderState {
  // Step 1
  child_name: string
  age: number
  theme_color: string
  // Step 2-3: wishes per stage
  wishes: WishEntry[]
}

export interface WishEntry {
  stage: number
  from_name: string
  avatar: string
  short_wish: string
  photo_file?: File
  photo_preview?: string
}

export const AVATARS = ['👵','👩','👨','👦','👧','👶','🏠','❤️','🌟','🎉','🦁','🐯']
export const THEME_COLORS = [
  { label: 'Purple', value: '#9333ea' },
  { label: 'Pink',   value: '#ec4899' },
  { label: 'Blue',   value: '#3b82f6' },
  { label: 'Green',  value: '#22c55e' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Red',    value: '#ef4444' },
  { label: 'Gold',   value: '#f59e0b' },
  { label: 'Teal',   value: '#14b8a6' },
]

export interface GameConfig {
  id?: string
  slug: string
  child_name: string
  age: number
  car_color: string
  kid_photo_url?: string
  created_at?: string
}

export interface WishConfig {
  id?: string
  game_id?: string
  stage: number
  from_name: string
  avatar: string
  short_wish: string
  photo_url?: string
}

export interface BuilderState {
  child_name: string
  age: number
  car_color: string
  kid_photo_file?: File
  kid_photo_preview?: string
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

export const CAR_COLORS = [
  { label: 'Purple Rocket',  value: '#9333ea', emoji: '🟣' },
  { label: 'Red Lightning',  value: '#ef4444', emoji: '🔴' },
  { label: 'Blue Turbo',     value: '#3b82f6', emoji: '🔵' },
  { label: 'Gold Champion',  value: '#f59e0b', emoji: '🟡' },
  { label: 'Green Speeder',  value: '#22c55e', emoji: '🟢' },
  { label: 'Pink Blazer',    value: '#ec4899', emoji: '🩷' },
  { label: 'Teal Racer',     value: '#14b8a6', emoji: '🩵' },
  { label: 'Orange Flame',   value: '#f97316', emoji: '🟠' },
]

export const STEP_LABELS = [
  { icon: '🔑', title: 'IGNITION',     sub: "Who's the birthday champion?" },
  { icon: '💜', title: 'PIT CREW',     sub: 'Assemble your family wishes!' },
  { icon: '📸', title: 'PHOTO FINISH', sub: 'Add your faces to the gift boxes!' },
  { icon: '🚀', title: 'RACE DAY!',    sub: 'Lights out… and away we go!' },
]

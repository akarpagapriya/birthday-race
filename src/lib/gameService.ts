import { supabase } from './supabase'
import { BuilderState, WishEntry } from './types'

async function compressImage(file: File, maxWidth = 800): Promise<File> {
  return new Promise((resolve) => {
    const img = new window.Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width)
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(blob => {
        URL.revokeObjectURL(url)
        if (blob) {
          resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }))
        } else {
          resolve(file) // fallback to original if compression fails
        }
      }, 'image/jpeg', 0.72)
    }
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file) }
    img.src = url
  })
}
function generateSlug(name: string): string {
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  const year = new Date().getFullYear()
  const rand = Math.random().toString(36).slice(2, 6)
  return `${clean}-${year}-${rand}`
}



async function uploadPhoto(file: File, slug: string, name: string): Promise<string | null> {
  const compressed = await compressImage(file)
  const path = `${slug}/${name}.jpg`
  const { error } = await supabase.storage.from('photos').upload(path, compressed, { upsert: true, contentType: 'image/jpeg' })
  if (error) { console.error('Photo upload error:', error); return null }
  const { data } = supabase.storage.from('photos').getPublicUrl(path)
  return data.publicUrl
}

export async function saveGame(state: BuilderState): Promise<string | null> {
  try {
    const slug = generateSlug(state.child_name)

    // 30 second timeout — prevents hanging forever on slow mobile
    const timeout = new Promise<null>(resolve => setTimeout(() => resolve(null), 30000))
    const save = saveGameInner(state, slug)
    return await Promise.race([save, timeout])
  } catch (e) {
    console.error('saveGameInner error:', e)
    return null
  }
}

async function saveGameInner(state: BuilderState, slug: string): Promise<string | null> {
  try {

    // Upload kid photo if provided
    let kid_photo_url = null
    if (state.kid_photo_file) {
      kid_photo_url = await uploadPhoto(state.kid_photo_file, slug, 'kid')
    }

    // Insert game row
    const { data: game, error: gameError } = await supabase
      .from('games')
      .insert({
        slug,
        child_name: state.child_name,
        age: state.age,
        car_color: state.car_color,
        kid_photo_url,
      })
      .select()
      .single()

    if (gameError || !game) { console.error('Game insert error:', gameError); return null }

// Upload all wish photos in parallel for speed
    const wishRows = await Promise.all(
      state.wishes.map(async (w: WishEntry) => ({
        game_id: game.id,
        stage: w.stage,
        from_name: w.from_name,
        avatar: w.avatar,
        short_wish: w.short_wish,
        photo_url: w.photo_file
          ? await uploadPhoto(w.photo_file, slug, `stage-${w.stage}`)
          : null,
      }))
    )

    const { error: wishError } = await supabase.from('wishes').insert(wishRows)
    if (wishError) { console.error('Wishes insert error:', wishError); return null }

    return slug
  } catch (e) {
    console.error('saveGame error:', e)
    return null
  }
}

export async function loadGame(slug: string) {
  const { data: game, error: gameError } = await supabase
    .from('games')
    .select('*')
    .eq('slug', slug)
    .single()

  if (gameError || !game) return null

  const { data: wishes, error: wishError } = await supabase
    .from('wishes')
    .select('*')
    .eq('game_id', game.id)
    .order('stage', { ascending: true })

  if (wishError) return null

  return { game, wishes }
}

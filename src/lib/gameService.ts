import { supabase } from './supabase'
import { BuilderState, WishEntry } from './types'

function generateSlug(name: string): string {
  const clean = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  const year = new Date().getFullYear()
  const rand = Math.random().toString(36).slice(2, 6)
  return `${clean}-${year}-${rand}`
}

async function uploadPhoto(file: File, slug: string, name: string): Promise<string | null> {
  const ext = file.name.split('.').pop()
  const path = `${slug}/${name}.${ext}`
  const { error } = await supabase.storage.from('photos').upload(path, file, { upsert: true })
  if (error) { console.error('Photo upload error:', error); return null }
  const { data } = supabase.storage.from('photos').getPublicUrl(path)
  return data.publicUrl
}

export async function saveGame(state: BuilderState): Promise<string | null> {
  try {
    const slug = generateSlug(state.child_name)

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

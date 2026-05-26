import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

let client: SupabaseClient | null = null

export const supabase = (): SupabaseClient => {
  if (!url || !key) {
    throw new Error(
      'Supabase env vars are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local',
    )
  }
  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false },
    })
  }
  return client
}

export const hasSupabase = (): boolean => Boolean(url && key)

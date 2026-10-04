import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

/**
 * Satu-satunya tempat membuat Supabase client.
 * Kredensial dibaca dari .env (VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY).
 */
export function getSupabaseClient(): SupabaseClient | null {
  const w = window as any
  const url: string = w.SUPABASE_URL || ''
  const key: string = w.SUPABASE_PUBLISHABLE_KEY || ''
  if (!url || !key || url.includes('YOUR_PROJECT')) return null
  if (!client) {
    client = createClient(url, key, {
      auth: {
        // Session tetap bertahan saat halaman di-refresh.
        // Masa aktif aplikasi dikendalikan oleh last_seen + batas sesi 24 jam.
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }
  return client
}

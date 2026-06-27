import Constants from 'expo-constants'

const extra = Constants.expoConfig?.extra ?? {}

function normalizeSupabaseUrl(url: string): string {
  return url.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '')
}

export const config = {
  apiUrl:
    (extra.apiUrl as string) ||
    process.env.EXPO_PUBLIC_API_URL ||
    'http://10.0.2.2:3000',
  supabaseUrl: normalizeSupabaseUrl(
    (extra.supabaseUrl as string) ||
      process.env.EXPO_PUBLIC_SUPABASE_URL ||
      ''
  ),
  supabaseAnonKey:
    (extra.supabaseAnonKey as string) ||
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
    '',
}

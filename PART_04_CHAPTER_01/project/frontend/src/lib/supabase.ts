import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

export const signInWithKakao = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    console.error('Kakao login error:', error.message)
    throw error
  }

  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Sign out error:', error.message)
    throw error
  }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    console.error('Get user error:', error.message)
    return null
  }

  return user
}

export interface Profile {
  id: string
  name?: string
  phone?: string
  address?: string
  created_at: string
  updated_at: string
}

export const getProfile = async (): Promise<Profile | null> => {
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error('Authentication error:', authError?.message)
    return null
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Profile fetch error:', error.message)
    return null
  }

  return data
}

export const updateProfile = async (profileData: Partial<Pick<Profile, 'name' | 'phone' | 'address'>>): Promise<Profile> => {
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error('Authentication error:', authError?.message)
    throw authError || new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      ...profileData,
      updated_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error('Profile update error:', error.message)
    throw error
  }

  return data
}
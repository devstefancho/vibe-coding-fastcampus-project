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

export interface Like {
  id: number
  user_id: string
  product_id: string
  created_at: string
}

export const getLikedProducts = async (): Promise<string[]> => {
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return []
  }

  const { data, error } = await supabase
    .from('likes')
    .select('product_id')
    .eq('user_id', user.id)

  if (error) {
    console.error('Get liked products error:', error.message)
    return []
  }

  return data.map(like => like.product_id)
}

export const toggleLike = async (productId: string): Promise<boolean> => {
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  // 현재 좋아요 상태 확인
  const { data: existingLike, error: checkError } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .single()

  if (checkError && checkError.code !== 'PGRST116') {
    console.error('Check like error:', checkError.message)
    throw checkError
  }

  if (existingLike) {
    // 좋아요 제거
    const { error: deleteError } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId)

    if (deleteError) {
      console.error('Delete like error:', deleteError.message)
      throw deleteError
    }

    return false // 좋아요 제거됨
  } else {
    // 좋아요 추가
    const { error: insertError } = await supabase
      .from('likes')
      .insert({
        user_id: user.id,
        product_id: productId
      })

    if (insertError) {
      console.error('Insert like error:', insertError.message)
      throw insertError
    }

    return true // 좋아요 추가됨
  }
}

export const isProductLiked = async (productId: string): Promise<boolean> => {
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return false
  }

  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.error('Check if liked error:', error.message)
    return false
  }

  return !!data
}

export const getLikeCount = async (productId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact', head: true })
    .eq('product_id', productId)

  if (error) {
    console.error('Get like count error:', error.message)
    return 0
  }

  return count || 0
}
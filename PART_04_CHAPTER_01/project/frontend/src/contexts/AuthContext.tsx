'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, AuthError } from '@supabase/supabase-js'
import { supabase, signInWithKakao, signOut as supabaseSignOut, getCurrentUser, getProfile, updateProfile, Profile } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  profileLoading: boolean
  signInWithKakao: () => Promise<void>
  signOut: () => Promise<void>
  updateUserProfile: (profileData: Partial<Pick<Profile, 'name' | 'phone' | 'address'>>) => Promise<void>
  refreshProfile: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadProfile = async (userId: string) => {
    try {
      setProfileLoading(true)
      console.log('Loading profile for user:', userId)
      const userProfile = await getProfile()
      console.log('Profile loaded:', userProfile)
      setProfile(userProfile)
    } catch (err) {
      console.error('Error loading profile:', err)
      setProfile(null)
    } finally {
      setProfileLoading(false)
    }
  }

  useEffect(() => {
    const getSession = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
        if (currentUser) {
          await loadProfile(currentUser.id)
        }
      } catch (err) {
        console.error('Error getting current user:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          loadProfile(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignInWithKakao = async () => {
    try {
      setError(null)
      setLoading(true)
      await signInWithKakao()
    } catch (err) {
      console.error('Kakao login error:', err)
      setError(err instanceof Error ? err.message : 'Failed to sign in with Kakao')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setError(null)
      await supabaseSignOut()
      setUser(null)
      setProfile(null)
    } catch (err) {
      console.error('Sign out error:', err)
      setError(err instanceof Error ? err.message : 'Failed to sign out')
    }
  }

  const handleUpdateProfile = async (profileData: Partial<Pick<Profile, 'name' | 'phone' | 'address'>>) => {
    try {
      setError(null)
      setProfileLoading(true)
      const updatedProfile = await updateProfile(profileData)
      setProfile(updatedProfile)
    } catch (err) {
      console.error('Profile update error:', err)
      setError(err instanceof Error ? err.message : 'Failed to update profile')
      throw err
    } finally {
      setProfileLoading(false)
    }
  }

  const handleRefreshProfile = async () => {
    if (!user) return
    await loadProfile(user.id)
  }

  const value: AuthContextType = {
    user,
    profile,
    loading,
    profileLoading,
    signInWithKakao: handleSignInWithKakao,
    signOut: handleSignOut,
    updateUserProfile: handleUpdateProfile,
    refreshProfile: handleRefreshProfile,
    error
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
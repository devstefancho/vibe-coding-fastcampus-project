'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, AuthError } from '@supabase/supabase-js'
import { supabase, signInWithKakao, signOut as supabaseSignOut, getCurrentUser } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithKakao: () => Promise<void>
  signOut: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getSession = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
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
        } else {
          setUser(null)
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
    } catch (err) {
      console.error('Sign out error:', err)
      setError(err instanceof Error ? err.message : 'Failed to sign out')
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signInWithKakao: handleSignInWithKakao,
    signOut: handleSignOut,
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
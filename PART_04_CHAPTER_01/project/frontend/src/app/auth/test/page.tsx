'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function AuthTestPage() {
  const { user, loading, signInWithKakao, signOut, error } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            MyBestShoesShop Auth Test
          </h1>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {user ? (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-green-800 mb-2">
                  Welcome! You are signed in.
                </h2>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>User ID:</strong> {user.id}</p>
                  <p><strong>Email:</strong> {user.email || 'N/A'}</p>
                  <p><strong>Provider:</strong> {user.app_metadata.provider || 'Unknown'}</p>
                  {user.user_metadata && (
                    <div className="mt-2">
                      <p><strong>Name:</strong> {user.user_metadata.name || 'N/A'}</p>
                      {user.user_metadata.avatar_url && (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt="Profile"
                          className="w-12 h-12 rounded-full mt-2 mx-auto"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={signOut}
                className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-600">You are not signed in.</p>
              </div>

              <button
                onClick={signInWithKakao}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11L7.5 21l.847-2.735C4.764 16.942 1.5 14.107 1.5 11.185 1.5 6.664 6.201 3 12 3z"/>
                </svg>
                Sign in with Kakao
              </button>

              <div className="text-sm text-gray-500">
                <p>Test the Kakao OAuth integration by signing in above.</p>
                <p className="mt-2">This will redirect you to Kakao for authentication.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
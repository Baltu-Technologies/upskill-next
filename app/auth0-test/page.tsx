'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function Auth0TestContent() {
  const searchParams = useSearchParams()

  // Check for auth results in URL params
  const success = searchParams?.get('success')
  const error = searchParams?.get('error')
  const errorDescription = searchParams?.get('description')

  const handleLogin = (organization: string) => {
    const loginUrl = `/api/auth/login?organization=${organization}`
    window.location.href = loginUrl
  }

  const handleDirectLogin = () => {
    // Test direct login without organization (should use default)
    window.location.href = '/api/auth/login'
  }

  const handleLogout = () => {
    window.location.href = '/api/auth/logout'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Auth0 Employer Portal Test
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Test Auth0 Organizations integration
          </p>
          
          {/* Auth Status Messages */}
          {success && (
            <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              ✅ Login successful! Code received from Auth0.
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              ❌ Auth Error: {error}
              {errorDescription && (
                <div className="mt-2 text-sm">Description: {errorDescription}</div>
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <button
            onClick={() => handleLogin('org_ayHu5XNaTNHMasO5')}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            🏢 Login as Baltu Technologies
          </button>
          
          <button
            onClick={handleDirectLogin}
            className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            🔑 Login (Default Organization)
          </button>
          
          <button
            onClick={handleLogout}
            className="group relative w-full flex justify-center py-2 px-4 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            🚪 Logout
          </button>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Test Information:</h3>
            <div className="text-xs text-blue-600 space-y-1">
              <div><strong>Organization ID:</strong> org_ayHu5XNaTNHMasO5</div>
              <div><strong>Organization Name:</strong> baltu-technologies</div>
              <div><strong>Display Name:</strong> Baltu Technologies</div>
              <div><strong>Available Connections:</strong> Username-Password + Google OAuth2</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Auth0TestPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Auth0TestContent />
    </Suspense>
  )
}
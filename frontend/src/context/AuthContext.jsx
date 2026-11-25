import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import {
  GoogleAuthProvider,
  getAdditionalUserInfo,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth } from '../firebase'

const AuthContext = createContext(null)
const API_URL = import.meta.env.VITE_API_URL
const TOKEN_KEY = 'agrisense_token'
const NETWORK_ERROR = 'Cannot reach the server. Check your connection and the API URL configuration.'

if (!API_URL) console.error('VITE_API_URL is not set. Check your .env file and restart Vite.')

function mapGoogleUser(fbUser) {
  if (!fbUser) return null
  return {
    id: fbUser.uid,
    name: fbUser.displayName || fbUser.email?.split('@')[0] || '',
    email: fbUser.email || '',
    role: 'farmer',
    provider: 'google',
  }
}

// Reads the "exp" claim of the JWT so we can log out when it expires
function tokenExpiryMs(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return payload.exp ? payload.exp * 1000 : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [backendUser, setBackendUser] = useState(null)
  const [googleUser, setGoogleUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [backendLoading, setBackendLoading] = useState(true)
  const [googleLoading, setGoogleLoading] = useState(true)

  const user = backendUser ?? googleUser

  const clearBackendSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setBackendUser(null)
  }, [])

  // Restore session (GET /user). Only log out if the token is rejected.
  const fetchCurrentUser = useCallback(async (currentToken) => {
    try {
      const res = await fetch(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      })
      if (res.status === 401 || res.status === 403) {
        clearBackendSession()
        return false
      }
      if (!res.ok) throw new Error('could not load user')
      setBackendUser(await res.json())
      return true
    } catch {
      return false // network error: keep token, user can retry
    }
  }, [clearBackendSession])

  useEffect(() => {
    if (token) {
      fetchCurrentUser(token).finally(() => setBackendLoading(false))
    } else {
      setBackendLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setGoogleUser(mapGoogleUser(fbUser))
      setGoogleLoading(false)
    })
    return unsubscribe
  }, [])

  // Auto-logout when the backend token expires
  useEffect(() => {
    if (!token) return
    const exp = tokenExpiryMs(token)
    if (!exp) return
    const ms = exp - Date.now()
    if (ms <= 0) {
      clearBackendSession()
      return
    }
    const id = setTimeout(clearBackendSession, Math.min(ms, 2 ** 31 - 1))
    return () => clearTimeout(id)
  }, [token, clearBackendSession])

  const register = async ({ name, email, password }) => {
    const res = await fetchSafely(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password }),
    })
    const data = await readJson(res)
    if (!res.ok) throw new Error(parseError(data, 'Registration failed'))
    return data
  }

  const login = async ({ email, password }) => {
    const body = new URLSearchParams()
    body.append('username', email.trim().toLowerCase())
    body.append('password', password)

    const res = await fetchSafely(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
    const data = await readJson(res)
    if (!res.ok) throw new Error(parseError(data, 'Invalid email or password'))

    localStorage.setItem(TOKEN_KEY, data.access_token)
    setToken(data.access_token)
    const ok = await fetchCurrentUser(data.access_token)
    if (!ok) throw new Error('Login succeeded but your profile could not be loaded')
    return data
  }

  // The Firebase ID token is verified by the backend with Google before we
  // accept a backend session. localStorage alone is not proof of identity.
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, new GoogleAuthProvider())
    const idToken = await result.user.getIdToken()

    const res = await fetchSafely(`${API_URL}/api/auth/firebase`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_token: idToken }),
    })
    const data = await readJson(res)
    if (!res.ok) throw new Error(parseError(data, 'Google sign-in was rejected by the server'))

    localStorage.setItem(TOKEN_KEY, data.access_token)
    setToken(data.access_token)
    const ok = await fetchCurrentUser(data.access_token)
    if (!ok) throw new Error('Signed in with Google but your profile could not be loaded')

    setGoogleUser(mapGoogleUser(result.user))
    return { isNewUser: !!getAdditionalUserInfo(result)?.isNewUser, firebaseUser: result.user }
  }

  // Stable identity: Auth.jsx calls this from an effect with it in the deps.
  const verifyEmail = useCallback(async (verificationToken) => {
    const res = await fetchSafely(`${API_URL}/api/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: verificationToken }),
    })
    const data = await readJson(res)
    if (!res.ok) throw new Error(parseError(data, 'Could not verify this email link'))
    return data
  }, [])

  const forgotPassword = async (email) => {
    const res = await fetchSafely(`${API_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    })
    const data = await readJson(res)
    if (!res.ok) throw new Error(parseError(data, 'Could not send reset link'))
    return data
  }

  const resetPassword = async (resetToken, newPassword) => {
    const res = await fetchSafely(`${API_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: resetToken, new_password: newPassword }),
    })
    const data = await readJson(res)
    if (!res.ok) throw new Error(parseError(data, 'Could not reset your password'))
    return data
  }

  const logout = async () => {
    if (token) {
      try {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch {
        // server unreachable: still log out locally
      }
    }
    try {
      await firebaseSignOut(auth)
    } catch {
      // ignore
    }
    sessionStorage.removeItem('agrisense_new_user')
    clearBackendSession()
    setGoogleUser(null)
  }

  const logoutAll = async () => {
    if (token) {
      const res = await authFetch('/api/auth/logout-all', { method: 'POST' })
      if (!res.ok) {
        const data = await readJson(res)
        throw new Error(parseError(data, 'Could not sign out of all devices'))
      }
    }
    try {
      await firebaseSignOut(auth)
    } catch {
      // ignore
    }
    sessionStorage.removeItem('agrisense_new_user')
    clearBackendSession()
    setGoogleUser(null)
  }

  // Use for every protected API call (Farms, Soil Health, ...). 401 => auto logout.
  const authFetch = useCallback(async (path, options = {}) => {
    if (!token) throw new Error('Authentication required')
    const res = await fetchSafely(`${API_URL}${path}`, {
      ...options,
      headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` },
    })
    if (res.status === 401) clearBackendSession()
    return res
  }, [token, clearBackendSession])

  // Update own profile (name only)
  const updateProfile = async ({ name }) => {
    if (!backendUser) throw new Error('Profile editing needs an email/password account')
    const res = await authFetch(`/user/${backendUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() }),
    })
    const data = await readJson(res)
    if (!res.ok) throw new Error(parseError(data, 'Could not update profile'))
    setBackendUser(data)
    return data
  }

  // Change password, then force a fresh login (all old tokens are revoked)
  const changePassword = async ({ currentPassword, newPassword }) => {
    const res = await authFetch('/user/changepassword', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
    })
    const data = await readJson(res)
    if (!res.ok) throw new Error(parseError(data, 'Could not change password'))
    clearBackendSession()
    return data
  }

  const value = {
    user,
    token,
    loading: backendLoading || googleLoading,
    isAuthenticated: !!user,
    register,
    login,
    loginWithGoogle,
    verifyEmail,
    forgotPassword,
    resetPassword,
    logout,
    logoutAll,
    authFetch,
    updateProfile,
    changePassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

// The browser's native "Failed to fetch" message is not helpful to users.
async function fetchSafely(url, options) {
  try {
    return await fetch(url, options)
  } catch {
    throw new Error(NETWORK_ERROR)
  }
}

async function readJson(res) {
  const text = await res.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch {
    return { detail: text }
  }
}

// Handles FastAPI "detail" (string or 422 array) and the issue's { message } format
function parseError(data, fallback) {
  if (!data) return fallback
  if (typeof data.message === 'string') return data.message
  if (typeof data.detail === 'string') return data.detail
  if (Array.isArray(data.detail)) return data.detail.map((d) => d.msg).join(', ')
  return fallback
}

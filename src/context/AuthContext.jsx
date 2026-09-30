import React, { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)
const API_URL = import.meta.env.VITE_API_URL
const TOKEN_KEY = 'agrisense_token'

if (!API_URL) console.error('VITE_API_URL is not set. Check your .env file and restart Vite.')

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(true)

  const fetchCurrentUser = async (currentToken) => {
    try {
      const res = await fetch(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      })
      if (!res.ok) throw new Error('invalid session')
      const data = await res.json()
      setUser(data)
      return true
    } catch {
      localStorage.removeItem(TOKEN_KEY)
      setToken(null)
      setUser(null)
      return false
    }
  }

  useEffect(() => {
    if (token) {
      fetchCurrentUser(token).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Register: JSON
  const register = async ({ name, email, password }) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await readJson(res)
    if (!res.ok) throw new Error(parseError(data, 'Registration failed'))
    return data
  }

  // Login: form-urlencoded, field name is "username"
  const login = async ({ email, password }) => {
    const body = new URLSearchParams()
    body.append('username', email)
    body.append('password', password)

    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
    const data = await readJson(res)
    if (!res.ok) throw new Error(parseError(data, 'Login failed'))

    localStorage.setItem(TOKEN_KEY, data.access_token)
    setToken(data.access_token)
    await fetchCurrentUser(data.access_token)
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
    sessionStorage.removeItem('agrisense_new_user') // CHANGED: next login shows "WELCOME BACK"
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

// Reads the body as text first, then parses only if there is something to parse.
// Avoids "Unexpected end of JSON input" on empty responses.
async function readJson(res) {
  const text = await res.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch {
    return { detail: text }
  }
}

// FastAPI 422 errors return `detail` as an array, which would crash JSX.
// This turns any shape into plain text.
function parseError(data, fallback) {
  if (!data || !data.detail) return fallback
  if (typeof data.detail === 'string') return data.detail
  if (Array.isArray(data.detail)) return data.detail.map((d) => d.msg).join(', ')
  return fallback
}
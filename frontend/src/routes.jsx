import React, { useState } from 'react'
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'

import { Navbar, Sidebar } from './components/layout'
import { useAuth } from './context/AuthContext'

import { Home } from './pages/Home'
import { Auth } from './pages/Auth'
import { Dashboard } from './pages/Dashboard'
import { Farms } from './pages/Farms'
import { SoilHealth } from './pages/SoilHealth'
import { Weather } from './pages/Weather'
import { AIAdvisor } from './pages/AIAdvisor'
import { CropRecommendation } from './pages/CropRecommendation'
import { Notifications } from './pages/Notifications'
import { Profile } from './pages/Profile'
import { Settings } from './pages/Settings'
import { Contact } from './pages/Contact'
import { Workspace } from './pages/Workspace'
import { PrivacySecurity } from './pages/PrivacySecurity'
import { Admin } from './pages/Admin'

function PublicLayout({ theme, setTheme }) {
  return (
    <>
      <Navbar />
      <Outlet context={{ theme, setTheme }} />
    </>
  )
}

function AppLayout({ theme, setTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-cream dark:bg-[#0b1710]">
      <Sidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="lg:pl-72">
        <Navbar
          app
          setTheme={setTheme}
          onMenu={() => setMobileMenuOpen(true)}
        />

        <main className="min-w-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

// ADDED: Inazuia mtu asiyeingia kuona kurasa za ndani ya AppLayout.
// Haikagui isAuthenticated mpaka "loading" iwe false - vinginevyo
// mtumiaji aliyeingia kweli angerudishwa /auth kimakosa wakati wa
// refresh, kabla AuthContext haijamaliza kuthibitisha token yake.
function RequireAuth() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream dark:bg-[#0b1710]">
        <p className="text-sm font-bold text-slate-400">Loading…</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    // "state" inahifadhi ulikokuwa unaelekea, kwa matumizi ya baadaye
    // (mfano Auth.jsx ikitaka kukurudisha huko baada ya login)
    return <Navigate to="/auth" replace state={{ from: location }} />
  }

  return <Outlet />
}

// ADDED: Kinyume cha RequireAuth - mtu aliyeshaingia haoni fomu ya /auth
// tena (angeishia kuona "Login" bila maana baada ya kuwa kashalogin).
function RedirectIfAuthed() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return null
  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  return <Outlet />
}

// Admin page is hidden from regular farmers both in the menu and here.
function RequireAdmin() {
  const { isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream dark:bg-[#0b1710]">
        <p className="text-sm font-bold text-slate-400">Loading…</p>
      </div>
    )
  }

  if (!isAdmin) return <Navigate to="/dashboard" replace />

  return <Outlet />
}

export function AppRoutes({ theme, setTheme }) {
  return (
    <Routes>
      {/* PUBLIC PAGES - zinazofikika bila kuingia */}
      <Route
        element={
          <PublicLayout
            theme={theme}
            setTheme={setTheme}
          />
        }
      >
        <Route
          path="/"
          element={
            <Home
              theme={theme}
              setTheme={setTheme}
            />
          }
        />

        <Route
          path="/about"
          element={
            <Home
              focus="about"
              theme={theme}
              setTheme={setTheme}
            />
          }
        />

        <Route
          path="/solution"
          element={
            <Home
              focus="solution"
              theme={theme}
              setTheme={setTheme}
            />
          }
        />

        <Route path="/contact" element={<Contact />} />

        {/* CHANGED: /auth sasa iko ndani ya RedirectIfAuthed */}
        <Route element={<RedirectIfAuthed />}>
          <Route path="/auth" element={<Auth />} />
        </Route>
      </Route>

      {/* APP PAGES - zinahitaji kuingia */}
      <Route element={<RequireAuth />}>
        <Route
          element={
            <AppLayout
              theme={theme}
              setTheme={setTheme}
            />
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/farms" element={<Farms />} />
          <Route path="/soil-health" element={<SoilHealth />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/ai-advisor" element={<AIAdvisor />} />
          <Route path="/crop-recommendation" element={<CropRecommendation />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/settings"
            element={
              <Settings
                theme={theme}
                setTheme={setTheme}
              />
            }
          />
          <Route path="/privacy-security" element={<PrivacySecurity />} />

          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Route>
      </Route>

      {/* FALLBACK */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  )
}
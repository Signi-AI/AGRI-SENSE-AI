import React, { useState } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'

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

// Guards the app pages: waits for the session check, then allows or redirects
function ProtectedLayout({ theme, setTheme }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <p className="text-sm text-slate-500">Inapakia...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return <AppLayout theme={theme} setTheme={setTheme} />
}

export function AppRoutes({ theme, setTheme }) {
  return (
    <Routes>
      {/* PUBLIC PAGES */}
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

        <Route path="/auth" element={<Auth />} />
      </Route>

      {/* APP PAGES (protected) */}
      <Route
        element={
          <ProtectedLayout
            theme={theme}
            setTheme={setTheme}
          />
        }
      >
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/workspace"
          element={<Workspace />}
        />

        <Route
          path="/farms"
          element={<Farms />}
        />

        <Route
          path="/soil-health"
          element={<SoilHealth />}
        />

        <Route
          path="/weather"
          element={<Weather />}
        />

        <Route
          path="/ai-advisor"
          element={<AIAdvisor />}
        />

        <Route
          path="/crop-recommendation"
          element={<CropRecommendation />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/settings"
          element={
            <Settings
              theme={theme}
              setTheme={setTheme}
            />
          }
        />

        <Route
          path="/privacy-security"
          element={<PrivacySecurity />}
        />
      </Route>

      {/* FALLBACK */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  )
}
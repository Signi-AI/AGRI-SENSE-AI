import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { AppRoutes } from './routes'
import './index.css'
import { LanguageProvider } from './i18n'

function Root() {
  const [theme, setTheme] = useState(localStorage.getItem('agrisense-theme') || 'system')

  useEffect(() => {
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      document.documentElement.classList.toggle('dark', dark)
    }
    apply()
    localStorage.setItem('agrisense-theme', theme)
    if (theme !== 'system') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener?.('change', apply)
    return () => media.removeEventListener?.('change', apply)
  }, [theme])

  return <AppRoutes theme={theme} setTheme={setTheme} />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <Root />
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
)
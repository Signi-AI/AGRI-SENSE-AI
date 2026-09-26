import React from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'

export default function ThemeSelector({ theme, setTheme }) {
  const options = [
    {
      value: 'light',
      label: 'Light',
      icon: Sun,
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: Moon,
    },
    {
      value: 'system',
      label: 'System',
      icon: Monitor,
    },
  ]

  return (
    <div className="inline-flex items-center gap-1 rounded-2xl border border-white/20 bg-black/20 p-1.5 shadow-lg backdrop-blur-xl">
      {options.map(({ value, label, icon: Icon }) => {
        const active = theme === value

        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            title={label}
            aria-label={label}
            className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
              active
                ? 'bg-white text-forest shadow-md'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon size={16} />

            <span className="hidden sm:inline">
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
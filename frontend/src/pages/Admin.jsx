import React, { useCallback, useEffect, useState } from 'react'
import {
  ShieldCheck,
  Users,
  UserPlus,
  Trash2,
  Search,
  LoaderCircle,
} from 'lucide-react'
import { useLanguage } from '../i18n'
import { useAuth } from '../context/AuthContext'

const EMPTY_FORM = { name: '', email: '', password: '' }

export function Admin() {
  const { t } = useLanguage()
  const { authFetch, isAdmin } = useAuth()

  const [users, setUsers] = useState([])
  const [searchDraft, setSearchDraft] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [form, setForm] = useState(EMPTY_FORM)
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await authFetch(
        `/user/all?limit=100&search=${encodeURIComponent(search)}`
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(typeof data.detail === 'string' ? data.detail : t('loadFailed'))
      }
      setUsers((data.users || []).filter((u) => u.role !== 'admin'))
    } catch (err) {
      setError(err?.message || t('loadFailed'))
    } finally {
      setLoading(false)
    }
  }, [authFetch, search, t])

  useEffect(() => {
    if (isAdmin) load()
  }, [isAdmin, load])

  // The route also guards this, but keep the page safe on its own.
  if (!isAdmin) return null

  const handleAdd = async (e) => {
    e.preventDefault()
    setError('')
    setNotice('')

    if (
      form.password.length < 8 ||
      !/[A-Za-z]/.test(form.password) ||
      !/\d/.test(form.password)
    ) {
      setError(t('passwordHint'))
      return
    }

    setAdding(true)
    try {
      const res = await authFetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(typeof data.detail === 'string' ? data.detail : t('addFailed'))
      }
      setForm(EMPTY_FORM)
      setNotice(t('farmerAdded'))
      await load()
    } catch (err) {
      setError(err?.message || t('addFailed'))
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (user) => {
    if (!window.confirm(t('confirmDelete').replace('{name}', user.name))) return

    setError('')
    setNotice('')
    setDeletingId(user.id)
    try {
      const res = await authFetch(`/user/delete/${user.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(typeof data.detail === 'string' ? data.detail : t('deleteFailed'))
      }
      setNotice(t('farmerRemoved'))
      await load()
    } catch (err) {
      setError(err?.message || t('deleteFailed'))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className="neu-surface mx-auto max-w-7xl px-4 py-7 sm:px-8">
      {/* HEADER */}
      <div className="flex items-start gap-4">
        <div className="neu-raised-sm grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-[color:var(--neu-accent)]">
          <ShieldCheck size={22} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]">
            {t('admin')}
          </p>
          <h1 className="text-3xl font-extrabold text-[color:var(--neu-text)] sm:text-4xl">
            {t('adminDashboard')}
          </h1>
          <p className="mt-2 text-sm text-[color:var(--neu-muted)]">{t('adminDesc')}</p>
        </div>
      </div>

      {error && (
        <div role="alert" className="neu-inset mt-5 rounded-2xl px-4 py-3 text-sm text-red-600 dark:text-red-300">
          {error}
        </div>
      )}
      {notice && (
        <div role="status" className="neu-inset mt-5 rounded-2xl px-4 py-3 text-sm text-[color:var(--neu-accent-dark)]">
          {notice}
        </div>
      )}

      <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* FARMERS LIST */}
        <section className="min-w-0">
          <div className="neu-raised rounded-3xl p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-[color:var(--neu-accent)]" />
                <h2 className="text-lg font-extrabold text-[color:var(--neu-text)]">
                  {t('farmers')}
                </h2>
                <span className="neu-inset rounded-full px-2.5 py-1 text-xs font-bold text-[color:var(--neu-muted)]">
                  {t('totalFarmers')}: {users.length}
                </span>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  setSearch(searchDraft.trim())
                }}
                className="flex items-center gap-2"
              >
                <div className="neu-inset flex items-center gap-2 rounded-xl px-3">
                  <Search size={15} className="text-[color:var(--neu-muted)]" />
                  <input
                    aria-label={t('searchFarmers')}
                    value={searchDraft}
                    onChange={(e) => setSearchDraft(e.target.value)}
                    placeholder={t('searchFarmers')}
                    className="h-10 w-40 bg-transparent text-sm outline-none sm:w-56"
                  />
                </div>
                <button
                  type="submit"
                  className="neu-raised-sm rounded-xl px-3 py-2 text-xs font-bold text-[color:var(--neu-accent-dark)]"
                >
                  {t('search')}
                </button>
              </form>
            </div>

            <div className="mt-5 overflow-x-auto">
              {loading ? (
                <p className="flex items-center gap-2 py-8 text-sm text-[color:var(--neu-muted)]">
                  <LoaderCircle size={16} className="animate-spin" /> {t('loading')}
                </p>
              ) : users.length === 0 ? (
                <p className="py-8 text-sm text-[color:var(--neu-muted)]">{t('noFarmers')}</p>
              ) : (
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide text-[color:var(--neu-muted)]">
                    <tr>
                      <th className="pb-3 font-bold">{t('fullName')}</th>
                      <th className="pb-3 font-bold">{t('email')}</th>
                      <th className="pb-3 font-bold">{t('createdAt')}</th>
                      <th className="pb-3 font-bold">{t('action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-t border-emerald-900/10 dark:border-white/10">
                        <td className="py-3 font-semibold text-[color:var(--neu-text)]">{user.name}</td>
                        <td className="py-3 text-[color:var(--neu-muted)]">{user.email}</td>
                        <td className="py-3 text-[color:var(--neu-muted)]">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-3">
                          <button
                            type="button"
                            disabled={deletingId === user.id}
                            onClick={() => handleDelete(user)}
                            className="neu-raised-sm inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-red-600 disabled:opacity-60 dark:text-red-300"
                          >
                            {deletingId === user.id ? (
                              <LoaderCircle size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                            {deletingId === user.id ? t('deleting') : t('delete')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </section>

        {/* ADD FARMER */}
        <aside>
          <form onSubmit={handleAdd} className="neu-raised rounded-3xl p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <UserPlus size={18} className="text-[color:var(--neu-accent)]" />
              <h2 className="text-lg font-extrabold text-[color:var(--neu-text)]">
                {t('addFarmer')}
              </h2>
            </div>
            <p className="mt-1 text-xs text-[color:var(--neu-muted)]">{t('addFarmerDesc')}</p>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]">
                  {t('fullName')}
                </span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="neu-inset h-12 w-full rounded-2xl px-4 text-sm outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]">
                  {t('email')}
                </span>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="neu-inset h-12 w-full rounded-2xl px-4 text-sm outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-[color:var(--neu-muted)]">
                  {t('password')}
                </span>
                <input
                  required
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="neu-inset h-12 w-full rounded-2xl px-4 text-sm outline-none"
                />
                <span className="mt-1 block text-[11px] text-[color:var(--neu-muted)]">
                  {t('passwordHint')}
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={adding}
              className="neu-raised-sm neu-pressable mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[color:var(--neu-accent)] px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
            >
              {adding ? (
                <>
                  <LoaderCircle size={16} className="animate-spin" /> {t('adding')}
                </>
              ) : (
                <>
                  <UserPlus size={16} /> {t('addFarmer')}
                </>
              )}
            </button>
          </form>
        </aside>
      </div>
    </main>
  )
}

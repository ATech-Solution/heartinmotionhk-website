'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function ResetPasswordForm() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token) { setError('Invalid or missing reset token.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.errors?.[0]?.message ?? 'Failed to reset password.')
      }
      setSuccess(true)
      setTimeout(() => router.push('/admin'), 2000)
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-beige flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <h1 className="font-display text-4xl text-brand-dark mb-2">Reset Password</h1>
        <p className="text-brand-dark/60 text-sm mb-8">Enter a new password for your account.</p>

        {success ? (
          <div className="bg-brand-teal/10 border border-brand-teal rounded-2xl p-6 text-center">
            <p className="text-brand-teal font-semibold">Password reset successfully!</p>
            <p className="text-sm text-brand-dark/60 mt-1">Redirecting to admin…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-card p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-2.5 border border-brand-beige-dark rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-brand-beige-dark rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal/40"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-brand-teal text-white rounded-full font-semibold text-sm hover:bg-brand-teal-dark transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Resetting…' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}

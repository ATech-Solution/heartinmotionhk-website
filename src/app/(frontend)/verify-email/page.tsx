'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function VerifyEmailContent() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get('token')

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      setMessage('Invalid or missing verification token.')
      return
    }

    fetch(`/api/users/verify/${token}`, { method: 'POST' })
      .then(async (res) => {
        if (res.ok) {
          setStatus('success')
          setTimeout(() => router.push('/admin'), 2500)
        } else {
          const data = await res.json().catch(() => ({}))
          setStatus('error')
          setMessage(data?.errors?.[0]?.message ?? 'Verification failed. The link may have expired.')
        }
      })
      .catch(() => {
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
      })
  }, [token, router])

  return (
    <div className="min-h-screen bg-brand-beige flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md text-center">
        <h1 className="font-display text-4xl text-brand-dark mb-4">Email Verification</h1>

        {status === 'verifying' && (
          <p className="text-brand-dark/60 text-sm">Verifying your email address…</p>
        )}

        {status === 'success' && (
          <div className="bg-brand-teal/10 border border-brand-teal rounded-2xl p-6">
            <p className="text-brand-teal font-semibold">Email verified successfully!</p>
            <p className="text-sm text-brand-dark/60 mt-1">Redirecting to admin…</p>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <p className="text-red-600 font-semibold">Verification failed</p>
            <p className="text-sm text-red-500 mt-1">{message}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  )
}

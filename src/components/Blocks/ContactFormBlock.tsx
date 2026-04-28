'use client'

import { useState } from 'react'
import { MediaImage } from '@/components/ui/MediaImage'

interface Field {
  name: string
  label?: string
  blockType: string
  required?: boolean
  width?: number
}

interface Form {
  id?: string
  title?: string
  fields?: Field[]
  submitButtonLabel?: string
}

interface ContactFormBlockProps {
  heading?: string
  subheading?: string
  sideImage?: any
  form?: Form | string | null
}

export function ContactFormBlockComponent({ heading, subheading, sideImage, form }: ContactFormBlockProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formObj = typeof form === 'object' && form !== null ? form : null

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!formObj?.id) return
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const submissionData: Array<{ field: string; value: string }> = []
    formData.forEach((value, key) => {
      submissionData.push({ field: key, value: String(value) })
    })

    try {
      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: formObj.id, submissionData }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-16 px-6 md:px-16 md:pb-[50px] bg-white">
      <div className="max-w-[1100px] mx-auto">
        {heading && (
          <h1 className="font-display text-[32px] md:text-[48px] text-black leading-[1.5] mb-2 md:mb-2">{heading}</h1>
        )}
        {subheading && (
          <p className="text-[16px] text-black leading-[1.5] mb-10 max-w-2xl">{subheading}</p>
        )}
        <div className="bg-white rounded-3xl shadow-card-contact p-8 md:p-6 md:pb-12 grid md:grid-cols-[385px_1fr] gap-10 items-start">
          {sideImage && (
            <div className="rounded-2xl overflow-hidden bg-brand-teal/10">
              <MediaImage media={sideImage} className="w-full h-full object-contain" />
            </div>
          )}
          <div>
            {submitted ? (
              <div className="text-center py-12">
                <p className="font-display text-[16px] text-brand-teal mb-3">Thank you!</p>
                <p className="text-brand-dark/60">Your message has been sent. We&apos;ll be in touch soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[16px] font-medium text-brand-dark mb-1.5">
                      Full Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      name="fullName"
                      type="text"
                      required
                      className="w-full px-4 py-2.5 border border-brand-beige-dark rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-brand-teal/40 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[16px] font-medium text-brand-dark mb-1.5">
                      Email Address<span className="text-red-500">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full px-4 py-2.5 border border-brand-beige-dark rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-brand-teal/40 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[16px] font-medium text-brand-dark mb-1.5">
                      Phone Number<span className="text-red-500">*</span>
                    </label>
                    <input
                      name="phone"
                      type="tel"
                      required
                      className="w-full px-4 py-2.5 border border-brand-beige-dark rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-brand-teal/40 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[16px] font-medium text-brand-dark mb-1.5">
                      Subject<span className="text-red-500">*</span>
                    </label>
                    <input
                      name="subject"
                      type="text"
                      required
                      className="w-full px-4 py-2.5 border border-brand-beige-dark rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-brand-teal/40 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[16px] font-medium text-brand-dark mb-1.5">
                    Tell us how we can help
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    className="w-full px-4 py-2.5 border border-brand-beige-dark rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-brand-teal/40 transition resize-none"
                  />
                </div>
                {error && <p className="text-red-500 text-[16px]">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-[320px] px-8 py-3 bg-brand-teal text-white rounded-full font-semibold text-[16px] hover:bg-brand-teal-dark transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? 'Sending…' : 'Submit'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

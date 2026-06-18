'use client'

import { useState } from 'react'
import { MediaImage } from '@/components/ui/MediaImage'

interface FormLabels {
  fullName?: string
  email?: string
  phone?: string
  subject?: string
  message?: string
  submit?: string
  sending?: string
  successTitle?: string
  successMessage?: string
  errorMessage?: string
  validationRequired?: string
  validationEmail?: string
  validationPhone?: string
}

interface ContactFormBlockProps {
  heading?: string
  subheading?: string
  sideImage?: any
  formLabels?: FormLabels
  [key: string]: any
}

export function ContactFormBlockComponent({ heading, subheading, sideImage, formLabels }: ContactFormBlockProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const L: Required<FormLabels> = {
    fullName:            formLabels?.fullName            || 'Full Name',
    email:               formLabels?.email               || 'Email Address',
    phone:               formLabels?.phone               || 'Phone Number',
    subject:             formLabels?.subject             || 'Subject',
    message:             formLabels?.message             || 'Tell us how we can help',
    submit:              formLabels?.submit              || 'Submit',
    sending:             formLabels?.sending             || 'Sending…',
    successTitle:        formLabels?.successTitle        || 'Thank you!',
    successMessage:      formLabels?.successMessage      || "Your message has been sent. We'll be in touch soon.",
    errorMessage:        formLabels?.errorMessage        || 'Something went wrong. Please try again.',
    validationRequired:  formLabels?.validationRequired  || 'This field is required.',
    validationEmail:     formLabels?.validationEmail     || 'Please enter a valid email address.',
    validationPhone:     formLabels?.validationPhone     || 'Please enter a valid phone number.',
  }

  // Helpers to wire translated validation messages into browser native validation
  function onRequired(e: React.InvalidEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.setCustomValidity(L.validationRequired)
  }
  function onEmailInvalid(e: React.InvalidEvent<HTMLInputElement>) {
    e.currentTarget.setCustomValidity(
      e.currentTarget.validity.valueMissing ? L.validationRequired : L.validationEmail,
    )
  }
  function onPhoneInvalid(e: React.InvalidEvent<HTMLInputElement>) {
    e.currentTarget.setCustomValidity(
      e.currentTarget.validity.valueMissing ? L.validationRequired : L.validationPhone,
    )
  }
  // Clear custom validity so it re-evaluates on next submit attempt
  function clearValidity(e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) {
    e.currentTarget.setCustomValidity('')
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const payload: Record<string, string> = {}
    formData.forEach((value, key) => { payload[key] = String(value) })

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch {
      setError(L.errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-white px-8 pt-3 pb-13 md:px-16 md:py-10 md:pb-[100px]">
      <div className="max-w-[1200px] mx-auto">
        {heading && (
          <h1 className="font-display text-[32px] md:text-[48px] text-black leading-[1.5] mb-2 md:mb-2">{heading}</h1>
        )}
        {subheading && (
          <p className="text-[14px] md:text-[16px] text-black leading-[1.5] mb-10 max-w-2xl">{subheading}</p>
        )}
        <div className="bg-white rounded-3xl shadow-card-contact p-8 md:p-8 md:pb-12 grid lg:grid-cols-[385px_1fr] gap-10 items-start">
          {sideImage && (
            <div className="rounded-2xl overflow-hidden">
              <MediaImage media={sideImage} className="w-full h-full object-contain" />
            </div>
          )}
          <div>
            {submitted ? (
              <div className="text-center py-12 mt-[8%] md:mt-[12%]">
                <h2 className="font-display text-[32px] md:text-[40] text-brand-teal mb-3">{L.successTitle}</h2>
                <p className="text-black">{L.successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-fullName" className="block text-[14px] md:text-[16px] font-medium text-black mb-1.5">
                      {L.fullName}<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-fullName"
                      name="fullName"
                      type="text"
                      required
                      onInvalid={onRequired}
                      onInput={clearValidity}
                      className="w-full px-4 py-2.5 border border-brand-beige-dark rounded-xl text-[14px] md:text-[16px] focus:outline-none focus:ring-2 focus:ring-brand-teal/40 transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-[14px] md:text-[16px] font-medium text-black mb-1.5">
                      {L.email}<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      onInvalid={onEmailInvalid}
                      onInput={clearValidity}
                      className="w-full px-4 py-2.5 border border-brand-beige-dark rounded-xl text-[14px] md:text-[16px] focus:outline-none focus:ring-2 focus:ring-brand-teal/40 transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="block text-[14px] md:text-[16px] font-medium text-black mb-1.5">
                      {L.phone}<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      required
                      onInvalid={onPhoneInvalid}
                      onInput={clearValidity}
                      className="w-full px-4 py-2.5 border border-brand-beige-dark rounded-xl text-[14px] md:text-[16px] focus:outline-none focus:ring-2 focus:ring-brand-teal/40 transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-subject" className="block text-[14px] md:text-[16px] font-medium text-black mb-1.5">
                      {L.subject}<span className="text-red-500">*</span>
                    </label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      required
                      onInvalid={onRequired}
                      onInput={clearValidity}
                      className="w-full px-4 py-2.5 border border-brand-beige-dark rounded-xl text-[14px] md:text-[16px] focus:outline-none focus:ring-2 focus:ring-brand-teal/40 transition"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-[14px] md:text-[16px] font-medium text-black mb-1.5">
                    {L.message}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    className="w-full px-4 py-2.5 border border-brand-beige-dark rounded-xl text-[14px] md:text-[16px] focus:outline-none focus:ring-2 focus:ring-brand-teal/40 transition resize-none"
                  />
                </div>
                {error && <p className="text-red-500 text-[14px] md:text-[16px]">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-[320px] px-8 py-3 bg-[#8ec0bd] text-black rounded-[20px] font-semibold text-[14px] md:text-[16px] hover:text-white hover:bg-[#6C9A97] transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? L.sending : L.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

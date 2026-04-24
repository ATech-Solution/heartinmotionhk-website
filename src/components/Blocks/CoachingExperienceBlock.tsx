'use client'

import { useState } from 'react'
import { RichText } from '@/components/ui/RichText'

interface Certification {
  title?: string
  institution?: string
  year?: string
}

interface AccordionItem {
  title?: string
  content?: any
}

interface CoachingExperienceBlockProps {
  heading?: string
  certifications?: Certification[]
  accordionItems?: AccordionItem[]
}

function AccordionRow({ title, content }: AccordionItem) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-brand-beige-dark">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center py-4 text-left text-brand-dark font-medium hover:text-brand-teal transition-colors duration-200"
        aria-expanded={open}
      >
        <span>{title}</span>
        <span className={`text-xl transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>›</span>
      </button>
      {open && content && (
        <div className="pb-4">
          <RichText content={content} className="text-brand-dark/70 text-sm leading-relaxed" />
        </div>
      )}
    </div>
  )
}

export function CoachingExperienceBlockComponent({
  heading,
  certifications,
  accordionItems,
}: CoachingExperienceBlockProps) {
  return (
    <section className="py-14 px-6 md:px-16 bg-brand-beige">
      <div className="max-w-4xl mx-auto">
        {heading && (
          <h2 className="font-display text-3xl md:text-4xl text-brand-dark mb-8">{heading}</h2>
        )}
        {certifications && certifications.length > 0 && (
          <div className="mb-10 space-y-3">
            {certifications.map((cert, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="w-2 h-2 mt-2 rounded-full bg-brand-teal flex-shrink-0" />
                <div>
                  <p className="font-semibold text-brand-dark">{cert.title}</p>
                  {(cert.institution || cert.year) && (
                    <p className="text-sm text-brand-dark/60">
                      {[cert.institution, cert.year].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {accordionItems && accordionItems.length > 0 && (
          <div>
            {accordionItems.map((item, i) => (
              <AccordionRow key={i} title={item.title} content={item.content} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

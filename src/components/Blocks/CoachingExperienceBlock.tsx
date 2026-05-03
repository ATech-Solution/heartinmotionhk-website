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

export function CoachingExperienceBlockComponent({
  heading,
  certifications,
  accordionItems,
}: CoachingExperienceBlockProps) {
  return (
    <section className="px-8 py-3 md:px-16 md:py-25 bg-white">
      <div className="max-w-[1200px] mx-auto">
        {heading && (
          <h2 className="font-display text-[32px] md:text-[40px] text-black mb-3">{heading}</h2>
        )}
        {/* {certifications && certifications.length > 0 && (
          <div className="mb-10 space-y-3">
            {certifications.map((cert, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="w-2 h-2 mt-2 rounded-full flex-shrink-0" />
                <div>
                  <p className="font-semibold text-black">{cert.title}</p>
                  {(cert.institution || cert.year) && (
                    <p className="text-sm text-black">
                      {[cert.institution, cert.year].filter(Boolean).join(' · ')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )} */}
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


function AccordionRow({ title, content }: AccordionItem) {
  const [open, setOpen] = useState(false)

  return (
    <div className="px-3 py-3 mb-5 rounded-[8px] shadow-[0px_0px_4px_rgba(0,0,0,0.40)]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center"
        aria-expanded={open}
      >
        <span className='text-left text-[16px] md:text-[20px] text-black font-bold'>{title}</span>
        <span className={`text-[25px] transition-transform duration-200 ${open ? 'rotate-90' : ''}`}>
          <img src="/icon/angle-right.svg" alt="" className="w-[20px] h-[20px] text-black" aria-hidden="true" />
        </span>
      </button>
      {open && content && (
        <div className="pl-2 pr-5 pt-7 pb-0">
          <RichText content={content} className="text-[14px] md:text-[16px] text-black" />
        </div>
      )}
    </div>
  )
}
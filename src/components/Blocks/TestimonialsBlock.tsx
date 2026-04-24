'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useCallback } from 'react'

interface Testimonial {
  id?: string
  quote?: string
  authorName?: string
  authorTitle?: string
  authorCompany?: string
}

interface TestimonialsBlockProps {
  heading?: string
  testimonials?: Testimonial[]
}

export function TestimonialsBlockComponent({ heading, testimonials }: TestimonialsBlockProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  if (!testimonials || testimonials.length === 0) return null

  return (
    <section className="py-16 px-6 md:px-16 bg-brand-beige-dark">
      <div className="max-w-4xl mx-auto">
        {heading && (
          <h2 className="font-display text-3xl text-brand-dark mb-10 text-center">{heading}</h2>
        )}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((t, i) => (
                <div key={t.id ?? i} className="flex-[0_0_100%] min-w-0 px-4">
                  <blockquote className="bg-white rounded-3xl p-8 md:p-12 shadow-card text-center">
                    {t.quote && (
                      <p className="text-brand-dark/80 text-base md:text-lg leading-relaxed italic mb-6">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    )}
                    <footer>
                      {t.authorName && (
                        <p className="font-semibold text-brand-dark">{t.authorName}</p>
                      )}
                      {(t.authorTitle || t.authorCompany) && (
                        <p className="text-sm text-brand-dark/60 mt-1">
                          {[t.authorTitle, t.authorCompany].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </footer>
                  </blockquote>
                </div>
              ))}
            </div>
          </div>
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={scrollPrev}
                className="w-10 h-10 rounded-full border-2 border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white transition-colors duration-200 flex items-center justify-center font-bold"
                aria-label="Previous testimonial"
              >
                ‹
              </button>
              <button
                onClick={scrollNext}
                className="w-10 h-10 rounded-full border-2 border-brand-teal text-brand-teal hover:bg-brand-teal hover:text-white transition-colors duration-200 flex items-center justify-center font-bold"
                aria-label="Next testimonial"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

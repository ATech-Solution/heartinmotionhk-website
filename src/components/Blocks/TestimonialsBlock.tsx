'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useCallback, useEffect, useState } from 'react'

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
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi])

  if (!testimonials || testimonials.length === 0) return null

  return (
    <section className="bg-[#f5eded] py-16 px-[52px] md:px-12">
      <div className="max-w-[1444px] mx-auto">
        {heading && (
          <h2 className="font-display text-[28px] md:text-[36px] text-black text-center mb-10">
            {heading}
          </h2>
        )}

        <div className="relative flex items-center gap-4">
          {/* Prev arrow */}
          {testimonials.length > 1 && (
            <button
              onClick={scrollPrev}
              aria-label="Previous testimonial"
              className="flex-shrink-0 text-[28px] text-black/40 hover:text-black transition-colors"
            >
              ‹
            </button>
          )}

          {/* Carousel */}
          <div className="overflow-hidden flex-1" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((t, i) => (
                <div key={t.id ?? i} className="flex-[0_0_100%] min-w-0">
                  <div className="flex flex-col items-center gap-4 px-4">
                    {t.quote && (
                      <p className="font-body text-[16px] md:text-[20px] text-black text-center leading-normal max-w-[824px]">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                    )}
                    {(t.authorName || t.authorTitle || t.authorCompany) && (
                      <p className="font-bold text-[14px] md:text-[16px] text-black text-center">
                        {[
                          t.authorName ? `- ${t.authorName}` : null,
                          t.authorTitle,
                          t.authorCompany,
                        ]
                          .filter(Boolean)
                          .join(', ')}
                        {' -'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next arrow */}
          {testimonials.length > 1 && (
            <button
              onClick={scrollNext}
              aria-label="Next testimonial"
              className="flex-shrink-0 text-[28px] text-black/40 hover:text-black transition-colors"
            >
              ›
            </button>
          )}
        </div>

        {/* Dot indicators */}
        {testimonials.length > 1 && (
          <div className="flex justify-center gap-[4px] mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className="p-0 border-none bg-transparent"
              >
                <span
                  className={`block rounded-full transition-colors duration-200 ${
                    i === selectedIndex
                      ? 'bg-black w-[10px] h-[10px]'
                      : 'bg-black/30 w-[10px] h-[10px]'
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

'use client'

import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useCallback, useEffect, useState } from 'react'
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll'

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
  // heading = heading || 'What my clients say'
  return (
    <section className="bg-white py-13 md:pt-8 md:pb-16 px-8 md:px-16">
      <div className="max-w-[1337px] mx-auto">

        {/* Decorative horizontal gradient line — desktop only */}
        <AnimateOnScroll animation="fade" className="hidden md:block">
          <div className="w-full h-[2px] mb-10 rounded-full"/>
        </AnimateOnScroll>

        {heading && (
          <AnimateOnScroll animation="fade-up">
            <h2 className="font-display text-[28px] md:text-[36px] text-black text-center mb-6 md:mb-10">
              {heading}
            </h2>
          </AnimateOnScroll>
        )}

        <AnimateOnScroll animation="fade-up" delay={100}>
          <div className="relative flex items-center gap-2 md:gap-4 lg:w-[870px] mx-auto">
            {/* Prev arrow — desktop only */}
            {testimonials.length > 1 && (
              <button
                onClick={scrollPrev}
                aria-label="Previous testimonial"
                className="hidden md:flex flex-shrink-0 w-[44px] h-[44px] items-center justify-center hover:opacity-60 transition-opacity"
              >
                <img src="icon/angle-right.svg" alt="" className="rotate-[180deg] hover:rotate-[180deg] w-[25px] h-[25px]" aria-hidden="true" />
              </button>
            )}

            {/* Carousel viewport */}
            <div className="overflow-hidden flex-1" ref={emblaRef}>
              <div className="flex">
                {testimonials.map((t, i) => (
                  <div key={t.id ?? i} className="flex-[0_0_100%] min-w-0">
                    <div className="flex flex-col items-center gap-3 md:gap-4 px-0 md:px-4">
                      {t.quote && (
                        <p className="font-body text-[16px] md:text-[16px] md:text-[20px] text-black text-center leading-normal max-w-[790px]">
                          &ldquo;{t.quote}&rdquo;
                        </p>
                      )}
                      {(t.authorName || t.authorTitle || t.authorCompany) && (
                        <p className="font-bold text-[14px] md:text-[16px] text-[14px] md:text-[16px] text-black text-center">
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

            {/* Next arrow — desktop only */}
            {testimonials.length > 1 && (
              <button
                onClick={scrollNext}
                aria-label="Next testimonial"
                className="hidden md:flex flex-shrink-0 w-[44px] h-[44px] items-center justify-center hover:opacity-60 transition-opacity"
              >
                <img src="icon/angle-right.svg" alt="" className="w-[25px] h-[25px]" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Dot indicators */}
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-[15px] mt-15 md:mt-10">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className="p-0 border-none bg-transparent"
                >
                  <span
                    className={`block rounded-full transition-colors duration-200 w-[10.4px] h-[10.4px] ${
                      i === selectedIndex ? 'bg-black' : 'bg-black/30'
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </AnimateOnScroll>

      </div>
    </section>
  )
}

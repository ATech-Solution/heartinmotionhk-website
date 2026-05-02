'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { MediaImage } from '@/components/ui/MediaImage'
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll'
import Link from 'next/link'

interface Service {
  id?: string
  title?: string
  category?: string
  image?: any
  description?: any
  bulletPoints?: Array<{ point: string }>
}

interface ServicesOverviewBlockProps {
  heading?: string
  subheading?: string
  services?: Service[]
  ctaLabel?: string
  ctaUrl?: string
}

/* Blob background colours matching the Figma — pink, teal, blue */
const blobColors = ['#eb9097', '#8ec0bd', '#4fb4df']

export function ServicesOverviewBlockComponent({
  heading,
  subheading,
  services,
  ctaLabel,
  ctaUrl,
}: ServicesOverviewBlockProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: 'start' })

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    return () => { emblaApi.off('select', onSelect) }
  }, [emblaApi])

  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi])

  if (!services || services.length === 0) return null

  return (
    <section className="bg-[#fff5ce] pt-[55px] pb-[55px] px-4 md:px-[52px]">
      <div className="max-w-[1200px] mx-auto">

        {/* Section heading */}
        {heading && (
          <AnimateOnScroll animation="fade-up">
            <h2 className="font-display text-[32px] md:text-[48px] text-black text-center leading-[1.5] mb-3">
              {heading}
            </h2>
          </AnimateOnScroll>
        )}
        {subheading && (
          <AnimateOnScroll animation="fade-up" delay={100}>
            <p className="text-[16px] md:text-[16px] text-[#3f3e3e] text-center leading-[1.5] max-w-[729px] mx-auto mb-13">
              {subheading}
            </p>
          </AnimateOnScroll>
        )}

        {/* Mobile — horizontal scroll carousel with dot indicators */}
        <div className="md:hidden">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {services.map((svc, i) => (
                <div key={svc.id ?? i} className="flex-[0_0_100%] min-w-0">
                  <AnimateOnScroll animation="fade-up" delay={i * 100}>
                    <ServiceCard svc={svc} blobColor={blobColors[i % blobColors.length]} />
                  </AnimateOnScroll>
                </div>
              ))}
            </div>
          </div>

          {/* Dot indicators */}
          {services.length > 1 && (
            <div className="flex justify-center gap-[4px] mt-4 mb-13">
              {services.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  aria-label={`Go to service ${i + 1}`}
                  className="p-0 border-none bg-transparent"
                >
                  <span
                    className={`block rounded-full transition-colors duration-200 w-[10px] h-[10px] ${
                      i === selectedIndex ? 'bg-black' : 'bg-black/30'
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop — 3-column flex */}
        <div className="hidden md:flex gap-8 lg:gap-20">
          {services.map((svc, i) => (
            <AnimateOnScroll key={svc.id ?? i} animation="fade-up" delay={i * 120} className="flex-1 max-w-[345px]">
              <ServiceCard svc={svc} blobColor={blobColors[i % blobColors.length]} />
            </AnimateOnScroll>
          ))}
        </div>

        {/* CTA button */}
        {ctaLabel && ctaUrl && (
          <AnimateOnScroll animation="fade-up" delay={200} className="mt-3 flex justify-center group transition-all duration-300">
            <Link
              href={ctaUrl}
              className="inline-flex items-center justify-center gap-4 h-[47px] px-5 bg-[#86d0ef] rounded-[20px] text-[16px] font-bold text-black w-[320px]s w-[235px] group-hover:text-white group-hover:bg-[#6C9A97] transition-all"
            >
              {ctaLabel}
              <img src="/icon/angle-right.svg" alt="" className="w-[20px] h-[20px] flex-shrink-0 group-hover:invert [filter:drop-shadow(0.5px_0px_0px_black)_drop-shadow(-0.5px_0px_0px_black)] transition-all" aria-hidden="true" />
            </Link>
          </AnimateOnScroll>
        )}
      </div>
    </section>
  )
}

function ServiceCard({ svc, blobColor }: { svc: Service; blobColor: string }) {
  return (
    <div className="flex flex-col items-center md:items-end gap-4">
      {/* Blob + photo stacked container */}
      <div className="relative w-[240px] mx-auto md:w-full" style={{ aspectRatio: '1 / 1.05' }}>      
        {svc.image && (
          <div className="absolutes overflow-hidden">
            <MediaImage
              media={svc.image}
              className="w-full h-full object-cover object-bottom"
            />
          </div>
        )}
      </div>

      {/* Label badge — white pill below the blob, h-[46px] matching Figma */}
      {svc.title && (
        <div className="bg-white rounded-[23px] shadow-[0px_4px_2px_rgba(0,0,0,0.25)] absolute mt-41 md:mt-55 px-5 h-[40px] md:h-[46px] flex items-center justify-center max-w-[310px]s md:min-w-[310px] max-w-full text-center">
          <span className="font-bold text-[#01162c] text-[14px] md:text-[16px] leading-[1.48]">
            {svc.title}
          </span>
        </div>
      )}
    </div>
  )
}

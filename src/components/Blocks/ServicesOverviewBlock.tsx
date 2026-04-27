'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { MediaImage } from '@/components/ui/MediaImage'
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

const blobColors = ['#eb9097', '#8ec0bd', '#4fb4df']

export function ServicesOverviewBlockComponent({
  heading,
  subheading,
  services,
  ctaLabel,
  ctaUrl,
}: ServicesOverviewBlockProps) {
  const [emblaRef] = useEmblaCarousel({ loop: false, align: 'start' })

  if (!services || services.length === 0) return null

  return (
    <section className="bg-[#fff5ce] py-14 px-[52px] md:px-12">
      <div className="max-w-[1440px] mx-auto">
        {/* Heading */}
        {heading && (
          <h2 className="font-display text-[30px] md:text-[30px] text-black text-center leading-[1.5] mb-4">
            {heading}
          </h2>
        )}
        {subheading && (
          <p className="text-[14px] md:text-[16px] text-[#3f3e3e] text-center leading-[1.5] max-w-[729px] mx-auto mb-10">
            {subheading}
          </p>
        )}

        {/* Service cards — horizontal scroll on mobile, 3-col on desktop */}
        {/* Mobile carousel */}
        <div className="md:hidden overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {services.map((svc, i) => (
              <div key={svc.id ?? i} className="flex-[0_0_80%] min-w-0">
                <ServiceCard svc={svc} blobColor={blobColors[i % blobColors.length]} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:flex justify-center gap-8 lg:gap-12">
          {services.map((svc, i) => (
            <div key={svc.id ?? i} className="flex-1 max-w-[320px]">
              <ServiceCard svc={svc} blobColor={blobColors[i % blobColors.length]} />
            </div>
          ))}
        </div>

        {/* CTA button */}
        {ctaLabel && ctaUrl && (
          <div className="mt-12 flex justify-center">
            <Link
              href={ctaUrl}
              className="flex items-center justify-center gap-4 h-10 px-[20px] bg-[#86d0ef] rounded-[20px] text-[14px] font-bold text-black min-w-[320px]"
            >
              {ctaLabel}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

function ServiceCard({ svc, blobColor }: { svc: Service; blobColor: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Blob shape container */}
      <div className="relative w-full aspect-[0.88]">
        {/* Colored blob background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: blobColor,
            borderRadius: '87% 87% 88% 87% / 87% 87% 88% 87%',
          }}
        />

        {/* Photo with organic rounded corners */}
        {svc.image && (
          <div
            className="absolute inset-[10%] overflow-hidden shadow-[0px_5px_9px_0px_rgba(2,147,52,0.05)]"
            style={{
              borderRadius: '75px 0 76px 76px',
            }}
          >
            <MediaImage
              media={svc.image}
              className="w-full h-full object-cover object-bottom"
            />
          </div>
        )}
      </div>

      {/* Label badge */}
      {svc.title && (
        <div className="bg-white rounded-[23px] shadow-[0px_3px_1.5px_rgba(0,0,0,0.25)] px-4 py-2 min-w-[200px] text-center">
          <span className="font-bold text-[#01162c] text-[14px] md:text-[16px] leading-[1.48]">
            {svc.title}
          </span>
        </div>
      )}
    </div>
  )
}

import Image from 'next/image'
import { MediaImage } from '@/components/ui/MediaImage'

interface HeroBlockProps {
  headline?: string
  subheadline?: string
  bannerImage?: any
  mobileBannerImage?: any
  ctaLabel?: string
  ctaUrl?: string
}

export function HeroBlockComponent({
  headline,
  subheadline,
  bannerImage,
  mobileBannerImage,
  ctaLabel,
  ctaUrl,
}: HeroBlockProps) {
  return (
    <section className="relative w-full overflow-hidden bg-brand-beige">
      {/* Banner Image */}
      <div className="relative w-full">
        {bannerImage && (
          <div className="hidden md:block">
            <MediaImage
              media={bannerImage}
              className="w-full h-auto object-cover max-h-[520px]"
              priority
            />
          </div>
        )}
        {(mobileBannerImage || bannerImage) && (
          <div className="block md:hidden">
            <MediaImage
              media={mobileBannerImage ?? bannerImage}
              className="w-full h-auto object-cover max-h-[320px]"
              priority
            />
          </div>
        )}
      </div>

      {/* Text overlay / below */}
      {(headline || subheadline) && (
        <div className="px-6 py-10 md:px-16 md:py-14 max-w-5xl">
          {headline && (
            <h1 className="font-display text-4xl md:text-6xl text-brand-dark leading-tight mb-4">
              {headline}
            </h1>
          )}
          {subheadline && (
            <p className="text-brand-dark/70 text-base md:text-lg leading-relaxed max-w-2xl mb-6">
              {subheadline}
            </p>
          )}
          {ctaLabel && ctaUrl && (
            <a
              href={ctaUrl}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-teal text-white rounded-full font-semibold text-sm hover:bg-brand-teal-dark transition-colors duration-200 shadow-brand"
            >
              {ctaLabel}
            </a>
          )}
        </div>
      )}
    </section>
  )
}

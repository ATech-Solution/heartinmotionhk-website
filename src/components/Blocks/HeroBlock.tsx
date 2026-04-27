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
  const desktopImg = bannerImage
  const mobileImg = mobileBannerImage ?? bannerImage

  return (
    <section className="bg-[#f5eded] px-[52px] md:px-8 py-6">
      {/* Image container with gradient overlay and overlaid text */}
      <div className="relative w-full rounded-[20px] overflow-hidden h-[282px] md:h-[390px] lg:h-[488px]">
        {/* Desktop image */}
        {desktopImg && (
          <div className="hidden md:block absolute inset-0">
            <MediaImage
              media={desktopImg}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        )}

        {/* Mobile image */}
        {mobileImg && (
          <div className="block md:hidden absolute inset-0">
            <MediaImage
              media={mobileImg}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        )}

        {/* Gradient overlay — transparent → beige */}
        <div
          className="absolute inset-0 rounded-[20px]"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(237,237,237,0.35) 43.75%, #f5eded 77.885%)',
          }}
        />

        {/* Text — overlaid at bottom */}
        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 w-full pr-8">
          {headline && (
            <h1 className="font-display text-[32px] md:text-[48px] text-black leading-none mb-2 md:mb-3">
              {headline}
            </h1>
          )}
          {subheadline && (
            <p className="text-[14px] md:text-[18px] text-black text-justify leading-[1.5] max-w-[1110px]">
              {subheadline}
            </p>
          )}
          {ctaLabel && ctaUrl && (
            <a
              href={ctaUrl}
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-brand-teal text-white rounded-full font-semibold text-sm hover:bg-brand-teal-dark transition-colors duration-200"
            >
              {ctaLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

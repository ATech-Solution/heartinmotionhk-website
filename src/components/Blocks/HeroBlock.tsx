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
}: HeroBlockProps) {
  const desktopImg = bannerImage
  const mobileImg = mobileBannerImage ?? bannerImage

  return (
    <section className="bg-[#f5eded] px-4 md:px-[52px] py-3 md:py-6">
      {/* Hero image container */}
      <div className="relative w-full rounded-[20px] overflow-hidden h-[282px] lg:h-[488px]">
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

        {/* Fallback background when no image */}
        {!desktopImg && !mobileImg && (
          <div className="absolute inset-0 bg-[#d0e8e6]" />
        )}

        {/* Gradient overlay — transparent → semi → beige */}
        <div
          className="absolute inset-0 rounded-[20px]"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(237,237,237,0.35) 43.75%, #f5eded 77.885%)',
          }}
        />

        {/* Text overlaid at bottom-left */}
        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-8 w-full pr-8">
          {headline && (
            <h1 className="font-display text-[32px] md:text-[48px] text-black leading-[1.5] mb-2 md:mb-3">
              {headline}
            </h1>
          )}
          {subheadline && (
            <p className="text-[14px] md:text-[18px] text-black text-justify leading-[1.5] max-w-[1110px]">
              {subheadline}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

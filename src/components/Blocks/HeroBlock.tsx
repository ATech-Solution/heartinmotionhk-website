import { MediaImage } from '@/components/ui/MediaImage'
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll'

interface HeroBlockProps {
  headline?: string
  subheadline?: string
  subheadlineMobile?: string
  bannerImage?: any
  mobileBannerImage?: any
  ctaLabel?: string
  ctaUrl?: string
}

export function HeroBlockComponent({
  headline,
  subheadline,
  subheadlineMobile,
  bannerImage,
  mobileBannerImage,
  ctaLabel,
  ctaUrl,
}: HeroBlockProps) {
  const desktopImg = bannerImage
  const mobileImg = mobileBannerImage ?? bannerImage

  return (
    <section className="bg-white px-4 md:px-[52px] py-[48px] w-full flex justify-center">
      {/* Rounded image card with gradient + text overlay */}
      <div className="relative w-full max-w-[1337px] rounded-[20px] overflow-hidden h-[282px] md:h-[390px] lg:h-[488px]">

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

        {/* Text — animated overlay at bottom-left */}
        <AnimateOnScroll
          animation="fade-up"
          className="absolute bottom-6 left-6 md:bottom-8 md:left-8 w-full pr-8"
        >
          {headline && (
            <h1 className="font-display text-[32px] md:text-[48px] text-black leading-[1.5] mb-2 md:mb-3">
              {headline}
            </h1>
          )}
          {/* Mobile & tablet subheadline */}
          {(subheadlineMobile || subheadline) && (
            <p className="md:hidden text-[14px] text-black text-justify leading-[1.5] max-w-[1110px]">
              {subheadlineMobile ?? subheadline}
            </p>
          )}
          {/* Desktop subheadline */}
          {subheadline && (
            <p className="hidden md:block text-[18px] text-black text-justify leading-[1.5] max-w-[1110px]">
              {subheadline}
            </p>
          )}
          {ctaLabel && ctaUrl && (
            <a
              href={ctaUrl}
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-[#8ec0bd] text-black rounded-[15px] font-bold text-sm hover:opacity-90 transition-opacity"
            >
              {ctaLabel}
            </a>
          )}
        </AnimateOnScroll>
      </div>
    </section>
  )
}

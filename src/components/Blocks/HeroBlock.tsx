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
    <section className="bg-white px-4 md:px-[52px] pt-3 pb-6 md:py-[48px] w-full">

      {/* Mobile only: CTA button above the hero image card */}
      {ctaLabel && ctaUrl && (
        <a
          href={ctaUrl}
          className="md:hidden mb-3 w-full h-[40px] px-[15px] bg-[#8ec0bd] rounded-[15px] flex items-center justify-between text-[16px] font-bold text-black hover:opacity-90 transition-opacity"
        >
          {ctaLabel}
          <img src="/icon/angle-right.svg" alt="" className="w-[20px] h-[20px] flex-shrink-0" aria-hidden="true" />
        </a>
      )}

      {/* Rounded image card with gradient + text overlay */}
      <div className="relative w-full max-w-[1300px] md:mx-auto rounded-[20px] overflow-hidden h-[282px] md:h-[390px] lg:h-[488px]">

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

        {/* Text overlay */}
        <AnimateOnScroll
          animation="fade-up"
          className="absolute bottom-6 left-[27px] md:bottom-8 md:left-8 w-full pr-8"
        >
          {headline && (
            <h1 className="font-display text-[32px] md:text-[48px] text-black leading-none mb-2 md:mb-3">
              {headline}
            </h1>
          )}
          {/* Mobile subheadline */}
          {(subheadlineMobile) && (
            <p className="md:hidden text-[16px] text-black text-justify leading-[1.5] max-w-[315px]">
              {subheadlineMobile}
            </p>
          )}
          {/* Desktop subheadline */}
          {subheadline && (
            <p className="hidden md:block text-[18px] text-black text-justify leading-[1.5] max-w-[1110px]">
              {subheadline}
            </p>
          )}
          {/* Desktop CTA — inside image overlay */}
          {ctaLabel && ctaUrl && (
            <a
              href={ctaUrl}
              className="hidden md:inline-flex mt-4 items-center gap-2 px-6 py-3 bg-[#8ec0bd] text-black rounded-[15px] font-bold text-sm hover:opacity-90 transition-opacity"
            >
              {ctaLabel}
            </a>
          )}
        </AnimateOnScroll>
      </div>
    </section>
  )
}

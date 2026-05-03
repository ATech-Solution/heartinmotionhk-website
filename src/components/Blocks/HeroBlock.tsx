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

  // const ctaLabel = "Learn more"
  // const ctaUrl ="#"
  return (
    <section className="bg-white px-4 py-8 pb-5 md:px-16 md:py-10 w-full">

      {/* Mobile only: CTA button above the hero image card */}
      {ctaLabel && ctaUrl && (
        <a
          href={ctaUrl}
          className="md:hidden mb-3 w-full h-[40px] px-[15px] bg-[#8ec0bd] rounded-[15px] flex items-center justify-between text-[16px] font-bold text-black"
        >
          {ctaLabel}
          <img src="/icon/angle-right.svg" alt="" className="w-[20px] h-[20px] flex-shrink-0 [filter:drop-shadow(0.5px_0px_0px_black)_drop-shadow(-0.5px_0px_0px_black)]" aria-hidden="true" />
        </a>
      )}

      {/* Rounded image card with gradient + text overlay */}
      <div className="relative 
      w-[390px] h-[320px] 
      md:w-full md:max-w-[1300px] md:h-[440px] md:rounded-[10px]
      lg:w-full lg:max-w-[1300px] lg:h-[345px] lg:rounded-[0px]
      xl:w-full xl:max-w-[1300px] xl:h-[488px] xl:rounded-[0px]
      md:mx-auto overflow-hidden">

        {/* Desktop image */}
        {desktopImg && (
          <div className="hidden md:block absolute inset-0">
            <MediaImage
              media={desktopImg}
              className="w-full h-full md:object-cover lg:object-contain"
              priority
            />
          </div>
        )}

        {/* Mobile image */}
        {/* style={{ aspectRatio: '1 / 1.05' }} */}
        {mobileImg && (
          <div className="block md:hidden absolute inset-0 bg-top-left bg-position-top-left bg-no-repeat bg-size-contain bg-size-[100%_320px]" 
          // bg-size-[390px_320px]
          // 290
          style={{ backgroundImage: `url(${mobileImg.url})` }}>
            {/* <MediaImage
              media={mobileImg}
              className="w-full h-full object-cover object-top object-position-top rounded-[30px]"
              priority
            /> */}
          </div>
        )}

        {/* Gradient overlay — transparent → beige */}
        <div className="absolute inset-0 rounded-[20px]"/>

        {/* Text overlay */}
        <AnimateOnScroll
          animation="fade-up"
          className="absolute bottom-6 md:bottom-8 w-full pr-8 md:pr-12 left-[35px]"
        >
          {headline && (
            <h1 className="font-display text-[32px] md:text-[48px] text-black leading-none mb-2 md:mb-3 w-[250px] md:w-full">
              {headline}
            </h1>
          )}
          {/* Mobile subheadline */}
          {(subheadlineMobile) && (
            <p className="md:hidden text-[14px] text-black text-justify leading-[1.25] max-w-[330px]">
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
            <div className="group transition-all duration-300">
            <a
              href={ctaUrl}
              className="hidden md:inline-flex mt-4 items-center gap-2 px-6 py-3 bg-[#8ec0bd] text-black rounded-[15px] font-bold text-sm group-hover:text-white group-hover:bg-[#6C9A97] transition-all"
            >
              {ctaLabel}
              <img src="/icon/angle-right.svg" alt="" className="w-[20px] h-[20px] flex-shrink-0 group-hover:invert [filter:drop-shadow(0.5px_0px_0px_black)_drop-shadow(-0.5px_0px_0px_black)] transition-all" aria-hidden="true" />
            </a>
            </div>
          )}
        </AnimateOnScroll>
      </div>
    </section>
  )
}

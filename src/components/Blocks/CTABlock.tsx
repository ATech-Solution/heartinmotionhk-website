import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll'

interface CTABlockProps {
  heading?: string
  subheading?: string
  ctaLabel?: string
  ctaUrl?: string
  background?: string
}

const bgStyles: Record<string, string> = {
  teal: 'bg-[#b2e6e3]',
  'teal-gradient': 'bg-[#b2e6e3]',
  yellow: 'bg-[#fff5ce]',
  beige: 'bg-[#f5eded]',
}

export function CTABlockComponent({
  heading,
  subheading,
  ctaLabel,
  ctaUrl,
  background = 'teal-gradient',
}: CTABlockProps) {
  const bgClass = bgStyles[background] ?? bgStyles['teal-gradient']

  return (
    <section className={`${bgClass} px-4 md:px-[52px] min-h-[156px] md:min-h-[215px] flex items-center`}>
      <div className="w-full max-w-[1000px] mx-auto py-[28px] md:py-0">

        {/* Mobile: stacked, centered — matches Figma 156px banner */}
        <div className="flex flex-col md:hidden items-center gap-4 text-center">
          {heading && (
            <AnimateOnScroll animation="fade-up">
              <h2 className="font-display text-[20px] text-black leading-none">
                {heading}
              </h2>
            </AnimateOnScroll>
          )}
          {subheading && (
            <AnimateOnScroll animation="fade-up" delay={100}>
              <p className="text-[16px] text-[#3f3e3e] leading-[1.5]">
                {subheading}
              </p>
            </AnimateOnScroll>
          )}
          {ctaLabel && ctaUrl && (
            <AnimateOnScroll animation="fade-up" delay={200} className="">
              <a
                href={ctaUrl}
                className="inline-flex items-center justify-center gap-4 h-[40px] px-[15px] bg-[#8ec0bd] rounded-[15px] text-[16px] font-bold text-black w-[350px] max-w-full hover:opacity-90 transition-opacity"
              >
                {ctaLabel}
                <img src="/icon/angle-right.svg" alt="" className="w-[20px] h-[20px] flex-shrink-0 [filter:drop-shadow(0.5px_0px_0px_black)_drop-shadow(-0.5px_0px_0px_black)]" aria-hidden="true" />
              </a>
            </AnimateOnScroll>
          )}
        </div>

        {/* Desktop: text left, button right */}
        <div className={`hidden ${subheading ? 'md:flex items-center justify-between gap-10' : 'md:grid items-center justify-center gap-3 min-h-[100px]' }`}>
          <AnimateOnScroll animation="fade-left" className={`${subheading ? 'flex flex-col gap-5 max-w-[897px]': 'max-w-full'}`}>
            {heading && (
              <h2 className="font-display text-[30px] text-black leading-[1.5]">
                &ldquo;{heading}&rdquo;
              </h2>
            )}
            {subheading && (
              <p className="text-[16px] text-[#3f3e3e] leading-[1.5] max-w-[675px]">
                {subheading}
              </p>
            )}
          </AnimateOnScroll>

          {ctaLabel && ctaUrl && (
            <AnimateOnScroll animation="fade-right" delay={150} className={`group transition-all duration-300 ${subheading ? 'flex-shrink-0': 'mx-auto'}`}>
              <a
                href={ctaUrl} className="inline-flex items-center justify-center gap-4 h-10 px-6 bg-[#8ec0bd] rounded-[15px] text-[16px] font-bold text-black w-[235px] md:w-[320px] group-hover:text-white group-hover:bg-[#6C9A97]">
                {ctaLabel}
                <img src="/icon/angle-right.svg" alt="" className="w-[20px] h-[20px] flex-shrink-0 group-hover:invert [filter:drop-shadow(0.5px_0px_0px_black)_drop-shadow(-0.5px_0px_0px_black)] transition-all" aria-hidden="true" />
              </a>
            </AnimateOnScroll>
          )}
        </div>

      </div>
    </section>
  )
}

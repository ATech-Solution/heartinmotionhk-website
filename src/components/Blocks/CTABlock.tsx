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
  'teal-gradient': '',
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
  const isTealGradient = background === 'teal-gradient'

  return (
    <section
      className={`py-[30px] px-4 md:px-[52px] ${bgStyles[background] ?? ''}`}
      style={
        isTealGradient
          ? { background: 'linear-gradient(90deg, #b2e6e3 0%, #b2e6e3 100%)' }
          : undefined
      }
    >
      <div className="max-w-[1440px] mx-auto">
        {/* Mobile: stacked, centered */}
        <div className="flex flex-col md:hidden items-center gap-5 py-4 text-center">
          {heading && (
            <AnimateOnScroll animation="fade-up">
              <h2 className="font-display text-[20px] text-black leading-[1.5]">
                &ldquo;{heading}&rdquo;
              </h2>
            </AnimateOnScroll>
          )}
          {subheading && (
            <AnimateOnScroll animation="fade-up" delay={100}>
              <p className="text-[14px] text-[#3f3e3e] leading-[1.5]">
                {subheading}
              </p>
            </AnimateOnScroll>
          )}
          {ctaLabel && ctaUrl && (
            <AnimateOnScroll animation="fade-up" delay={200}>
              <a
                href={ctaUrl}
                className="flex items-center justify-center gap-3 h-10 px-[15px] bg-[#8ec0bd] rounded-[15px] text-[14px] font-bold text-black w-[328px] max-w-full hover:opacity-90 transition-opacity"
              >
                {ctaLabel}
                <span className="inline-block rotate-[-90deg] text-base leading-none">›</span>
              </a>
            </AnimateOnScroll>
          )}
        </div>

        {/* Desktop: text left, button right */}
        <div className="hidden md:flex items-center justify-between gap-10 min-h-[174px]">
          <AnimateOnScroll animation="fade-left" className="flex flex-col gap-5 max-w-[897px]">
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
            <AnimateOnScroll animation="fade-right" delay={150} className="flex-shrink-0">
              <a
                href={ctaUrl}
                className="flex items-center justify-center gap-4 h-10 px-[20px] bg-[#8ec0bd] rounded-[20px] text-[14px] font-bold text-black w-[320px] hover:opacity-90 transition-opacity"
              >
                {ctaLabel}
                <span className="inline-block rotate-[-90deg] text-base leading-none">›</span>
              </a>
            </AnimateOnScroll>
          )}
        </div>
      </div>
    </section>
  )
}

interface CTABlockProps {
  heading?: string
  subheading?: string
  ctaLabel?: string
  ctaUrl?: string
  background?: string
}

const bgStyles: Record<string, string> = {
  teal: 'bg-brand-teal',
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
      className={`py-[30px] px-[52px] md:px-12 ${bgStyles[background] ?? ''}`}
      style={isTealGradient ? { background: 'linear-gradient(90deg, #b2e6e3 0%, #b2e6e3 100%)' } : undefined}
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-10">
          {/* Text */}
          <div className="flex flex-col gap-5 max-w-[897px]">
            {heading && (
              <h2 className="font-display text-[20px] md:text-[30px] text-black leading-[1.5]">
                {`"${heading}"`}
              </h2>
            )}
            {subheading && (
              <p className="text-[14px] md:text-[16px] text-[#3f3e3e] leading-[1.5]">
                {subheading}
              </p>
            )}
          </div>

          {/* CTA button */}
          {ctaLabel && ctaUrl && (
            <a
              href={ctaUrl}
              className="flex-shrink-0 flex items-center justify-center gap-4 h-10 px-[15px] bg-[#8ec0bd] rounded-[15px] text-[14px] font-bold text-black min-w-[328px] md:min-w-0 md:w-[320px]"
            >
              {ctaLabel}
              <span className="rotate-[-90deg] inline-block text-sm">›</span>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

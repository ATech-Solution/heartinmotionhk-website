const bgMap: Record<string, string> = {
  teal: 'bg-brand-teal',
  yellow: 'bg-brand-yellow',
  beige: 'bg-brand-beige-dark',
}

interface CTABlockProps {
  heading?: string
  subheading?: string
  ctaLabel?: string
  ctaUrl?: string
  background?: string
}

export function CTABlockComponent({ heading, subheading, ctaLabel, ctaUrl, background = 'teal' }: CTABlockProps) {
  const bg = bgMap[background] ?? bgMap.teal
  const textColor = background === 'yellow' ? 'text-brand-dark' : 'text-white'

  return (
    <section className={`${bg} py-16 px-6 md:px-16`}>
      <div className="max-w-3xl mx-auto text-center">
        {heading && (
          <h2 className={`font-display text-3xl md:text-5xl mb-4 ${textColor}`}>{heading}</h2>
        )}
        {subheading && (
          <p className={`text-base md:text-lg mb-8 opacity-90 ${textColor}`}>{subheading}</p>
        )}
        {ctaLabel && ctaUrl && (
          <a
            href={ctaUrl}
            className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm border-2 transition-colors duration-200
              ${background === 'teal'
                ? 'bg-white text-brand-teal border-white hover:bg-transparent hover:text-white'
                : 'bg-brand-teal text-white border-brand-teal hover:bg-brand-teal-dark'
              }`}
          >
            {ctaLabel}
            <span className="text-lg leading-none">›</span>
          </a>
        )}
      </div>
    </section>
  )
}

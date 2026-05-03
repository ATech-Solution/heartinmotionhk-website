import { RichText } from '@/components/ui/RichText'
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll'

interface HeartTeamCoachingBlockProps {
  heading?: string
  body?: any
  ctaLabel?: string
  ctaUrl?: string
}

export function HeartTeamCoachingBlockComponent({ heading, body, ctaLabel, ctaUrl }: HeartTeamCoachingBlockProps) {
  return (
    <section className="bg-white pt-[50px] pb-6 md:pt-6 md:pb-6 px-10 md:px-16">
      <div className="max-w-[1200px] mx-auto">
        <AnimateOnScroll animation="fade-up">
          {heading && (
            <h2 className="font-display text-[28px] md:text-[40px] text-black leading-[1.5] mb-[30px] md:mb-3">
              {heading}
            </h2>
          )}
          {body && (
            <div className="text-[16px] md:text-[16px] text-[#3f3e3e] text-justify leading-[1.5] max-w-[883px] whitespace-pre-wrap">
              <RichText content={body} />
            </div>
          )}
        </AnimateOnScroll>

        {/* Mobile CTA button below text */}
        {ctaLabel && ctaUrl && (
          <AnimateOnScroll animation="fade-up" delay={150} className="mt-8 md:hidden">
            <a
              href={ctaUrl}
              className="inline-flex items-center justify-between h-[40px] px-[15px] bg-[#86d0ef] rounded-[15px] text-[16px] font-bold text-black w-[328px] max-w-full hover:opacity-90 transition-opacity"
            >
              {ctaLabel}
              <img src="/icon/angle-right.svg" alt="" className="w-[20px] h-[20px] flex-shrink-0 [filter:drop-shadow(0.5px_0px_0px_black)_drop-shadow(-0.5px_0px_0px_black)]" aria-hidden="true" />
            </a>
          </AnimateOnScroll>
        )}
      </div>
    </section>
  )
}

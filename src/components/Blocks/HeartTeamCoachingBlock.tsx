import { RichText } from '@/components/ui/RichText'
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll'

interface HeartTeamCoachingBlockProps {
  heading?: string
  body?: any
}

export function HeartTeamCoachingBlockComponent({ heading, body }: HeartTeamCoachingBlockProps) {
  return (
    <section className="bg-white pt-[60px] md:pt-[80px] pb-0 px-4 md:px-[52px]">
      <div className="max-w-[1440px] mx-auto">
        <AnimateOnScroll animation="fade-up">
          {heading && (
            <h2 className="font-display text-[32px] md:text-[40px] text-black leading-[0.97] mb-5 md:mb-6">
              {heading}
            </h2>
          )}
          {body && (
            <div className="text-[14px] md:text-[16px] text-black text-justify leading-[1.5] max-w-[883px] whitespace-pre-wrap">
              <RichText content={body} />
            </div>
          )}
        </AnimateOnScroll>
      </div>
    </section>
  )
}

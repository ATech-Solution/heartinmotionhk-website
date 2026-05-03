import { MediaImage } from '@/components/ui/MediaImage'
import { RichText } from '@/components/ui/RichText'
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll'

interface RealChallengeBlockProps {
  heading?: string
  body?: any
  bodyMobile?: any
  animatedGif?: any
}

export function RealChallengeBlockComponent({ heading, body, bodyMobile, animatedGif }: RealChallengeBlockProps) {
  return (
    <section className="bg-white pt-5 md:pt-9 pb-5 md:pb-10 md:py-6 px-4 md:px-16">
      <div className="max-w-[1100px] mx-auto">

        {/* Mobile: illustration above, text below */}
        <div className="flex flex-col md:hidden gap-[20px] md:gap-[10px] ">
          {animatedGif && (
            <AnimateOnScroll animation="fade" className="w-full flex justify-center">
              <MediaImage media={animatedGif} className="max-w-[345px] md:max-w-[313px] w-full h-auto" unoptimized />
            </AnimateOnScroll>
          )}
          <AnimateOnScroll animation="fade-up" delay={100}>
            {heading && (
              <h2 className="font-display text-[32px] text-black leading-[1.5] mb-[10px] px-6">
                {heading}
              </h2>
            )}
            {bodyMobile && (
              <div className="text-[14px] text-[#3f3e3e] text-justify leading-[1.5] px-6">
                <RichText content={bodyMobile} />
              </div>
            )}
          </AnimateOnScroll>
        </div>

        {/* Desktop: illustration ~40% left, heading + text ~60% right */}
        <div className="hidden md:flex items-center gap-[80px] px-4">
          <AnimateOnScroll animation="fade-left" className="w-[40%] flex-shrink-0 flex justify-center">
            {animatedGif && (
              <MediaImage media={animatedGif} className="max-w-full h-auto" unoptimized />
            )}
          </AnimateOnScroll>

          <AnimateOnScroll animation="fade-right" delay={150} className="flex-1">
            {heading && (
              <h2 className="font-display text-[40px] text-black leading-[1.] mb-6">
                {heading}
              </h2>
            )}
            {body && (
              <div className="text-[16px] text-black text-justify leading-[1.5]">
                <RichText content={body} />
              </div>
            )}
          </AnimateOnScroll>
        </div>

      </div>
    </section>
  )
}

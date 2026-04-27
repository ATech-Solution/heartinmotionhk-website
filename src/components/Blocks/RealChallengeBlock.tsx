import { MediaImage } from '@/components/ui/MediaImage'
import { RichText } from '@/components/ui/RichText'

interface RealChallengeBlockProps {
  heading?: string
  body?: any
  animatedGif?: any
}

export function RealChallengeBlockComponent({ heading, body, animatedGif }: RealChallengeBlockProps) {
  return (
    <section className="bg-[#f5eded] py-12 md:py-16 px-4 md:px-[52px]">
      <div className="max-w-[1440px] mx-auto">
        {/* Mobile: illustration above, text below */}
        <div className="flex flex-col md:hidden gap-6">
          {animatedGif && (
            <div className="w-full flex justify-center">
              <MediaImage media={animatedGif} className="max-w-[320px] w-full h-auto" unoptimized />
            </div>
          )}
          <div>
            {heading && (
              <h2 className="font-display text-[32px] text-black leading-[0.97] mb-4">
                {heading}
              </h2>
            )}
            {body && (
              <div className="text-[14px] text-[#3f3e3e] text-justify leading-[1.5]">
                <RichText content={body} />
              </div>
            )}
          </div>
        </div>

        {/* Desktop: illustration ~40% left, text ~60% right */}
        <div className="hidden md:flex items-center gap-16">
          <div className="w-[40%] flex-shrink-0 flex justify-center">
            {animatedGif && (
              <MediaImage media={animatedGif} className="max-w-full h-auto" unoptimized />
            )}
          </div>
          <div className="flex-1">
            {heading && (
              <h2 className="font-display text-[40px] text-black leading-[0.97] mb-6">
                {heading}
              </h2>
            )}
            {body && (
              <div className="text-[16px] text-black text-justify leading-[1.5] max-w-[473px]">
                <RichText content={body} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

import { MediaImage } from '@/components/ui/MediaImage'
import { RichText } from '@/components/ui/RichText'
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll'

const pillColorMap: Record<string, string> = {
  teal:   'bg-[#b2e6e3]',
  yellow: 'bg-[#fff5ce]',
  pink:   'bg-[#fbacb2]',
  blue:   'bg-[#86d0ef]',
}

/* Alternate animations for each card position */
const cardAnimations = ['fade-left', 'fade-right', 'fade-left', 'fade-right'] as const

interface Value {
  title?: string
  description?: string
  icon?: any
  decorativeImage?: any
  color?: string
}

interface ValuesBlockProps {
  heading?: string
  sectionIntro?: any
  values?: Value[]
}

export function ValuesBlockComponent({ heading, sectionIntro, values }: ValuesBlockProps) {
  if (!values || values.length === 0) return null

  return (
    <section className="bg-white pb-16 pt-4 px-4 md:px-[52px]">
      <div className="max-w-[1440px] mx-auto">
        {sectionIntro && (
          <AnimateOnScroll animation="fade-up" className="mb-10">
            <div className="text-[14px] md:text-[16px] text-black text-justify leading-[1.5] max-w-[883px]">
              <RichText content={sectionIntro} />
            </div>
          </AnimateOnScroll>
        )}

        {/* Desktop: 2-column grid — illustration above pill + body */}
        <div className="hidden md:grid md:grid-cols-2 gap-x-[85px] gap-y-[40px]">
          {values.map((val, i) => {
            const pillBg = pillColorMap[val.color ?? 'teal'] ?? pillColorMap.teal
            const anim = cardAnimations[i % cardAnimations.length]
            return (
              <AnimateOnScroll key={i} animation={anim} delay={i * 80}>
                <div className="flex flex-col">
                  {/* Illustration sits above-right, baseline-aligned with pill */}
                  <div className="flex justify-end h-[220px] items-end pb-2">
                    {val.decorativeImage ? (
                      <MediaImage
                        media={val.decorativeImage}
                        className="max-h-full w-auto object-contain max-w-[180px]"
                      />
                    ) : (
                      <span className="block" aria-hidden="true" />
                    )}
                  </div>

                  {/* Colored pill header */}
                  <div
                    className={`relative h-[60px] w-full max-w-[394px] rounded-[30px] ${pillBg} flex items-center justify-center`}
                  >
                    {val.title && (
                      <span className="font-bold text-[20px] text-black text-center px-6">
                        {val.title}
                      </span>
                    )}
                  </div>

                  {/* Body text */}
                  {val.description && (
                    <p className="mt-5 text-[16px] text-[#3f3e3e] text-justify leading-[1.85] max-w-[397px] pr-5">
                      {val.description}
                    </p>
                  )}
                </div>
              </AnimateOnScroll>
            )
          })}
        </div>

        {/* Mobile: single-column stacked cards */}
        <div className="md:hidden flex flex-col gap-8">
          {values.map((val, i) => {
            const pillBg = pillColorMap[val.color ?? 'teal'] ?? pillColorMap.teal
            return (
              <AnimateOnScroll key={i} animation="fade-up" delay={i * 100}>
                <div className="flex flex-col gap-4">
                  <div
                    className={`relative h-[56px] w-full max-w-[390px] rounded-[30px] ${pillBg} flex items-center justify-center`}
                  >
                    {val.title && (
                      <span className="font-bold text-[18px] text-black text-center px-5">
                        {val.title}
                      </span>
                    )}
                  </div>
                  {val.description && (
                    <p className="text-[14px] text-[#3f3e3e] text-justify leading-[1.85]">
                      {val.description}
                    </p>
                  )}
                </div>
              </AnimateOnScroll>
            )
          })}
        </div>
      </div>
    </section>
  )
}

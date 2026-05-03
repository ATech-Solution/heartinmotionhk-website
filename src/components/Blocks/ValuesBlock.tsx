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
    <section className="bg-white px-8 pt-0 pb-8 md:px-16 md:pt-16 md:pb-18 ">
      <div className="max-w-[1000px] mx-auto">
        {sectionIntro && (
          <AnimateOnScroll animation="fade-up" className="mb-8 md:mb-10">
            <div className="text-[14px] md:text-[16px] text-[14px] md:text-[16px] text-black text-justify leading-[1.5] max-w-[883px]">
              <RichText content={sectionIntro} />
            </div>
          </AnimateOnScroll>
        )}

        {/* Desktop: 2-column grid — illustration above pill + body */}
        <div className="hidden md:grid md:grid-cols-2 gap-x-[50px] gap-y-[40px]">
          {values.map((val, i) => {
            const pillBg = pillColorMap[val.color ?? 'teal'] ?? pillColorMap.teal
            const anim = cardAnimations[i % cardAnimations.length]
            return (
              <AnimateOnScroll key={i} animation={anim} delay={i * 80}>
                <div className="flex flex-col">
                  {/* Illustration sits above-right, baseline-aligned with pill */}
                  <div className="flex justify-center h-[236px] items-end pb-6">
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
                    className={`relative h-[60px] w-full rounded-[30px] ${pillBg} flex items-center`}
                  >
                    {val.title && (
                      <span className="font-bold text-[20px] text-black text-left px-6">
                        {val.title}
                      </span>
                    )}
                  </div>

                  {/* Body text */}
                  {val.description && (
                    <p className="mt-5 text-[14px] md:text-[16px] text-[#3f3e3e] text-justify leading-[1.48]">
                      {val.description}
                    </p>
                  )}
                </div>
              </AnimateOnScroll>
            )
          })}
        </div>

        {/* Mobile: single-column stacked cards */}
        <div className="md:hidden flex flex-col gap-6">
          {values.map((val, i) => {
            const pillBg = pillColorMap[val.color ?? 'teal'] ?? pillColorMap.teal
            return (
              <AnimateOnScroll key={i} animation="fade-up" delay={i * 100}>
                <div className="flex flex-col gap-5">
                  
                  {/* Illustration sits above-right, baseline-aligned with pill */}
                  <div className="flex justify-center h-[135px] items-end">
                    {val.decorativeImage ? (
                      <MediaImage
                        media={val.decorativeImage}
                        className="max-h-full w-auto object-contain min-w-[85px] max-w-[135px]"
                      />
                    ) : (
                      <span className="block" aria-hidden="true" />
                    )}
                  </div>
                  {/* Colored pill — full width, h-[40px] matching Figma button height */}
                  <div
                    className={`relative h-[56px] w-full rounded-[30px] ${pillBg} flex items-center justify-center`}
                  >
                    {val.title && (
                      <span className="font-bold text-[16px] md:text-[16px] text-black px-5 text-center">
                        {val.title}
                      </span>
                    )}
                  </div>
                  {val.description && (
                    <p className="text-[14px] md:text-[16px] text-[#3f3e3e] text-justify leading-[1.5]">
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

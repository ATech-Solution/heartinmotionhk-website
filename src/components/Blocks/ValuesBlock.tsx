import { MediaImage } from '@/components/ui/MediaImage'
import { RichText } from '@/components/ui/RichText'

const pillColorMap: Record<string, string> = {
  teal: 'bg-[#b2e6e3]',
  yellow: 'bg-[#fff5ce]',
  pink: 'bg-[#fbacb2]',
  blue: 'bg-[#86d0ef]',
}

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
  return (
    <section className="bg-[#f5eded] py-12 px-[52px] md:px-12">
      <div className="max-w-[1440px] mx-auto">
        {/* Section intro (used by HeartTeamCoachingBlock visually; here for standalone use) */}
        {sectionIntro && (
          <div className="text-[14px] md:text-[16px] text-black text-justify leading-[1.5] max-w-[883px] mb-10">
            <RichText content={sectionIntro} />
          </div>
        )}

        {/* 2-column grid of value cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[85px] gap-y-[55px]">
          {values?.map((val, i) => {
            const pillBg = pillColorMap[val.color ?? 'teal'] ?? pillColorMap.teal

            return (
              <div key={i} className="relative flex flex-col">
                {/* Card */}
                <div className="flex flex-col gap-5">
                  {/* Colored pill header */}
                  <div className={`relative h-[60px] w-[390px] max-w-full rounded-[30px] ${pillBg} flex items-center justify-center`}>
                    {val.title && (
                      <span className="font-bold text-[20px] text-black text-center px-4">
                        {val.title}
                      </span>
                    )}
                  </div>

                  {/* Body text */}
                  {val.description && (
                    <p className="text-[14px] md:text-[16px] text-[#3f3e3e] text-justify leading-[1.85] max-w-[397px]">
                      {val.description}
                    </p>
                  )}
                </div>

                {/* Decorative illustration — positioned to the right of the card on desktop */}
                {val.decorativeImage && (
                  <div className="mt-4 md:mt-0 md:absolute md:right-[-120px] md:top-0 w-[120px] md:w-[160px] flex-shrink-0">
                    <MediaImage
                      media={val.decorativeImage}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

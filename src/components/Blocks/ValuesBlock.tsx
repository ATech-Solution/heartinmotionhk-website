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
  if (!values || values.length === 0) return null

  return (
    <section className="bg-[#f5eded] pb-16 pt-4 px-[52px] md:px-12">
      <div className="max-w-[1440px] mx-auto">
        {sectionIntro && (
          <div className="text-[14px] md:text-[16px] text-black text-justify leading-[1.5] max-w-[883px] mb-10">
            <RichText content={sectionIntro} />
          </div>
        )}

        {/* Desktop: 2-column grid — each card has illustration above pill */}
        <div className="hidden md:grid md:grid-cols-2 gap-x-[85px] gap-y-[55px]">
          {values.map((val, i) => {
            const pillBg = pillColorMap[val.color ?? 'teal'] ?? pillColorMap.teal
            return (
              <div key={i} className="flex flex-col">
                {/* Decorative illustration positioned above-right, above the pill */}
                <div className="flex justify-end h-[220px] items-end pb-2">
                  {val.decorativeImage ? (
                    <MediaImage
                      media={val.decorativeImage}
                      className="max-h-full w-auto object-contain max-w-[180px]"
                    />
                  ) : (
                    /* Invisible spacer so pill aligns consistently when no image */
                    <span className="block" aria-hidden="true" />
                  )}
                </div>

                {/* Colored pill header */}
                <div
                  className={`relative h-[60px] w-full max-w-[390px] rounded-[30px] ${pillBg} flex items-center justify-center`}
                >
                  {val.title && (
                    <span className="font-bold text-[20px] text-black text-center px-6">
                      {val.title}
                    </span>
                  )}
                </div>

                {/* Body text */}
                {val.description && (
                  <p className="mt-5 text-[16px] text-[#3f3e3e] text-justify leading-[1.85] max-w-[397px]">
                    {val.description}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {/* Mobile: single column stacked cards */}
        <div className="md:hidden flex flex-col gap-8">
          {values.map((val, i) => {
            const pillBg = pillColorMap[val.color ?? 'teal'] ?? pillColorMap.teal
            return (
              <div key={i} className="flex flex-col gap-4">
                {/* Colored pill header */}
                <div
                  className={`relative h-[56px] w-full max-w-[390px] rounded-[30px] ${pillBg} flex items-center justify-center`}
                >
                  {val.title && (
                    <span className="font-bold text-[18px] text-black text-center px-5">
                      {val.title}
                    </span>
                  )}
                </div>

                {/* Body text */}
                {val.description && (
                  <p className="text-[14px] text-[#3f3e3e] text-justify leading-[1.85]">
                    {val.description}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

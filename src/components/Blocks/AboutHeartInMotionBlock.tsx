import { MediaImage } from '@/components/ui/MediaImage'
import { RichText } from '@/components/ui/RichText'

interface AboutHeartInMotionBlockProps {
  heading?: string
  body?: any
  missionTitle?: string
  mission?: any
  visionTitle?: string
  vision?: any
  coreValues?: Array<{ value: string }>
  image?: any
}

export function AboutHeartInMotionBlockComponent({
  heading,
  body,
  missionTitle,
  mission,
  visionTitle,
  vision,
  coreValues,
  image,
}: AboutHeartInMotionBlockProps) {
  return (
    <section className="bg-white md:bg-[#FFF5CE] px-8 pt-8 pb-13 md:px-16 md:py-20">
      <div className="max-w-[1200px] mx-auto">
        {image && (
            <div className="overflow-hidden block md:hidden mb-6">
              <MediaImage media={image} className="w-[180px] h-auto object-cover mx-auto" />
            </div>
        )}

        {heading && (
          <h2 className="font-display text-[28px] md:text-[40px] text-black mb-3">{heading}</h2>
        )}
        {body && (
          <div className="text-[14px] md:text-[16px] text-black leading-[1.5] w-full mb-10 md:pl-1">
            <RichText content={body} />
          </div>
        )}
        <div className="grid xl:grid-cols-2 gap-12 items-start pl-1">
          <div className="space-y-8 md:w-[650px]">
            {mission && (
              <div>
                <h3 className="font-display text-[28px] text-[32px] md:text-[48px] text-black mb-3">{missionTitle ?? 'Mission'}</h3>
                <RichText content={mission} className="text-black leading-[1.5]" />
              </div>
            )}
            {vision && (
              <div>
                <h3 className="font-display text-[28px] text-[32px] md:text-[48px] text-black mb-3">{visionTitle ?? 'Vision'}</h3>
                <RichText content={vision} className="text-black leading-[1.5]" />
              </div>
            )}
          </div>
          {image && (
            <div className="overflow-hidden hidden md:block md:mt-10 lg:mt-5">
              <MediaImage media={image} className="w-[335px] md:w-[290px] h-auto object-cover mx-auto" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

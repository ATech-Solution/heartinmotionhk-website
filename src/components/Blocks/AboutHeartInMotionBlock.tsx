import { MediaImage } from '@/components/ui/MediaImage'
import { RichText } from '@/components/ui/RichText'

interface AboutHeartInMotionBlockProps {
  heading?: string
  missionTitle?: string
  mission?: any
  visionTitle?: string
  vision?: any
  coreValues?: Array<{ value: string }>
  image?: any
}

export function AboutHeartInMotionBlockComponent({
  heading,
  missionTitle,
  mission,
  visionTitle,
  vision,
  coreValues,
  image,
}: AboutHeartInMotionBlockProps) {
  return (
    <section className="py-16 px-6 md:px-16 bg-brand-beige-dark">
      <div className="max-w-6xl mx-auto">
        {heading && (
          <h2 className="font-display text-3xl md:text-4xl text-brand-dark mb-10">{heading}</h2>
        )}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            {mission && (
              <div>
                <h3 className="font-display text-2xl text-brand-teal mb-3">{missionTitle ?? 'Mission'}</h3>
                <RichText content={mission} className="text-brand-dark/70 leading-relaxed" />
              </div>
            )}
            {vision && (
              <div>
                <h3 className="font-display text-2xl text-brand-teal mb-3">{visionTitle ?? 'Vision'}</h3>
                <RichText content={vision} className="text-brand-dark/70 leading-relaxed" />
              </div>
            )}
            {coreValues && coreValues.length > 0 && (
              <ul className="space-y-2">
                {coreValues.map((cv, i) => (
                  <li key={i} className="flex gap-2 items-start text-brand-dark/80">
                    <span className="text-brand-teal font-bold">•</span>
                    {cv.value}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {image && (
            <div className="rounded-3xl overflow-hidden shadow-card">
              <MediaImage media={image} className="w-full h-auto object-cover" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

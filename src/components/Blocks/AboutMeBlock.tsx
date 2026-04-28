import { MediaImage } from '@/components/ui/MediaImage'
import { RichText } from '@/components/ui/RichText'

interface AboutMeBlockProps {
  heading?: string
  body?: any
  profileImage?: any
  certImages?: Array<{ image: any; alt?: string }>
}

export function AboutMeBlockComponent({ heading, body, profileImage, certImages }: AboutMeBlockProps) {
  return (
    <section className="py-16 px-6 md:px-16 bg-white">
      <div className="max-w-[1110px] mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start mb-12">
          <div>
            {heading && (
              <h2 className="font-display text-3xl md:text-5xl text-brand-dark mb-6">{heading}</h2>
            )}
            {body && <RichText content={body} className="text-brand-dark/70 leading-relaxed" />}
          </div>
          {profileImage && (
            <div className="rounded-3xl overflow-hidden shadow-card">
              <MediaImage media={profileImage} className="w-full h-auto object-cover" />
            </div>
          )}
        </div>
        {certImages && certImages.length > 0 && (
          <div className="flex flex-wrap gap-4 items-center">
            {certImages.map((cert, i) => (
              <div key={i} className="w-20 h-20">
                <MediaImage
                  media={cert.image}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

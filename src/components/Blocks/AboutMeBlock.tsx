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
    <section className="bg-white px-8 py-3 md:px-16 md:py-10">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid md:grid-cols-2 gap-15 items-start mb-6">
          <div>
            {heading && (
              <h2 className="font-display text-[32px] md:text-[48px] text-black mb-2">{heading}</h2>
            )}
            {body && <RichText content={body} className="text-black text-[14px] md:text-[16px] mb-10" />}

            {certImages && certImages.length > 0 && (
              <div className="flex flex-wrap gap-1 items-center">
                {certImages.map((cert, i) => (
                  <div key={i} className="w-[100px] h-[100px]">
                    <MediaImage
                      media={cert.image}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          {profileImage && (
            <div className="overflow-hidden">
              <MediaImage media={profileImage} className="w-[420px] pt-10 h-auto object-cover mx-auto flex items-start" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

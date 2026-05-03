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
        <div className="grid md:grid-cols-2 gap-0 md:gap-15 items-start mb-6">
          <div>
            {heading && (
              <h2 className="font-display text-[32px] md:text-[48px] text-black mb-2">{heading}</h2>
            )}
            {body && 
            <RichText content={body} className="text-black text-[14px] md:text-[16px] mb-8 md:mb-10 text-justify md:text-left" />
            }

            {/* show on desktop only */}
            {certImages && certImages.length > 0 && (
              <div className="hidden md:flex flex-wrap gap-1 items-center">
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
              <MediaImage media={profileImage} className="w-[210px] md:w-[420px] pt-0 md:pt-10 h-auto object-cover mx-auto flex items-start" />
            </div>
          )}

          {/* show on mobile only */}
          {certImages && certImages.length > 0 && (
            <div className="flex md:hidden flex-wrap gap-2.5 items-center w-[210px] mt-3 mx-auto">
              {certImages.map((cert, i) => (
                <div key={i} className="w-[63px] h-[63.33px]">
                  <MediaImage
                    media={cert.image}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

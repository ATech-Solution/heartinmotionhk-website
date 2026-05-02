import { MediaImage } from '@/components/ui/MediaImage'
import { RichText } from '@/components/ui/RichText'

interface Service {
  id?: string
  title?: string
  category?: string
  image?: any
  description?: any
  bulletPoints?: Array<{ point: string }>
}

interface ServiceDetailBlockProps {
  heading?: string
  subheading?: string
  services?: Service[]
}

export function ServiceDetailBlockComponent({ heading, subheading, services }: ServiceDetailBlockProps) {
  return (
    <section className="py-16 px-6 md:px-16">
      <div className="max-w-[1200px] mx-auto">
        {heading && (
          <h1 className="font-display text-[32px] md:text-[48px] text-black mb-3">{heading}</h1>
        )}
        {subheading && (
          <p className="text-black text-[16px] mb-12 max-w-[845px]">{subheading}</p>
        )}
        <div className="space-y-15">
          {services?.map((svc, i) => (
            <div key={svc.id ?? i} className={`max-w-[1100px] mx-auto grid md:grid-cols-2s gap-12 items-center ${i % 2 === 1 ? 'md:grid-flow-denses md:grid-cols-[1fr_285px]' : 'md:grid-cols-[285px_1fr]'}`}>
              <div className={i % 2 === 1 ? '' : 'md:col-start-2'}>
                {svc.title && (
                  <h2 className="font-display text-[28px] md:text-[40px] text-black mb-4 leading-none">{svc.title}</h2>
                )}
                {/* {svc.bulletPoints && svc.bulletPoints.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {svc.bulletPoints.map((bp, j) => (
                      <li key={j} className="flex gap-2 items-start text-[16px] text-black">
                        <span className="text-black mt-1 flex-shrink-0">›</span>
                        {bp.point}
                      </li>
                    ))}
                  </ul>
                )} */}
                {svc.description && (
                  <RichText content={svc.description} className="text-[16px] text-black leading-[1.5] service-desc" />
                )}
              </div>
              {svc.image && (
                <div className={`w-[285px] overflow-hidden ${i % 2 === 1 ? '' : 'md:col-start-1 md:row-start-1'}`}>
                  <MediaImage media={svc.image} className="w-[285px] h-auto object-contain" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

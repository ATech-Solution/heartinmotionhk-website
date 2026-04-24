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
    <section className="py-16 px-6 md:px-16 bg-white">
      <div className="max-w-5xl mx-auto">
        {heading && (
          <h1 className="font-display text-3xl md:text-5xl text-brand-dark mb-3">{heading}</h1>
        )}
        {subheading && (
          <p className="text-brand-dark/60 text-sm md:text-base mb-12 max-w-3xl">{subheading}</p>
        )}
        <div className="space-y-20">
          {services?.map((svc, i) => (
            <div key={svc.id ?? i} className={`grid md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
              <div className={i % 2 === 1 ? 'md:col-start-2' : ''}>
                {svc.title && (
                  <h2 className="font-display text-2xl md:text-3xl text-brand-dark mb-4">{svc.title}</h2>
                )}
                {svc.bulletPoints && svc.bulletPoints.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {svc.bulletPoints.map((bp, j) => (
                      <li key={j} className="flex gap-2 items-start text-brand-dark/70 text-sm">
                        <span className="text-brand-teal mt-1 flex-shrink-0">›</span>
                        {bp.point}
                      </li>
                    ))}
                  </ul>
                )}
                {svc.description && (
                  <RichText content={svc.description} className="text-brand-dark/60 text-sm leading-relaxed" />
                )}
              </div>
              {svc.image && (
                <div className={`rounded-3xl overflow-hidden shadow-card ${i % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}`}>
                  <MediaImage media={svc.image} className="w-full h-auto object-cover aspect-[4/3]" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

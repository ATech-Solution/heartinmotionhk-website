import { MediaImage } from '@/components/ui/MediaImage'

interface Service {
  id?: string
  title?: string
  category?: string
  image?: any
  description?: any
  bulletPoints?: Array<{ point: string }>
}

interface ServicesOverviewBlockProps {
  heading?: string
  subheading?: string
  services?: Service[]
}

export function ServicesOverviewBlockComponent({ heading, subheading, services }: ServicesOverviewBlockProps) {
  return (
    <section className="py-16 px-6 md:px-16 bg-white">
      <div className="max-w-5xl mx-auto">
        {heading && (
          <h2 className="font-display text-3xl md:text-4xl text-brand-dark mb-3">{heading}</h2>
        )}
        {subheading && (
          <p className="text-brand-dark/60 text-base mb-12 max-w-2xl">{subheading}</p>
        )}
        <div className="grid sm:grid-cols-3 gap-8">
          {services?.map((svc) => (
            <div key={svc.id} className="flex flex-col gap-4">
              {svc.image && (
                <div className="rounded-2xl overflow-hidden aspect-[4/3]">
                  <MediaImage media={svc.image} className="w-full h-full object-cover" />
                </div>
              )}
              {svc.title && (
                <h3 className="font-display text-xl text-brand-dark">{svc.title}</h3>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

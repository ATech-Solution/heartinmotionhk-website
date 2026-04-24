import { MediaImage } from '@/components/ui/MediaImage'

const colorMap: Record<string, string> = {
  teal: 'bg-brand-teal/10 border-brand-teal',
  yellow: 'bg-brand-yellow/40 border-brand-yellow',
  pink: 'bg-brand-pink/20 border-brand-pink',
  blue: 'bg-brand-blue/20 border-brand-blue',
}

interface Value {
  title?: string
  description?: string
  icon?: any
  color?: string
}

interface ValuesBlockProps {
  heading?: string
  values?: Value[]
}

export function ValuesBlockComponent({ heading, values }: ValuesBlockProps) {
  return (
    <section className="py-16 px-6 md:px-16 bg-brand-beige">
      <div className="max-w-6xl mx-auto">
        {heading && (
          <h2 className="font-display text-3xl md:text-4xl text-brand-dark mb-10 text-center">{heading}</h2>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values?.map((val, i) => (
            <div
              key={i}
              className={`rounded-3xl border-2 p-6 flex flex-col gap-4 ${colorMap[val.color ?? 'teal'] ?? colorMap.teal}`}
            >
              {val.icon && (
                <div className="w-14 h-14">
                  <MediaImage media={val.icon} className="w-full h-full object-contain" />
                </div>
              )}
              {val.title && (
                <h3 className="font-display text-xl text-brand-dark">{val.title}</h3>
              )}
              {val.description && (
                <p className="text-sm text-brand-dark/70 leading-relaxed">{val.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

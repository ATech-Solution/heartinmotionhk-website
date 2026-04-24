import { RichText } from '@/components/ui/RichText'

interface HeartTeamCoachingBlockProps {
  heading?: string
  body?: any
}

export function HeartTeamCoachingBlockComponent({ heading, body }: HeartTeamCoachingBlockProps) {
  return (
    <section className="py-14 px-6 md:px-16 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        {heading && (
          <h2 className="font-display text-3xl md:text-4xl text-brand-dark mb-6">{heading}</h2>
        )}
        {body && <RichText content={body} className="text-brand-dark/70 leading-relaxed text-base md:text-lg" />}
      </div>
    </section>
  )
}

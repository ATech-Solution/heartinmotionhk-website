import { MediaImage } from '@/components/ui/MediaImage'
import { RichText } from '@/components/ui/RichText'

interface RealChallengeBlockProps {
  heading?: string
  body?: any
  animatedGif?: any
}

export function RealChallengeBlockComponent({ heading, body, animatedGif }: RealChallengeBlockProps) {
  return (
    <section className="py-16 px-6 md:px-16 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          {heading && (
            <h2 className="font-display text-3xl md:text-4xl text-brand-dark mb-6">{heading}</h2>
          )}
          {body && <RichText content={body} className="text-brand-dark/70 leading-relaxed" />}
        </div>
        {animatedGif && (
          <div className="rounded-3xl overflow-hidden shadow-card">
            <MediaImage media={animatedGif} className="w-full h-auto" unoptimized />
          </div>
        )}
      </div>
    </section>
  )
}

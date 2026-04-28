import Link from 'next/link'
import { MediaImage } from '@/components/ui/MediaImage'
import { RichText } from '@/components/ui/RichText'
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll'

interface AboutShortcutBlockProps {
  heading?: string
  body?: any
  ctaLabel?: string
  ctaUrl?: string
  image?: any
}

export function AboutShortcutBlockComponent({
  heading,
  body,
  ctaLabel,
  ctaUrl,
  image,
}: AboutShortcutBlockProps) {
  return (
    <section className="bg-white py-10 px-4">
      <div className="max-w-[400px] mx-auto flex flex-col gap-6">
        {/* Decorative image */}
        {image && (
          <AnimateOnScroll animation="fade" className="flex justify-center">
            <MediaImage
              media={image}
              className="w-[180px] h-auto object-contain"
            />
          </AnimateOnScroll>
        )}

        {/* Text content */}
        <AnimateOnScroll animation="fade-up" delay={100}>
          <div className="flex flex-col gap-[30px]">
            {heading && (
              <h2 className="font-display text-[32px] text-black leading-[1.5]">
                {heading}
              </h2>
            )}
            {body && (
              <div className="text-[16px] text-[#3f3e3e] text-justify leading-[1.5]">
                <RichText content={body} />
              </div>
            )}
          </div>
        </AnimateOnScroll>

        {/* CTA button */}
        {ctaLabel && ctaUrl && (
          <AnimateOnScroll animation="fade-up" delay={200}>
            <Link
              href={ctaUrl}
              className="flex items-center justify-center gap-3 h-10 px-[15px] bg-[#86d0ef] rounded-[15px] text-[16px] font-bold text-black w-[328px] max-w-full hover:opacity-90 transition-opacity"
            >
              {ctaLabel}
              <span className="inline-block rotate-[-90deg] text-base leading-none">›</span>
            </Link>
          </AnimateOnScroll>
        )}
      </div>
    </section>
  )
}

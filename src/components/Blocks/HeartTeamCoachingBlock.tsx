import { RichText } from '@/components/ui/RichText'

interface HeartTeamCoachingBlockProps {
  heading?: string
  body?: any
}

export function HeartTeamCoachingBlockComponent({ heading, body }: HeartTeamCoachingBlockProps) {
  return (
    <section className="bg-[#f5eded] pt-[80px] pb-5 px-[52px] md:px-12">
      <div className="max-w-[1440px] mx-auto">
        {heading && (
          <h2 className="font-display text-[32px] md:text-[40px] text-black leading-[0.97] mb-6">
            {heading}
          </h2>
        )}
        {body && (
          <div className="text-[14px] md:text-[16px] text-black text-justify leading-[1.5] max-w-[883px] whitespace-pre-wrap">
            <RichText content={body} />
          </div>
        )}
      </div>
    </section>
  )
}

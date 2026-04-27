import type { Page } from '@/payload-types'
import { RichText } from '@/components/ui/RichText'
import { HeroBlockComponent } from './HeroBlock'
import { RealChallengeBlockComponent } from './RealChallengeBlock'
import { HeartTeamCoachingBlockComponent } from './HeartTeamCoachingBlock'
import { ValuesBlockComponent } from './ValuesBlock'
import { CTABlockComponent } from './CTABlock'
import { ServicesOverviewBlockComponent } from './ServicesOverviewBlock'
import { TestimonialsBlockComponent } from './TestimonialsBlock'
import { AboutMeBlockComponent } from './AboutMeBlock'
import { CoachingExperienceBlockComponent } from './CoachingExperienceBlock'
import { AboutHeartInMotionBlockComponent } from './AboutHeartInMotionBlock'
import { AboutShortcutBlockComponent } from './AboutShortcutBlock'
import { ServiceDetailBlockComponent } from './ServiceDetailBlock'
import { ContactFormBlockComponent } from './ContactFormBlock'
import { BookingSessionBlockComponent } from './BookingSessionBlock'
import { visibilityClasses } from '@/utils/visibilityClasses'

type LayoutBlock = NonNullable<Page['layout']>[number]

const blockComponents: Record<string, React.FC<any>> = {
  hero: HeroBlockComponent,
  'real-challenge': RealChallengeBlockComponent,
  'heart-team-coaching': HeartTeamCoachingBlockComponent,
  values: ValuesBlockComponent,
  cta: CTABlockComponent,
  'services-overview': ServicesOverviewBlockComponent,
  testimonials: TestimonialsBlockComponent,
  'about-me': AboutMeBlockComponent,
  'coaching-experience': CoachingExperienceBlockComponent,
  'about-him': AboutHeartInMotionBlockComponent,
  'about-shortcut': AboutShortcutBlockComponent,
  'service-detail': ServiceDetailBlockComponent,
  'contact-form': ContactFormBlockComponent,
  'booking-session': BookingSessionBlockComponent,
}

export function RenderBlocks({
  blocks,
  richTextContent,
}: {
  blocks: LayoutBlock[]
  richTextContent?: any
}) {
  if (!blocks || blocks.length === 0) {
    if (!richTextContent) return null
    return (
      <div className="max-w-[860px] mx-auto px-6 py-16">
        <RichText content={richTextContent} className="prose prose-lg max-w-none" />
      </div>
    )
  }

  return (
    <>
      {blocks.map((block, i) => {
        const Component = blockComponents[block.blockType]
        if (!Component) {
          console.warn(`RenderBlocks: unknown blockType "${block.blockType}"`)
          return null
        }
        const vis = (block as any).visibility
        const wrapClass = visibilityClasses(
          vis?.showOnMobile ?? true,
          vis?.showOnTablet ?? true,
          vis?.showOnDesktop ?? true,
        )
        return (
          <div key={i} className={wrapClass}>
            <Component {...block} />
          </div>
        )
      })}
    </>
  )
}

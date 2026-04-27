import type { Page } from '@/payload-types'
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
import { ServiceDetailBlockComponent } from './ServiceDetailBlock'
import { ContactFormBlockComponent } from './ContactFormBlock'
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
  'service-detail': ServiceDetailBlockComponent,
  'contact-form': ContactFormBlockComponent,
}

export function RenderBlocks({ blocks }: { blocks: LayoutBlock[] }) {
  if (!blocks || blocks.length === 0) return null

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

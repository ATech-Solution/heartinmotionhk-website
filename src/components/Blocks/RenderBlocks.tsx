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
        return <Component key={i} {...block} />
      })}
    </>
  )
}

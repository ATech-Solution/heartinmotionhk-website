import { getPayload } from 'payload'
import config from '@payload-config'

async function seed() {
  const payload = await getPayload({ config })

  // ── Admin user ──────────────────────────────────────────
  try {
    await payload.create({
      collection: 'users',
      data: {
        name: 'Tan Samuel',
        email: 'tan@atech.software',
        password: 'Admin@123456',
        role: 'admin',
        _verified: true,
      } as any,
    })
    console.log('✓ Admin user created')
  } catch {
    console.log('- Admin user already exists, skipping')
  }

  // ── Pages ────────────────────────────────────────────────
  const pages = [
    { title: 'Home', slug: 'home' },
    { title: 'About', slug: 'about' },
    { title: 'Services', slug: 'services' },
    { title: 'Contact', slug: 'contact' },
    { title: 'Privacy Policy', slug: 'privacy-policy' },
    { title: 'Terms & Conditions', slug: 'terms' },
  ] as const

  for (const page of pages) {
    try {
      await payload.create({
        collection: 'pages',
        data: {
          title: page.title,
          slug: page.slug,
          layout: [],
          _status: 'published',
        } as any,
      })
      console.log(`✓ Page "${page.slug}" created`)
    } catch {
      console.log(`- Page "${page.slug}" already exists, skipping`)
    }
  }

  // ── Globals ──────────────────────────────────────────────
  try {
    await payload.updateGlobal({
      slug: 'general-settings',
      data: {
        siteName: 'Heart in Motion HK',
        tagline: 'Step Forward with Your Heart',
        contactEmail: 'hello@heartinmotionhk.com',
        contactPhone: '',
        bookingUrl: '#',
        socialLinks: [],
      } as any,
    })
    console.log('✓ General settings updated')
  } catch (e) {
    console.log('- Could not update general settings:', e)
  }

  try {
    await payload.updateGlobal({
      slug: 'header',
      data: {
        navItems: [
          { label: 'Home', linkType: 'external', url: '/' },
          { label: 'About', linkType: 'external', url: '/about' },
          { label: 'Services', linkType: 'external', url: '/services' },
          { label: 'Contact', linkType: 'external', url: '/contact' },
        ],
        mobileCta: {
          connectLabel: "Let's connect",
          connectUrl: '#',
          emailLabel: 'Email me',
          emailUrl: 'mailto:hello@heartinmotionhk.com',
        },
      } as any,
    })
    console.log('✓ Header global updated')
  } catch (e) {
    console.log('- Could not update header:', e)
  }

  try {
    await payload.updateGlobal({
      slug: 'footer',
      data: {
        tagline: 'Step Forward with Your Heart',
        copyrightText: `© ${new Date().getFullYear()} Heart in Motion HK`,
        footerLinks: [
          { label: 'Privacy Policy', url: '/privacy-policy' },
          { label: 'Terms & Conditions', url: '/terms' },
        ],
      } as any,
    })
    console.log('✓ Footer global updated')
  } catch (e) {
    console.log('- Could not update footer:', e)
  }

  console.log('\nSeed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed error:', err)
  process.exit(1)
})

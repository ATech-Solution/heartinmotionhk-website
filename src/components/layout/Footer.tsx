import Image from 'next/image'
import Link from 'next/link'

const SOCIAL_LABELS: Record<string, string> = {
  facebook: 'f',
  linkedin: 'in',
  instagram: '📷',
  whatsapp: '💬',
}

interface FooterProps {
  footer?: {
    logo?: any
    navLinks?: Array<{ label?: string; page?: any; url?: string | null; id?: string | null }> | null
    socialLinks?: Array<{ platform?: string; url?: string | null; id?: string | null }> | null
    copyrightText?: string | null
  } | null
  general?: {
    contactEmail?: string | null
    contactPhone?: string | null
    contactAddress?: string | null
    siteName?: string | null
  } | null
}

function getPagePath(page: any) {
  if (!page) return '#'
  const slug = typeof page === 'object' ? page?.slug : page
  if (!slug || slug === 'home') return '/'
  return `/${slug}`
}

export function SiteFooter({ footer, general }: FooterProps) {
  const navLinks = footer?.navLinks ?? []
  const socialLinks = footer?.socialLinks ?? []
  const logoUrl = footer?.logo?.url ?? null

  return (
    <footer className="bg-brand-beige-dark border-t border-brand-beige-dark/60 pt-12 pb-6 px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Nav links */}
          <div>
            <nav className="space-y-2">
              {navLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.url ?? getPagePath(link.page)}
                  className="block text-sm text-brand-dark/60 hover:text-brand-teal transition-colors duration-150"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <p className="text-sm font-semibold text-brand-dark mb-3">Contact</p>
            <div className="space-y-2 text-sm text-brand-dark/60">
              {general?.contactAddress && (
                <p className="flex gap-2 items-start">
                  <span>📍</span>
                  <span>{general.contactAddress}</span>
                </p>
              )}
              {general?.contactPhone && (
                <p className="flex gap-2 items-center">
                  <span>📞</span>
                  <a href={`tel:${general.contactPhone}`} className="hover:text-brand-teal transition-colors">
                    {general.contactPhone}
                  </a>
                </p>
              )}
              {general?.contactEmail && (
                <p className="flex gap-2 items-center">
                  <span>✉️</span>
                  <a href={`mailto:${general.contactEmail}`} className="text-brand-teal hover:underline">
                    {general.contactEmail}
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden md:block" />

          {/* Logo */}
          <div className="flex justify-end items-start">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={general?.siteName ?? 'Heart in Motion HK'}
                width={100}
                height={60}
                className="h-auto w-24 object-contain"
              />
            ) : (
              <span className="font-display text-lg text-brand-dark">Heart in Motion</span>
            )}
          </div>
        </div>

        {/* Social + Copyright */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-brand-beige-dark/60">
          <p className="text-xs text-brand-dark/40">{footer?.copyrightText ?? `©${new Date().getFullYear()} Heart in Motion — All Rights Reserved`}</p>
          {socialLinks.length > 0 && (
            <div className="flex gap-3">
              {socialLinks.map((s, i) => (
                <a
                  key={i}
                  href={s.url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-brand-dark/10 hover:bg-brand-teal hover:text-white transition-colors duration-150 flex items-center justify-center text-xs font-bold text-brand-dark"
                  aria-label={s.platform}
                >
                  {SOCIAL_LABELS[s.platform ?? ''] ?? s.platform?.[0]?.toUpperCase()}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}

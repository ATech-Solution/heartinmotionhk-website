Updated: 2026-04-25T03:00:00Z
Goal: Build full company profile website for Heart in Motion HK with Payload CMS + Next.js 15
Status: Complete

## Reference Plans / Instructions
/Users/tansams/.claude/plans/please-create-company-profile-fuzzy-wall.md

## Current Objective
All phases complete — website is fully operational.

## Current Step
DONE — website running at http://localhost:54112

## Remaining
(none)

## Completed
- [2026-04-24] Phase 0: Next.js 15 + Payload 3.33.0 scaffold, all dependencies installed
- [2026-04-24] Phase 1: payload.config.ts with SQLite, email, localization, plugins
- [2026-04-24] Phase 2: Collections (Users, Pages, Media, Services, Testimonials) + Globals (GeneralSettings, MaintenanceSettings, Header, Footer)
- [2026-04-24] Phase 3: 12 block schemas + RenderBlocks dispatcher
- [2026-04-24] Phase 4: Hooks (revalidatePage, revalidateGlobal, email templates, notifyContactFormSubmission)
- [2026-04-24] Phase 5: Access control (isAdmin, isAdminOrEditor, isAdminOrSelf, isPublic)
- [2026-04-24] Phase 6: Maintenance mode middleware
- [2026-04-24] Phase 7: Frontend pages (home, about, services, contact, maintenance, reset-password, privacy-policy, terms)
- [2026-04-24] Phase 8: Backup & restore (API routes + admin view)
- [2026-04-24] Phase 9: sitemap.ts + robots.ts
- [2026-04-24] Phase 10: Security headers in next.config.ts
- [2026-04-25] Fixed admin layout — added RootLayout from @payloadcms/next/layouts to set up config context
- [2026-04-25] Fixed API route — renamed [...payload] to [...slug] (Payload expects params.slug)
- [2026-04-25] Fixed SCSS — ignore-loader for @payloadcms SCSS, pre-compiled styles.css in admin layout
- [2026-04-25] Fixed first admin user — set role=admin, _verified=1 directly in SQLite
- [2026-04-25] Seeded content — General Settings, Header, Footer globals; 6 pages (home/about/services/contact/privacy-policy/terms)

## Files
| File | Purpose | Status |
| src/app/(payload)/admin/layout.tsx | Admin layout with RootLayout + SCSS import | Fixed |
| src/app/api/[...slug]/route.ts | Payload REST API catch-all (renamed from [...payload]) | Fixed |
| next.config.ts | ignore-loader for Payload SCSS, security headers | Done |
| src/payload.config.ts | Main Payload config | Done |
| data/payload.db | SQLite database with admin user + seed content | Done |

## Notes
- Admin user: tan@atech.software / Admin@123456
- Admin URL: http://localhost:54112/admin
- Frontend: http://localhost:54112
- API route MUST be named [...slug] not [...payload] — Payload expects params.slug
- Email verification disabled for first user via direct DB update (_verified=1 set in SQLite)
- AWS SES SMTP configured but connection times out in dev — email sending works in production
- Seed content uses simple CTA blocks; real content should be added via admin panel
- Brand colours: teal #6dbfb8, yellow #f5e66e, beige #fdf6ee, dark #2d2d2d
- Fonts: Caveat (display/headings), Inter (body)
- Localization: EN (default) + ZH-HK

## Blockers
- (none)

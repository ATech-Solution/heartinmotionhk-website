# CLAUDE.md — Planning & Execute Rules 
This file provides guidance to Claude Code when working with code in this repository.

## Project
`heartinmotionhk-website` — Website company profile
Built for Heartinmotionhk. A website company profile that give information for the customer

## PHASE 1
<!-- ## Architecture -->
## Tech Stack
- **Backend:** Payload 3.33.0 + FastAPI (all services)
- **Frontend:** Next.js v15.5.15 + Tailwind CSS
- **Relational DB:** SQLlite

## Languages Supported
English, Traditional Chinese (ZH-HK)

<!-- ## Key Design Decisions -->
<!-- ## Shared Code -->

## Environment Variables
See `.env.example`. Required keys:
- MAINTENANCE_MODE
- NEXT_PUBLIC_SITE_URL
- NEXT_PUBLIC_SITE_URL_DEV
- NEXT_PUBLIC_SITE_URL_PROD
- NODE_ENV=development
- PAYLOAD_PUBLIC_SERVER_URL
- PAYLOAD_PUBLIC_SERVER_URL_DEV
- PAYLOAD_PUBLIC_SERVER_URL_PROD
- PAYLOAD_SECRET
- NEXT_PUBLIC_DOMAIN
- NEXT_PUBLIC_DOMAIN_DEV
- NEXT_PUBLIC_DOMAIN_PROD
- DATABASE_URL=file:./data/payload.db
- PAYLOAD_MEDIA_DIR
- NEXT_PUBLIC_MEDIA_URL
- AWS_SES_SMTP_HOST
- AWS_SES_SMTP_PORT
- AWS_SES_SMTP_USER
- AWS_SES_SMTP_PASSWORD
- EMAIL_FROM
- EMAIL_FROM_NAME

<!-- ## Test Cases -->
## Phase 3

## Reference Design
See `temporary screenshots/` folder:
- `home-desktop-view-screenshot.png` — Home desktop view responsive
- `home-mobile-view-screenshot.png` - Home mobile view responsive
- `about-desktop-view-screenshot.png` - About desktop view responsive
- `about-mobile-view-screenshot.png` - About mobile view responsive
- `services-desktop-view-screenshot.png` - Services desktop view responsive
- `services-mobile-view-screenshot.png` - Services mobile view responsive
- `contact-desktop-view-screenshot.png` - Contact desktop view responsive
- `contact-mobile-view-screenshot.png` - Contact mobile view responsive
- `Privacy Policy popup.png` - Privacy Policy popup
- `Terms & Conditions popup.png` - Terms & Conditions popup

## Design Frontend
Please follow `FRONTEND.md` for build design frontend requirement

# Documentation
Create project documentation on `documentation`

# Session Continuity

`PROGRESS.md` is a crash-recovery file. Its only purpose is to enable instant resumption after
an unexpected interruption — no re-reading code, no re-researching state. It is not a permanent
log; delete it when all objectives are complete.

## On Session Start
- If `PROGRESS.md` exists → read it, verify listed files exist, resume from **Current Step**. Do not redo completed steps, but you should verify they are fully complete in case of partial progress.
- If it doesn't → create it from the template below before writing any code.

## On Successful Completion of a Step / Meaningful Progress
- Update progress in case of sudden interruption

## On Session End
- **All objectives complete** → delete `PROGRESS.md`, confirm deletion in chat.
- **Incomplete or interrupted** → sync `PROGRESS.md` fully, then post to chat:
  > "Paused. Next: [Current Step]. Read `PROGRESS.md` to resume."

## Update Triggers
Write to `PROGRESS.md` immediately after each — do not batch or defer:

| Trigger | Action |
|---------|--------|
| Step finished | Move to Completed (with timestamp); update Current Step |
| File created/modified | Add/update row in Files |
| Decision made | Add to Notes |
| Blocker hit/cleared | Update Blockers; set Status accordingly |
| Before any long operation | Flush current state first so an interruption mid-task is recoverable |

## PROGRESS.md Template
```markdown
Updated: <!-- ISO timestamp -->
Goal: <!-- one sentence -->
Status: <!-- In Progress | Blocked -->

## Reference Plans / Instructions
<!-- Path to plan if exists / started from plan mode. or important instructions -->

## Current Objective
<!-- Current partial objective / checkpoint for the session. This marks when to stop the session and pause -->

## Current Step
<!-- exact next action — if interrupted here, this is where to resume -->

## Remaining
1. <!-- ordered -->

## Completed
- [timestamp] step – outcome

## Files
| File | Purpose | Status |

## Notes
- <!-- decisions, constraints, gotchas -->

## Blockers
- <!-- none -->

## Phase 3
## Testing
- Do fully testing for the frontend and backend
```
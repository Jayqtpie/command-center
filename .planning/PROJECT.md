# GuidedBarakah Command Center

## Vision
Premium founder-facing command center for GuidedBarakah. A single-page scrolling command surface — NOT a dashboard. Editorial hierarchy, premium dark mode, no card soup.

## Tech Stack
- Next.js 15 (App Router, TypeScript, src/ directory)
- Tailwind CSS v4
- Recharts (brand-wrapped charts)
- Motion (subtle animations)
- Lucide React (icons)
- clsx + tailwind-merge
- No component library, no backend, dark mode only

## Architecture
Single scrolling page with 6 editorial bands:
1. **Executive Overview** — above fold, hero metrics + greeting
2. **Strategic Focus** — priorities before metrics, active initiatives
3. **Growth Intelligence** — charts, trends, audience growth
4. **Content Intelligence** — what's working, top performers
5. **Operations Visibility** — systems health, uptime, alerts
6. **Manual Input Area** — workbench for founder actions

## Color System
| Token | Hex |
|-------|-----|
| bg-deep | #0D1B1E |
| bg-surface | #111F22 |
| bg-elevated | #162A2E |
| brand-teal | #1A535C |
| brand-gold | #C9A84C |
| text-primary | #FAF0E6 |
| text-muted | #A0B4B0 |
| text-dim | #5A7A74 |
| status-green | #2D6A4F |
| status-amber | #B5651D |
| status-red | #8B2500 |

## Constraints
- Dark mode only — no light mode toggle
- Single page, no routing needed
- Mock data only — no backend integration
- Premium editorial feel, not generic dashboard

# RechargePaisa — Design System

## Overview
Real-money gaming and recharge platform for Indian market. Vibrant, energetic design celebrating wealth creation through gameplay. Dark indigo premium base with gold prosperity accents, teal earnings highlights, and orange excitement triggers.

## Tone & Voice
Trustworthy, celebratory, energetic. Gaming fintech that makes every win feel rewarding and transactions feel secure.

## Palette (OKLCH)

| Token | OKLCH | Purpose |
|-------|-------|----------|
| Primary (Gold) | 0.62 0.22 60 | Prosperity, CTAs, wallet balance |
| Secondary (Teal) | 0.55 0.18 180 | Earnings, rewards, growth |
| Accent (Orange) | 0.65 0.15 50 | Urgency, entry fees, alerts |
| Destructive (Red) | 0.58 0.24 20 | Losses, withdrawals |
| Success (Green) | 0.6 0.16 140 | Winning moments, transactions |
| Background (Dark Indigo) | 0.13 0.08 255 | Premium, trustworthy foundation |
| Foreground (Light) | 0.98 0.01 270 | Text on dark |
| Card (Dark Blue) | 0.22 0.1 250 | Game cards, transaction items |
| Border (Indigo) | 0.28 0.08 255 | Subtle separation |
| Muted (Grey) | 0.35 0.05 260 | Secondary text, disabled states |

## Typography

| Role | Font | Usage |
|------|------|-------|
| Display | Bricolage Grotesque | Headings, game titles, account balance |
| Body | DM Sans | Descriptive text, form labels, transaction details |
| Mono | GeistMono | Paisa amounts, reference numbers |

## Structural Zones

| Zone | Treatment | Purpose |
|------|-----------|----------|
| Header | Solid dark indigo, gold accent line, user wallet quick-view | Navigation + wallet summary |
| Game Library | Cards on dark background, hover/scale effect, entry fee badge (gold), potential winnings badge (teal) | Browse and launch games |
| Wallet | Gradient gold/teal section, large balance display (display font), transaction list with icons | Money management hub |
| Transaction History | Striped rows, status badges (green/red), paisa amounts right-aligned | Clear spending/earning record |
| Admin Dashboard | Revenue chart (primary + chart colors), user activity table, withdrawal queue | Business metrics |
| Footer | Subtle border-top, minimal footer with links | Light closure |

## Component Patterns

- **Game Cards**: Rounded (12px), hover scale 102%, shadow elevation on interaction. Entry fee as orange accent badge, winnings in teal.
- **Buttons**: Primary (gold) for actions, secondary (teal) for alternates. Rounded 8px, 2px padding scale on active.
- **Wallet Display**: Large bold balance in display font, primary color. Subtext in muted. Gradient background (gold-to-teal 20% opacity).
- **Transaction Rows**: Monospace amounts, status icon left, clear visual hierarchy. Alternating bg-card / bg-background.
- **Input Fields**: Border-based, focus ring in primary color, placeholder in muted.

## Motion

- Page enter: 180ms fade-in + slight up movement (existing `page-enter`)
- Game card hover: 300ms smooth scale + shadow lift
- Button interaction: 100ms active state scale-down
- Transaction list: Staggered fade-in 50ms per row

## Spacing & Rhythm

- Base unit: 4px (Tailwind default)
- Padding: 16px (cards), 24px (sections), 32px (page margins)
- Gap: 12px (card grids), 8px (form fields)
- Line height: 1.5 (body), 1.2 (headings)

## Constraints

- Max 3 primary colors per screen (gold, teal, orange)
- No full-page gradients; use gradient accents on cards/buttons only
- Shadows: Always include border for card depth (no shadow-alone separation)
- Contrast: AA+ on all interactive elements and muted text

## Signature Details

- Game entry fee badge in orange accent with gold text — creates risk/reward visual language
- Wallet section background: subtle gradient (primary/accent at 20% opacity) — celebrates money
- Transaction amounts in monospace at full opacity — precision financial display
- Rounded card corners (12px) + hover scale — friendly, playful gaming energy

## Dark Mode

Default theme is dark (designed for dark indigo base). Light mode not implemented (gaming platforms thrive on dark UI).

# Phase 1: Luxury Design System, Warm Cream Dot-Grid Canvas & Unified Navigation Shell

## 1. Objective & Scope
Rebuild the core visual foundation of AutoUGC to match Fastlane's warm, luxury, executive design aesthetic. Replace the generic dark/neon style with Fastlane's signature warm cream canvas, dot-grid texture, terracotta brand accents, retro digital LCD typography, and persistent left-hand navigation sidebar with live workspace credit tracking.

---

## 2. Design Tokens & Styling Specifications

### 2.1 Color Palette
```css
:root {
  /* Canvas & Backgrounds */
  --bg-canvas: #FAF8F5;          /* Warm Ivory / Cream base canvas */
  --bg-canvas-subtle: #F5F2EC;   /* Slightly deeper warm cream for secondary areas */
  --bg-surface: #FFFFFF;         /* Crisp white card surface */
  --bg-surface-hover: #FDFCFB;   /* Card hover surface */
  --bg-surface-elevated: #FFFFFF;

  /* Borders & Dividers */
  --border-subtle: #EFECE6;      /* Ultra-soft warm divider */
  --border-default: #E5E0D8;     /* Standard card border */
  --border-active: #D9D2C7;      /* Hover / focused border */

  /* Brand Accents (Fastlane Terracotta / Burnt Orange) */
  --brand-primary: #D95D39;      /* Signature warm terracotta */
  --brand-primary-hover: #C54E2C;
  --brand-subtle: #FDF3EF;       /* 10% tinted terracotta background */
  --brand-border: #F3CEBE;       /* Soft terracotta border */
  --brand-glow: rgba(217, 93, 57, 0.15);

  /* Action & Neutrals (Deep Charcoal / Black) */
  --action-primary: #18181B;     /* Deep charcoal pill buttons */
  --action-primary-hover: #09090B;
  --action-text: #FFFFFF;

  /* Text Hierarchy */
  --text-primary: #18181B;       /* Near-black primary text */
  --text-secondary: #52525B;     /* Muted body text */
  --text-muted: #8E8B85;         /* Metadata, hints, subtle labels */
  --text-terracotta: #D95D39;    /* Goal labels, active indicators */

  /* Dot Matrix Pattern */
  --dot-color: #E6E1D8;          /* 1.5px dot color */
  --dot-spacing: 24px;           /* 24px dot grid repeat */
}
```

### 2.2 Background Dot Grid Implementation
The root layout applies Fastlane's signature subtle dot grid:
```css
.fastlane-grid-bg {
  background-color: var(--bg-canvas);
  background-image: radial-gradient(var(--dot-color) 1.2px, transparent 1.2px);
  background-size: var(--dot-spacing) var(--dot-spacing);
  background-position: 0 0;
}
```

### 2.3 Typography: Modern Sans + Digital LCD Monospace
1. **Body & Headings**: `Inter` / `Geist Sans` for clean, professional, readable layouts.
2. **Numbers & Metric Displays**: A dedicated retro **Dot-Matrix / LCD Digital Monospace** font (via `@next/font/google` using `VT323` or `Silkscreen` or a crisp monospace styling) for counters like:
   - `348 days live`
   - `50 cr` / `50 credits`
   - `45+ a month`
   - `53%`
   - Clock displays (`8:11 AM`)

---

## 3. Component Architecture: Unified Sidebar Shell (`AppSidebar.tsx`)

Fastlane uses a persistent, high-density left sidebar with 4 distinct vertical sections:

```
┌──────────────────────────────────────┐
│ [Logo Icon]  [Brand Selector v]      │  <-- Top Header
├──────────────────────────────────────┤
│  Home                     • 1        │
│  Campaigns                           │
│  Studio                              │  <-- Navigation Stack
│  Brand                               │      (Clean SVG icons,
│  Radar                               │       orange pill indicator)
│  Analytics                           │
├──────────────────────────────────────┤
│  CHATS                          [+]  │  <-- Conversational Threads
│  No threads yet.                     │
├──────────────────────────────────────┤
│ ┌──────────────────────────────────┐ │
│ │ [Icon] HumanifyLab         50 cr │ │  <-- Bottom Workspace Badge
│ │ [====---------] 20% used       ^ │ │      (Live credit consumption)
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

### 3.1 Detailed Sidebar Specifications

1. **Brand Selector (`WorkspaceSelector.tsx`)**:
   - Shows brand avatar + current brand name (e.g., `HumanifyLab`).
   - Clean chevron down. Clicking opens a dropdown with:
     - Active workspace checkmark.
     - Switch Brand / Add New Brand (`+ New Brand`).
     - Workspace Settings shortcut.

2. **Core Navigation Items (`SidebarNavLinks.tsx`)**:
   - **Home** (`/dashboard`): House icon. Shows notification dot (e.g. `• 1` when a campaign requires review).
   - **Campaigns** (`/campaigns`): Target / Layers icon. Direct review deck for pending ad posts.
   - **Studio** (`/studio`): Sparkle / Wand icon. Custom ad generator, competitor remixer, and image/video canvas.
   - **Brand** (`/brand`): Fingerprint icon. Core brand knowledge base (USPs, audience personas, visual assets, tone).
   - **Radar** (`/radar`): Radar / Crosshair icon. Competitor ad intelligence and creative spy tool.
   - **Analytics** (`/analytics`): Bar chart icon. Aggregated ROAS, CTR, impressions, and ad spend.

3. **Conversational Copilot Section (`SidebarChats.tsx`)**:
   - Section header: `Chats` with a small `+` icon button for creating a new creative thread.
   - Lists active prompt threads (e.g., "Meta Retargeting Hook", "Competitor Remix Batch") or empty state `"No threads yet."`

4. **Workspace Credit Footer (`WorkspaceCreditBadge.tsx`)**:
   - Enclosed in a warm white card (`#FFFFFF`) with `#EFECE6` border.
   - Left: Brand icon thumbnail.
   - Center: Brand name + segmented progress bar (`20% used`).
   - Right: Credit counter (`50 cr`) + expand chevron up (`^`).
   - Clicking opens the subscription management drawer or Stripe upgrade modal.

---

## 4. Top Header & Global Actions Bar

Visible across all authenticated app pages:
- **Left**: Current view title or breadcrumb (e.g., `Settings > Integrations`).
- **Right**:
  - Live local clock (e.g., `8:11 AM` in LCD digital font).
  - Status pills: `Sat 31 Oct · [Brand] · 50 credits · Copilot trial ends 7 Nov`.
  - **`Upgrade` button**: Deep charcoal rounded pill (`#18181B`).
  - **`See plans` button**: White surface pill with subtle border (`#E5E0D8`).
  - **Theme Toggle**: Moon / Sun clean SVG pill.

---

## 5. File Modifications & Additions

| File Path | Purpose |
| :--- | :--- |
| [`src/app/globals.css`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/app/globals.css) | Add warm cream theme variables, `.fastlane-grid-bg`, dot-matrix typography rules. |
| [`src/components/layout/AppShell.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/components/layout/AppShell.tsx) | New master authenticated layout wrapping the persistent sidebar and main canvas. |
| [`src/components/layout/AppSidebar.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/components/layout/AppSidebar.tsx) | Fastlane-styled left navigation sidebar with all 4 vertical tiers. |
| [`src/components/layout/WorkspaceSelector.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/components/layout/WorkspaceSelector.tsx) | Workspace switcher dropdown with brand logos. |
| [`src/components/layout/WorkspaceCreditBadge.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/components/layout/WorkspaceCreditBadge.tsx) | Bottom credit usage progress bar and upgrade trigger. |
| [`src/components/layout/TopHeaderBar.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/components/layout/TopHeaderBar.tsx) | Global top navigation bar with live time, trial countdown, and upgrade pills. |

---

## 6. Verification Criteria
- [ ] Dot-grid background renders cleanly at 24px intervals with zero flicker on scrolling.
- [ ] Digital LCD monospace font renders crisp numbers for credits (`50 cr`) and days.
- [ ] Sidebar collapses smoothly on tablet/mobile screens with an accessible toggle.
- [ ] Active route has terracotta tinted background pill (`#FDF3EF`) with orange accent icon.
- [ ] Zero unicode emojis present across all sidebar icons, tooltips, and badges.
- [ ] `tsc --noEmit` passes with 0 type errors.


# Phase 3: Executive Home Command Center & Conversational Copilot

## 1. Objective & Scope
Transform `/dashboard` into an executive growth cockpit matching Fastlane's Home screen (Screenshot 3). Replace the fragmented cards with:
1. Dynamic founder greeting (`Morning, [Name]`) with live digital clock and status pills.
2. Prominent brand goal declaration (`• GOAL ...`).
3. Single high-priority action card (`◆ NEXT UP · THE 1 THING THAT NEEDS YOU`).
4. Interactive Pace Gauge with retro digital speedometer dial and 3 metric ledgers.
5. Persistent bottom-docked AI Copilot prompt bar with glowing orange accent, intent chips, and keyboard shortcuts.

---

## 2. Visual Layout Architecture (Screenshot 3 Exact Match)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Morning, Segni                       8:11 AM  Sat 31 Oct · 50 cr [Ask Copilot] │
│ • GOAL  Sell more HumanifyLab plans to people who want natural sounding text │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ ◆ NEXT UP · THE 1 THING THAT NEEDS YOU│ PACE                                 │
│ ┌──────────────────────────────────┐ │ ┌──────────────────────────────────┐ │
│ │ [YOUR NEXT STEP] Starter campaign│ │ │           ╭───────╮              │ │
│ │ 3 of 30 made · connect Meta...   │ │ │         ╭╯    |    ╰╮  Speedometer│ │
│ │ Launch your campaign             │ │ │        (      •      ) Dial Gauge │ │
│ │                                  │ │ │ views a day, Sun to Fri. No views│ │
│ │ [Thumb1] [Thumb2] [Thumb3]       │ │ ├────────────┬───────────┬────────┤ │
│ │                         [Open →] │ │ │ POSTS OUT  │ AD SPEND  │ CREDITS│ │
│ │                                  │ │ │ 0 of 0     │ None      │   50   │ │
│ └──────────────────────────────────┘ │ └────────────┴───────────┴────────┘ │
├──────────────────────────────────────┴──────────────────────────────────────┤
│ ╭─────────────────────────────────────────────────────────────────────────╮ │
│ │ Ask Copilot for an ad, a campaign, or anything about AutoUGC         [↑]│ │
│ │  • Image   • Video   • Script   • Campaign      Enter send · Shift Enter│ │
│ ╰─────────────────────────────────────────────────────────────────────────╯ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Specifications

### 3.1 Header & Brand Goal (`DashboardExecutiveHeader.tsx`)
- **Greeting**: Dynamic based on local time (`Morning, [Name]` / `Afternoon, [Name]` / `Evening, [Name]`).
- **Clock & Meta Bar**:
  - Live clock formatted via digital LCD font (`8:11 AM`).
  - Metadata pill: `[Day Date] · [BrandName] · [N] credits · Trial ends [Date]`.
  - Action pills: `[Ask Copilot]` (surface pill) and Theme toggle.
- **Brand Goal Strip**:
  - Terracotta bullet: `• GOAL`
  - High-impact goal statement derived from the brand profile:
    `Sell more [Brand] plans to people who want [Primary Value Proposition]`.

### 3.2 "The 1 Thing That Needs You" Card (`NextActionHeroCard.tsx`)
Eliminates founder paralysis by spotlighting exactly one next step:
- **Badge Ribbon**: Terracotta solid ribbon in top left: `YOUR NEXT STEP`
- **Right Meta**: Subtle badge indicating active campaign (e.g. `Starter campaign`).
- **Status Summary**: `3 of 30 made · connect your Meta ad account, then launch`
- **Title**: Large bold heading: `Launch your campaign`
- **Ad Preview Carousel**: 3 interactive ad cards showing the generated video/image ads ready to launch.
- **CTA Button**: Deep charcoal pill button: `Open →` linking directly to the Campaign Review Deck (`/campaigns`).

### 3.3 The Pace Gauge & Metric Pod (`PaceGaugeCard.tsx`)
Visualizes ad posting velocity and campaign momentum:
- **Header**: Subtle uppercase `PACE`
- **Speedometer Dial (`SpeedometerDial.tsx`)**:
  - Semi-circular retro digital arc with tick marks.
  - Dynamic needle rotating based on current daily view run-rate vs. goal.
  - Footnote: `views a day, Sun to Fri. No views yet.`
- **3 Metric Pods (Side-by-Side)**:
  - **Posts Out**: Label `POSTS OUT`, digital metric `0 of 0 this week`, footnote `Nothing booked yet.`
  - **Ad Spend This Week**: Label `AD SPEND THIS WEEK`, text `None`, footnote `No ads running. Copilot can add them to a campaign.`
  - **Credits**: Label `CREDITS`, large digital LCD number `50`.

### 3.4 Docked AI Copilot Prompt Bar (`DockedCopilotBar.tsx`)
A persistent floating conversational bar anchored at the bottom:
- **Glow Accent**: Subtle 1.5px orange gradient along the top border (`linear-gradient(90deg, transparent, #D95D39, transparent)`).
- **Prompt Input**: Borderless clean input with placeholder:
  `"Ask Copilot for an ad, a campaign, or anything about AutoUGC"`
- **Send Button**: Sleek dark circular button with upward arrow (`↑`).
- **Quick Intent Chips**:
  - `• Image` (triggers static carousel/single ad generation)
  - `• Video` (triggers 9:16 vertical UGC ad generation)
  - `• Script` (triggers high-converting viral copy generation)
  - `• Campaign` (triggers multi-ad campaign planning)
- **Footer Shortcut**: `Enter to send · Shift Enter new line` in muted micro-typography.

---

## 4. Backend & State Integration

1. `GET /api/v1/dashboard/summary`
   - Returns:
     - Founder name and brand goal.
     - Active campaign progress (`completedPosts`, `totalPosts`, `connectedAccounts`).
     - Real-time weekly pace statistics (`viewsToday`, `weeklySpend`, `availableCredits`).
     - Next critical action object.

2. `POST /api/v1/copilot/chat`
   - Handles conversational requests from the docked prompt bar.
   - Powered by Gemini / structured agent tools to generate ad variations, write copy, or modify campaign settings.

---

## 5. File Modifications & Additions

| File Path | Purpose |
| :--- | :--- |
| [`src/app/dashboard/page.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/app/dashboard/page.tsx) | Complete rewrite of `/dashboard` to match Fastlane's Executive Home screen. |
| [`src/components/dashboard/DashboardExecutiveHeader.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/components/dashboard/DashboardExecutiveHeader.tsx) | Greeting, live clock, brand goal strip, and status pills. |
| [`src/components/dashboard/NextActionHeroCard.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/components/dashboard/NextActionHeroCard.tsx) | "The 1 Thing That Needs You" priority launch card with ad carousel. |
| [`src/components/dashboard/PaceGaugeCard.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/components/dashboard/PaceGaugeCard.tsx) | Pace speedometer dial and 3 metric ledger boxes. |
| [`src/components/dashboard/SpeedometerDial.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/components/dashboard/SpeedometerDial.tsx) | Canvas/SVG retro digital speedometer gauge. |
| [`src/components/dashboard/DockedCopilotBar.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/components/dashboard/DockedCopilotBar.tsx) | Persistent floating bottom AI Copilot command bar. |

---

## 6. Verification Criteria
- [ ] Greeting automatically updates based on time of day (Morning/Afternoon/Evening).
- [ ] Live digital clock updates every second with zero re-rendering lag on parent layout.
- [ ] Speedometer needle smoothly transitions based on actual campaign metrics.
- [ ] Pressing `Enter` in the docked Copilot bar submits prompts without page reload.
- [ ] Clicking `Open →` on "The 1 Thing That Needs You" navigates to `/campaigns`.
- [ ] 0 emojis across all dashboard elements.


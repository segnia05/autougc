# Phase 6: Competitor Radar, Multi-Format Studio & Creative Remix Engine

## 1. Objective & Scope
Build the Competitor Radar (`/radar`) and Multi-Format Studio (`/studio`) matching Fastlane (Screenshot 1). Fastlane does not generate only one type of video; it offers a multi-format ad generation suite including **Competitor Remixes**, **Product UI Overlays**, **Dark-Mode Smartphone Mockups**, and **High-Converting Static Problem/Solution Ads**, all organized in a sleek "Your latest" creative gallery.

---

## 2. Visual Layout Architecture (Screenshot 1 Exact Match)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                      [Upgrade]  [See plans] │
│                                                                             │
│ Your latest                                                                 │
│ From chats, campaigns and Studio, newest first                    Library > │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────┐  ┌──────────────────────┐  ┌─────────────────────┐ │
│ │  [ChatGPT UI Mockup] │  │ [4-Grid Competitor]  │  │ [Relatable Hook UI] │ │
│ │                      │  │                      │  │                     │ │
│ │  Image · Natural...  │  │  Remix of competitor │  │  Image · Deadline...│ │
│ │  Paid ad · runs in   │  │  Image · Application │  │  Paid ad · runs in  │ │
│ │  its campaign        │  │  Paid ad · runs in...│  │  its campaign       │ │
│ └──────────────────────┘  └──────────────────────┘  └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Breakdown

### 3.1 Creative Studio Feed (`StudioLatestFeed.tsx`)
Displays all generated ad creatives across formats:
- **Header Actions**:
  - `[Upgrade]` black rounded pill button.
  - `[See plans]` white outlined pill button.
- **Section Heading**:
  - Title: `Your latest` (medium/semibold modern sans).
  - Subtitle: `From chats, campaigns and Studio, newest first` + `Library >` right-aligned link.
- **Multi-Format Ad Cards**:
  - **Format 1: Smartphone UI Mockup**: High-contrast iPhone interface showing the software in action (e.g., ChatGPT prompt with natural human response).
  - **Format 2: Competitor Remix**: Split-screen or 4-panel comparison breaking down how the user's product solves a flaw in a rival's tool (`Remix of a competitor ad · [RivalName]`).
  - **Format 3: Relatable Problem / Emotion Hook**: High-emotion lifestyle or founder struggle scene (`How life feels after finding this tool`).
  - **Card Metadata**: Format pill (`Image` or `Video`), creative title, and status `Paid ad · runs in its campaign`.

### 3.2 Competitor Radar Spy Engine (`/radar`)
The growth secret behind Fastlane:
- **Rival Tracker Table**: Shows tracked competitors (e.g., `GPTHuman.ai`, `Walter Writes`, `Linear`, `Notion`).
- **Longevity Tracker**: Real-time days live (e.g. `348 days live`). If an ad has run for 300+ days, it is proven to be profitable.
- **One-Click Remix**:
  - Clicking `[Remix this ad]` extracts:
    - Hook structure (e.g., "The mistake 90% of students make when writing essays")
    - Visual pacing (text message reveal -> software fix -> CTA)
  - Automatically adapts the script to feature the user's brand name and USP.

---

## 4. Backend & API Services

1. `GET /api/v1/studio/creatives`
   - Returns paginated list of all generated creatives (videos, UI images, remixes, carousels) with campaign association and performance tags.

2. `GET /api/v1/radar/competitors`
   - Returns monitored rivals, active ad counts, longest-running ad metrics, and format breakdown.

3. `POST /api/v1/radar/remix`
   - Accepts: `{ competitorAdId: string, brandId: string }`
   - Generates a bespoke ad script and storyboard based on the competitor's winning ad structure.

---

## 5. File Modifications & Additions

| File Path | Purpose |
| :--- | :--- |
| [`src/app/studio/page.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/app/studio/page.tsx) | Update Studio gallery to match Screenshot 1 multi-format feed. |
| [`src/app/radar/page.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/app/radar/page.tsx) | Complete Competitor Radar view with longevity tracking and remix CTA. |
| [`src/components/studio/CreativeCard.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/components/studio/CreativeCard.tsx) | Individual multi-format creative card with preview, badges, and status. |
| [`src/components/radar/CompetitorAdCard.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/components/radar/CompetitorAdCard.tsx) | Rival ad card showing days live, creative format, and remix trigger. |
| [`src/lib/intelligence/creativeRemixService.ts`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/lib/intelligence/creativeRemixService.ts) | Service to analyze competitor hooks and synthesize customized brand ads. |

---

## 6. Verification Criteria
- [ ] Creative cards render accurately across all 3 formats (UI Mockup, Competitor Remix, Emotion Hook).
- [ ] Clicking any creative card opens a full-screen preview with high-res export options.
- [ ] Competitor Radar shows accurate days-live metrics and allows one-click remix generation.
- [ ] Zero emojis across all labels, tags, and status badges.


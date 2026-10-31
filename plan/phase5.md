# Phase 5: Ad Network Integrations & Autopilot Campaign Launcher

## 1. Objective & Scope
Build the Ad Network Integrations & Settings Hub (`/settings/integrations`) matching Fastlane (Screenshot 2). Provide seamless OAuth and API connections for Meta Ads (Facebook & Instagram), TikTok, YouTube Shorts, and LinkedIn, along with Fastlane's signature "Warmed Accounts" feature for founders who want AutoUGC to run ads through pre-warmed publisher pixels.

---

## 2. Visual Layout Architecture (Screenshot 2 Exact Match)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ < Settings                                                                  │
│ Integrations                                                                │
│ WHERE AUTOUGC POSTS · 0 OF 10 CONNECTED                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ [TikTok Logo]  TikTok                                                   │ │
│ │                Log in to TikTok in this browser first         [Connect] │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ [IG Logo]      Instagram                                                │ │
│ │                Log in to Instagram in this browser first      [Connect] │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ [YT Logo]      YouTube                                                  │ │
│ │                Not connected                                  [Connect] │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ [LinkedIn]     LinkedIn                                                 │ │
│ │                Not connected · connections expire in 60d...   [Connect] │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ Ready-made accounts we run for you have their own page in Settings.         │
│ [Warmed accounts >]                                                         │
│                                                                             │
│ ADS                                                                         │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ [Meta Logo]    Meta ad account                                          │ │
│ │                AutoUGC runs paid posts from it                        > │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Breakdown

### 3.1 Organic / Social Publisher Connections (`SocialChannelsCard.tsx`)
Enclosed in a unified white card with soft dividers between networks:
- **Header**: Section label: `WHERE AUTOUGC POSTS · [X] OF 10 CONNECTED`
- **TikTok**:
  - Logo SVG + `TikTok`
  - Guidance text: `Log in to TikTok in this browser first`
  - Action: `[Connect]` button linking to TikTok OAuth v2 endpoint.
- **Instagram**:
  - Logo SVG + `Instagram`
  - Guidance text: `Log in to Instagram in this browser first`
  - Action: `[Connect]` button linking to Meta Graph API permissions.
- **YouTube**:
  - Logo SVG + `YouTube`
  - Status text: `Not connected` (or channel handle when connected)
  - Action: `[Connect]` button linking to Google OAuth YouTube upload scope.
- **LinkedIn**:
  - Logo SVG + `LinkedIn`
  - Guidance note: `LinkedIn connections expire every 60 days; you will be prompted to reconnect.`
  - Action: `[Connect]` button linking to LinkedIn Community Management API.

### 3.2 Warmed Accounts Bridge (`WarmedAccountsCallout.tsx`)
Solves the primary cold-start problem for new founders (ad account bans, unseasoned pixels):
- **Descriptive Text**: `Ready-made accounts we run for you have their own page in Settings.`
- **Action Pill**: `[Warmed accounts >]` linking to `/settings/warmed-accounts`.
- Displays managed, high-reputation ad accounts that can run campaigns without risking personal ad manager bans.

### 3.3 Paid Ad Manager Hub (`PaidAdNetworksCard.tsx`)
Dedicated section for paid advertising accounts:
- **Header**: Subtle uppercase `ADS`
- **Meta Ad Account**:
  - Meta infinity logo SVG.
  - Title: `Meta ad account`
  - Subtitle: `AutoUGC runs paid posts from it`
  - Chevron right (`>`) opening the Meta Business Manager picker to select Ad Account ID, Pixel ID, and target Facebook Page.

---

## 4. Backend OAuth & Campaign Dispatch Engine

### 4.1 Integration Schema (Neon PostgreSQL)
```prisma
model AdAccountIntegration {
  id              String   @id @default(cuid())
  workspaceId     String
  provider        String   // "meta" | "tiktok" | "youtube" | "linkedin"
  accountId       String?  // e.g. act_123456789
  accountName     String?  // e.g. "HumanifyLab Growth Ad Account"
  pixelId         String?
  accessToken     String   // AES-256 encrypted
  refreshToken    String?  // AES-256 encrypted
  tokenExpiresAt  DateTime?
  status          String   @default("active") // "active" | "expired" | "disconnected"
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  workspace       Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
}
```

### 4.2 API Endpoints
1. `GET /api/v1/integrations`
   - Returns connected channels and their live status for the active workspace.
2. `GET /api/v1/integrations/meta/auth`
   - Initiates Meta OAuth flow requesting `ads_management`, `pages_manage_ads`, `instagram_basic`.
3. `POST /api/v1/integrations/meta/launch`
   - Autonomously creates Campaign, AdSet, and Ad Creative inside the user's Meta Ad Manager using the rendered 9:16 video.

---

## 5. File Modifications & Additions

| File Path | Purpose |
| :--- | :--- |
| [`src/app/settings/integrations/page.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/app/settings/integrations/page.tsx) | Complete Integrations settings screen matching Screenshot 2. |
| [`src/components/settings/SocialChannelsCard.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/components/settings/SocialChannelsCard.tsx) | TikTok, Instagram, YouTube, and LinkedIn connection rows. |
| [`src/components/settings/WarmedAccountsCallout.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/components/settings/WarmedAccountsCallout.tsx) | Warmed accounts link and explanation banner. |
| [`src/components/settings/PaidAdNetworksCard.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/components/settings/PaidAdNetworksCard.tsx) | Meta Ad Account configuration card. |
| [`src/lib/publishers/metaAdsPublisher.ts`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/lib/publishers/metaAdsPublisher.ts) | Automated Meta Marketing API client for deploying campaigns. |

---

## 6. Verification Criteria
- [ ] Connect buttons launch secure OAuth popups or redirect flows with proper state tokens.
- [ ] Connected channels display green status indicators and actual account names.
- [ ] Meta Ad Account modal allows selecting Pixel ID and Ad Account.
- [ ] Warmed accounts button navigates to dedicated managed accounts screen.
- [ ] Zero emojis across all labels, buttons, and subtexts.


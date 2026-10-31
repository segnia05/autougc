# Phase 2: 4-Step Competitor Intelligence & Viral Onboarding Funnel

## 1. Objective & Scope
Build Fastlane's signature 4-step onboarding funnel (`/onboarding`). Replace the basic website scraping modal with an intelligent growth onboarding sequence that extracts the user's URL, analyzes their competitor ad landscape, computes real niche benchmarks, and presents their first 3 ready-to-launch ads before transitioning into the dashboard.

---

## 2. Fastlane Onboarding Stepper Structure

The top navigation features a minimalist dashed stepper with global exit actions:

```
[Logo]           YOU ─── YOUR ADS ─── YOUR BRAND ─── FIRST ADS           [Finish later] [Log out]
```

### 2.1 Step Progression & User Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│ STEP 1: YOU                                                            │
│ - Website URL input (e.g. "https://linear.app")                        │
│ - Founder full name (e.g. "Segni")                                     │
│ - Referral discovery ("Where did you hear about us?" - X, TikTok, etc)│
│ - Background triggers live website scraping + 2560x1600 screenshot    │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STEP 2: YOUR BRAND                                                     │
│ - Instant brand confirmation (Brand Name, Category, Primary Target)    │
│ - Live Viewport Screenshot preview (captured via Microlink)            │
│ - Editable Core USP & Primary Goal statement                           │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STEP 3: YOUR ADS & COMPETITOR RADAR (Screenshot 5 Match)               │
│ - Live competitor scraping based on product category                   │
│ - Card 1: Longest-Running Rival Ad (e.g. "348 days live")              │
│ - Card 2: Niche Ad Velocity (e.g. "45+ a month") with mini bar chart   │
│ - Card 3: Video vs. Static Ratio (e.g. "53% of rivals ads are video")  │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ STEP 4: FIRST ADS (The Aha! Moment)                                    │
│ - "3 free ads" generated instantly:                                    │
│    1. Competitor Winning Remix (proven format adapted to user's brand) │
│    2. Founder / Product Demo Overlay Ad (using captured screenshot)   │
│    3. High-Energy Direct Response UGC Hook                             │
│ - [Continue ↵] button -> Direct transition into Executive Dashboard    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. UI Component Breakdown (Screenshot 5 Exact Specification)

### 3.1 Longest-Running Ad Card (`LongestRunningAdCard.tsx`)
- **Card Header**: Subtle uppercase label: `LONGEST-RUNNING AD`
- **Hero Metric**: Large dot-matrix LCD number: `348` + lowercase label `days live`.
- **Subtitle**: `[CompetitorName]'s ad is still running.` (e.g., `GPTHuman.ai's ad is still running.`)
- **Visual Proof**:
  - Competitor video thumbnail with rounded border.
  - Footnote: `Started about a year ago. Ads that run this long work.`

### 3.2 Ads Launched in Your Niche (`NicheAdVelocityCard.tsx`)
- **Card Header**: `ADS LAUNCHED IN YOUR NICHE`
- **Hero Metric**: Dot-matrix LCD number: `45+` + `a month`
- **Context**: `[TopCompetitor] alone launches [N].` (e.g., `Walter Writes AI alone launches 22.`)
- **Mini Histogram**: 6 vertical bar segments representing the past 6 months (May, Jun, Jul, Aug, Sep, Oct), with the current month highlighted in active terracotta orange (`#D95D39`).

### 3.3 Video Share Card (`VideoShareMetricCard.tsx`)
- **Card Header**: `VIDEO SHARE`
- **Hero Metric**: Dot-matrix LCD number: `53%`
- **Subtitle**: `of your rivals' ads are video.`
- **Segmented Bar**: Visual comparison bar with orange segment for Video (53%) and muted gray segment for Static (47%).

### 3.4 Your First Ads Deck (`FirstAdsDeckCard.tsx`)
- **Card Header**: `YOUR FIRST ADS`
- **Hero Metric**: Dot-matrix LCD text: `3 free ads`
- **Promise**: `We remix your best ad, 1 of [Competitor]'s, and make 1 in a new format.`
- **3-Card Interactive Grid**:
  - **Ad 1**: Competitor Remix thumbnail with badge `Remix of a competitor ad`.
  - **Ad 2**: Captured Software Mockup / UGC Creator ad with live screenshot overlay.
  - **Ad 3**: Terracotta outlined placeholder: `+ New format`.

---

## 4. Backend & API Services

### 4.1 Onboarding State Machine & API Endpoints
1. `POST /api/v1/onboarding/analyze`
   - Accepts: `{ url: string, founderName: string, referralSource: string }`
   - Executes:
     - Scrapes target website metadata + viewport screenshot via `screenshotService.ts`.
     - Detects product category (e.g., "AI Writing / Productivity").
     - Queries synthetic or live competitor registry for active ads in that category.
     - Calculates category metrics (`longestRunningDays`, `monthlyNicheVelocity`, `videoSharePercentage`).
   - Returns: Complete competitor radar profile + pre-generated 3 ad variations.

2. `POST /api/v1/onboarding/complete`
   - Saves `BrandProfile`, creates initial `Campaign` ("Starter Campaign"), seeds the 3 generated `AdCreatives`, credits the user with 50 initial trial credits, and sets `onboardingCompleted: true`.

---

## 5. File Modifications & Additions

| File Path | Purpose |
| :--- | :--- |
| [`src/app/onboarding/page.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/app/onboarding/page.tsx) | Complete 4-step Fastlane onboarding wizard with dashed stepper. |
| [`src/components/onboarding/StepYou.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/components/onboarding/StepYou.tsx) | URL, founder name, and referral source capture. |
| [`src/components/onboarding/StepBrand.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/components/onboarding/StepBrand.tsx) | Brand review, audience selection, and screenshot verification. |
| [`src/components/onboarding/StepRadar.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/components/onboarding/StepRadar.tsx) | Competitor Radar view (Longest-running ad, niche velocity, video share). |
| [`src/components/onboarding/StepFirstAds.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/components/onboarding/StepFirstAds.tsx) | "Your First 3 Ads" presentation and transition into dashboard. |
| [`src/lib/intelligence/competitorRadarService.ts`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/lib/intelligence/competitorRadarService.ts) | Backend service computing competitor ad lifespan, velocity, and remix angles. |

---

## 6. Verification Criteria
- [ ] Onboarding URL input automatically triggers background screenshot and metadata scrape.
- [ ] Competitor radar step displays realistic benchmarks matching the target domain's niche.
- [ ] Digital LCD monospace font renders correctly for `348`, `45+`, and `53%`.
- [ ] 3 ad cards render with high-res thumbnails and clean labels.
- [ ] Clicking "Continue" seamlessly transitions into `/dashboard` with founder name personalized.
- [ ] 100% responsive on desktop and mobile viewports with zero emojis.


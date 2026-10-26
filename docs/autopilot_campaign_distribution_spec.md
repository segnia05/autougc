# Autopilot 30-Day Drip-Feed Campaign & Multi-Account Distribution Engine
## Engineering & Product Specification (v1.0)

**Status:** APPROVED FOR IMPLEMENTATION  
**Author:** Technical Co-Founder & Principal Architect  
**Workspace:** `c:\Users\Hello\Desktop\projects\UGC_project`  
**Date:** 2026-10-26  

---

## 1. Executive Summary & Value Proposition

### 1.1 The Core Problem in UGC Marketing
SaaS founders and DTC brand operators do not struggle with generating a single video; they struggle with **consistency, volume, and distribution**. 
- Giving a customer 20 or 60 raw video files at once forces them to manually download, edit, write captions, and post 3 times a week across multiple social accounts. 
- 80% of users drop off after week one, leading to high subscription churn.

### 1.2 The Solution: Autonomous 30-Day Drip-Feed Engine
AutoUGC evolves from a simple video generator into an **Autonomous 30-Day Organic Distribution Machine**:
1. **Target Timezone Intelligence:** Automatically identifies and targets local peak engagement hours in the customer's primary market (e.g., US EST 12:00 PM, 4:00 PM, or 7:00 PM).
2. **Predictable Drip Cadence:** Automatically maps 20, 60, or 180 videos across a 30-day calendar (e.g., Mon / Wed / Fri / Sun).
3. **Multi-Account "Clipping Army" Distribution (Growth & Scale):** Distributes posts across 5 to 15 linked social accounts (main brand + satellite/burner accounts).
4. **Anti-Duplicate Shadowban Engine:** Generates unique psychological hook angles, voice actors, and subtitle styles for each account to prevent TikTok and Meta perceptual hashing penalties.
5. **Permanent Creative Media Vault:** Videos are archived permanently on Cloudflare R2 ($0 egress fees) with 1-click downloads and live post performance links.

---

## 2. Plan Tiering & Distribution Quota Matrix

| Tier | Price | Monthly Videos | Social Accounts | Cadence & Distribution Model | Unit COGS | Gross Margin |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Starter** | **$49 / mo** | **20 Videos** | 1 Brand Account per platform | Mon / Wed / Fri / Sun drip (~4 posts/week for 1 account). | **$0.40** | **98.2%** |
| **Growth (Most Popular)** | **$89 / mo** | **60 Videos** | **Up to 5 Accounts** | 2 posts/day rotated across 5 satellite accounts (12 unique videos/mo per account). | **$1.20** | **98.6%** |
| **Scale / Agency** | **$199 / mo** | **180 Videos** | **Up to 15 Accounts** | 6 posts/day distributed across 15 accounts (12 videos/mo per account). | **$3.60** | **98.1%** |

---

## 3. The Anti-Shadowban Permutation Matrix

When 5 accounts post about the same product (e.g., an AI Humanizer or DTC product), **identical videos will be flagged as duplicate spam within 60 seconds by TikTok and Instagram algorithms**, resulting in 0–200 view shadowbans.

To guarantee algorithmic independence, our Distribution Engine permutes **4 creative layers** for every single slot:

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                      THE 4-LAYER PERMUTATION MATRIX                           │
├───────────────┬──────────────────────────────┬───────────────┬────────────────┤
│ Account       │ Hook Angle (Gemini 2.5)      │ Voice Actor   │ Subtitle Style │
├───────────────┼──────────────────────────────┼───────────────┼────────────────┤
│ Account 1     │ Pattern Interrupt (Negative) │ Marcus (Male) │ Hormozi Amber  │
│ Account 2     │ Secret Hack / Curiosity      │ Chloe (GenZ)  │ Beast Cyan     │
│ Account 3     │ Problem → Agitation → Relief │ Leo (Casual)  │ Electric Emerald│
│ Account 4     │ Social Proof / Case Study    │ Sophia (Warm) │ Minimal White  │
│ Account 5     │ Direct Feature Demo / Myth   │ Alex (Punchy) │ Violet Bold    │
└───────────────┴──────────────────────────────┴───────────────┴────────────────┘
```

Every generated video produces:
1. Distinct visual first frame and headline text.
2. Distinct audio speech waveform and pacing.
3. Distinct caption copy and hashtag clusters.
4. Clean individual tracking IDs.

---

## 4. Timezone & Target Country Peak-Hour Scheduling

Targeting the correct audience country requires timezone-aware scheduling:

| Target Market | Primary Timezone | Peak Engagement Slots (Local Time) | UTC Offset |
| :--- | :--- | :--- | :--- |
| **United States (East)** | `America/New_York` (EST/EDT) | 12:00 PM, 4:00 PM, 7:30 PM | UTC-5 / UTC-4 |
| **United States (West)** | `America/Los_Angeles` (PST/PDT) | 12:00 PM, 4:00 PM, 7:30 PM | UTC-8 / UTC-7 |
| **United Kingdom** | `Europe/London` (GMT/BST) | 1:00 PM, 5:30 PM, 8:00 PM | UTC+0 / UTC+1 |
| **European Union** | `Europe/Berlin` (CET/CEST) | 1:00 PM, 5:30 PM, 8:00 PM | UTC+1 / UTC+2 |
| **Australia** | `Australia/Sydney` (AEST/AEDT) | 12:30 PM, 6:00 PM, 8:30 PM | UTC+10 / UTC+11 |

The user picks their target country and preferred slot; the system calculates exact UTC timestamps for queue execution.

---

## 5. Database Schema Upgrades (`prisma/schema.prisma`)

```prisma
// 1. Project Model Enhancements
model Project {
  // Existing fields...
  targetCountry       String?  @default("US") @map("target_country")
  targetTimezone      String   @default("America/New_York") @map("target_timezone")
  postingCadence      String   @default("mon_wed_fri_sun") @map("posting_cadence")
  preferredHour       Int      @default(16) @map("preferred_hour") // 16 = 4:00 PM local
  campaigns           Campaign[]
}

// 2. SocialAccount Model Enhancements
model SocialAccount {
  // Existing fields...
  accountNickname     String?  @map("account_nickname") // e.g. "Main Brand", "Burner 1 - Student Hacks"
  isBurner            Boolean  @default(false) @map("is_burner")
  dailyPostLimit      Int      @default(2) @map("daily_post_limit")
}

// 3. ScheduledPost Model Enhancements
model ScheduledPost {
  // Existing fields...
  campaignId          String?  @map("campaign_id")
  hookAngle           String?  @map("hook_angle") // pattern_interrupt, curiosity_hack, problem_agitation
  voiceId             String?  @map("voice_id")
  targetTimezone      String?  @map("target_timezone")
  localScheduledTime  String?  @map("local_scheduled_time") // Human-readable e.g. "Mon, Nov 3 @ 4:00 PM EST"
  postUrl             String?  @map("post_url") // Live link once published

  campaign            Campaign? @relation(fields: [campaignId], references: [id], onDelete: SetNull)
}

// 4. New Campaign Model
model Campaign {
  id                  String   @id @default(uuid())
  projectId           String   @map("project_id")
  organizationId      String   @map("organization_id")
  name                String
  cadence             String   @default("mon_wed_fri_sun")
  targetTimezone      String   @default("America/New_York")
  totalVideos         Int      @map("total_videos")
  status              String   @default("active") // active, completed, paused
  startDate           DateTime @default(now()) @map("start_date")
  endDate             DateTime @map("end_date")
  createdAt           DateTime @default(now()) @map("created_at")
  updatedAt           DateTime @updatedAt @map("updated_at")

  project             Project         @relation(fields: [projectId], references: [id], onDelete: Cascade)
  scheduledPosts      ScheduledPost[]

  @@index([organizationId, status])
  @@map("campaigns")
}
```

---

## 6. API Architecture & Contracts

### 6.1 `POST /api/v1/campaigns/auto-schedule`
Generates a complete 30-day schedule distributing the quota across accounts and dates.

* **Request Body:**
```json
{
  "projectId": "proj_123",
  "cadence": "mon_wed_fri_sun",
  "targetTimezone": "America/New_York",
  "preferredHour": 16,
  "socialAccountIds": ["acc_1", "acc_2", "acc_3"],
  "totalVideos": 20
}
```

* **Response Envelope:**
```json
{
  "success": true,
  "data": {
    "campaignId": "camp_abc",
    "totalScheduled": 20,
    "startDate": "2026-11-01T16:00:00Z",
    "endDate": "2026-11-30T16:00:00Z",
    "postsPerAccount": {
      "acc_1": 7,
      "acc_2": 7,
      "acc_3": 6
    }
  }
}
```

### 6.2 `GET /api/v1/social/accounts`
Lists all connected social accounts with their nicknames, platform type, and active post counts.

### 6.3 `POST /api/v1/social/accounts`
Allows connecting multiple social accounts with distinct labels (e.g., adding satellite burner accounts).

---

## 7. Frontend User Experience & UI Specifications

### 7.1 The "Auto-Schedule 30-Day Drip" Wizard (`AutoScheduleModal.tsx`)
A streamlined 3-step modal accessible from the Publishing Calendar:
1. **Step 1: Cadence & Quota**: Choose posting days (`Mon/Wed/Fri/Sun`, `Daily`, `Weekdays`) and video quota (e.g. 20, 60, or custom).
2. **Step 2: Audience Timezone**: Select Country/Region (`US East`, `US West`, `UK`, `EU`, `Australia`) and preferred peak hour (`Lunch 12 PM`, `Afternoon 4 PM`, `Evening 7:30 PM`).
3. **Step 3: Account Distribution Matrix**: Select which connected accounts to include (Multi-select pills: `@main_brand`, `@burner_hacks`, `@student_ai`). Displays distribution balance.
4. **1-Click Generation:** Generates the entire month in under 1 second.

### 7.2 The Enhanced Publishing Calendar (`PublishingCalendar.tsx`)
1. **Account Filter Bar:** Filter calendar cards by specific social account or view all.
2. **Card Visuals:**
   - Account Pill: e.g. `[TikTok: @student_hacks]`
   - Angle Badge: `[Pattern Interrupt]` / `[Secret Hack]`
   - Time Badge: `4:00 PM EST`
   - Status Badge: `Queued` (Amber), `Live` (Emerald with clickable link), `Failed` (Red).
3. **Permanent Library Link:** Click any card to preview the video composition, copy captions, or download the pristine 1080x1920 MP4 file.

---

## 8. Implementation Steps & Verification Gates

* **Task 1:** Update `prisma/schema.prisma` with `Campaign`, project timezone fields, and social account enhancements; run `prisma generate`.
* **Task 2:** Build the deterministic distribution engine in `src/lib/social/distributionEngine.ts` that calculates dates, times, and rotates hook angles and voice actors.
* **Task 3:** Create API endpoints `/api/v1/campaigns/auto-schedule` and `/api/v1/social/accounts`.
* **Task 4:** Build `AutoScheduleModal.tsx` wizard component.
* **Task 5:** Upgrade `PublishingCalendar.tsx` with multi-account filters, timezone labels, and the wizard launch button.
* **Task 6:** Create comprehensive unit tests in `tests/distributionEngine.test.ts`.
* **Task 7:** Run `npm run typecheck`, `npm run lint`, and tests to verify zero regressions.
* **Task 8:** Commit cleanly with Conventional Commits.

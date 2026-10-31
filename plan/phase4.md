# Phase 4: Campaigns Review & Batch Execution Deck

## 1. Objective & Scope
Build the dedicated Campaign Review & Batch Execution Deck (`/campaigns`) matching Fastlane (Screenshot 4). This replaces traditional table-based ad management with a focused, swipeable creative deck where founders can review drafts, swap creators or angles, edit scripts, and batch-produce entire campaign runs with a single click.

---

## 2. Visual Layout Architecture (Screenshot 4 Exact Match)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                             [ 9:16 Video Player ]                           │
│                                                                             │
│                   [Swap 2]         [Skip 4]         [Edit 3]                │
│                                                                             │
│            <               [✦ Make 5 credits  (o)]               >          │
├────────────────────────────┬────────────────────────────┬───────────────────┤
│ YOUR CREDITS               │ ACCOUNTS                   │ THE GOAL          │
│ 50 credits                 │                            │                   │
│ 3 of 30 made · 27 posts to │ [Meta Logo] Meta ads       │ Sell more plans   │
│ make, 1,232 credits        │             Needed for ads │ to people who     │
│                            │                            │ want natural text │
│ [Cover all posts 1,182 cr→]│ [Connect]                  │                   │
│                            │                            │ their essays to   │
│ Covering adds credits...   │                            │ sound natural...  │
│ ◆ AI can make mistakes.    │                            │                   │
└────────────────────────────┴────────────────────────────┴───────────────────┘
```

---

## 3. Component Breakdown

### 3.1 Creative Review Deck (`CampaignAdViewer.tsx`)
- **9:16 Vertical Player Frame**:
  - Displays the active ad video or high-res motion draft.
  - Shows animated captions, hook overlay, and live product mockup.
  - Includes play/pause toggle and scrubber.

- **Fast Action Trio Pills**:
  - **`[Swap N]`**: Opens creator & angle drawer. Lets the user switch to alternative creator personas (e.g. Sarah, Alex, Marcus) or hook angles while retaining the core script.
  - **`[Skip N]`**: Advances to the next pending creative draft in the queue without consuming credits.
  - **`[Edit N]`**: Opens full modal editor for headline, voice script, caption style, and background track.

- **Primary Production Control**:
  - Chevron buttons (`<` and `>`) to navigate between campaign posts.
  - **`[✦ Make 5 credits]` pill button**:
    - Deep charcoal pill with glowing sparkle icon (`✦`).
    - Toggle indicator showing credit cost per render.
    - Clicking triggers the Remotion render worker to produce the finalized high-res MP4.

### 3.2 Credit Ledger & Batch Coverage Card (`CampaignCreditLedgerCard.tsx`)
Provides complete financial and resource transparency:
- **Header**: `YOUR CREDITS`
- **Hero Number**: Large dot-matrix LCD text: `50 credits`
- **Campaign Run-Rate**: `3 of 30 made · 27 posts still to make, 1,232 credits`
- **Primary Batch Action Button**:
  - Black rounded pill: `Cover all posts · 1,182 credits →`
  - Instantly opens Stripe checkout pre-calculated for the exact credit shortfall.
- **Reassurance Copy**:
  `Covering adds 1,182 credits, enough to make every draft. Nothing is made or charged until you press Make. Launch asks you to confirm first. Drafts nobody made stay drafts; Make them any time.`
- **Integrity Notice**:
  `◆ AI can make mistakes. Check each post before it goes out.` (using clean terracotta diamond `◆`).

### 3.3 Connected Accounts Card (`CampaignAccountsCard.tsx`)
- **Header**: `ACCOUNTS`
- **Ad Network Row**:
  - Meta logo SVG + `Meta ads`
  - Subtext: `Needed for ads`
  - Action: `[Connect]` button linking to OAuth flow or status badge `Connected` with green dot.

### 3.4 Campaign Goal Card (`CampaignGoalCard.tsx`)
- **Header**: `THE GOAL`
- **Primary Statement**: Large bold typography articulating the brand objective.
- **Secondary Detail**: Core customer problem and desired emotional transformation.

---

## 4. Backend & API Endpoints

1. `GET /api/v1/campaigns/[id]`
   - Returns campaign details, list of all 30 planned posts (draft, rendered, scheduled, launched), credit balance, and connected ad accounts.

2. `POST /api/v1/campaigns/[id]/posts/[postId]/swap`
   - Swaps the creator or hook angle for a specific post.

3. `POST /api/v1/campaigns/[id]/posts/[postId]/render`
   - Deducts 5 credits from workspace balance and triggers the async Remotion background render worker.

4. `POST /api/v1/campaigns/[id]/batch-cover`
   - Generates a Stripe checkout session for purchasing the exact credit difference required to produce all remaining campaign drafts.

---

## 5. File Modifications & Additions

| File Path | Purpose |
| :--- | :--- |
| [`src/app/campaigns/page.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/app/campaigns/page.tsx) | Complete Campaign Deck screen matching Screenshot 4. |
| [`src/components/campaigns/CampaignAdViewer.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/components/campaigns/CampaignAdViewer.tsx) | 9:16 Video player with Swap, Skip, Edit, and Make controls. |
| [`src/components/campaigns/CampaignCreditLedgerCard.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/components/campaigns/CampaignCreditLedgerCard.tsx) | Credit balance, run-rate, and "Cover all posts" CTA. |
| [`src/components/campaigns/CampaignAccountsCard.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/components/campaigns/CampaignAccountsCard.tsx) | Meta Ad account connection status card. |
| [`src/components/campaigns/CampaignGoalCard.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/components/campaigns/CampaignGoalCard.tsx) | Brand mission and target conversion goal card. |
| [`src/components/campaigns/AdSwapModal.tsx`](file:///c:/Users/Hello/Desktop/projects/UGC_project/src/components/campaigns/AdSwapModal.tsx) | Creator and hook variation switcher modal. |

---

## 6. Verification Criteria
- [ ] Navigating between posts with `<` and `>` updates video preview instantaneously.
- [ ] `[Swap]` opens modal displaying available alternative creators and hook angles.
- [ ] `[Make 5 credits]` verifies credit balance before dispatching render job.
- [ ] Credit calculation (`totalPosts - completedPosts * 5`) accurately reflects remaining cost.
- [ ] Zero emojis across all action buttons, notices, and headings.


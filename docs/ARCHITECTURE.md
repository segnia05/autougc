# AutoUGC — Architecture & Developer Guide

Welcome to the **AutoUGC** codebase. This guide serves as the architectural manifesto and onboarding documentation for developers working on the platform.

---

## 1. System Overview

AutoUGC is an autonomous B2B SaaS platform that turns product URLs into high-converting 9:16 vertical video ads (TikTok, Instagram Reels, YouTube Shorts) and orchestrates 30-day drip-feed publishing across multi-account social fleets.

### Core Value Metric
- **Time to First Ad**: $< 60\text{ seconds}$ from URL input to playable 1080p preview.
- **Cadence**: 30-day automated drip scheduling across up to 15 accounts per organization.
- **Visual Standard**: Organic, high-converting Creator UGC with natural lighting, subtle camera physics, and clear TikTok safe zones.

---

## 2. Modular Architecture & Directory Map

The codebase adheres strictly to domain-driven modularity. Heavy computational logic is decoupled from UI components and synchronous HTTP request cycles.

```
UGC_PROJECT/
├── prisma/
│   └── schema.prisma         # Multi-tenant PostgreSQL schema (Neon DB with PgBouncer)
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── api/v1/           # Versioned REST APIs (Projects, Scripts, Audio, Videos, Social, Webhooks)
│   │   │   └── health/       # Kubernetes/ECS Liveness and Readiness probes
│   │   ├── dashboard/        # Customer Command Center (Publishing calendar, video vault, accounts)
│   │   ├── studio/           # Remotion video creative editor (Canvas, Subtitles, Audio, Personas)
│   │   ├── error.tsx         # Root UI Error Boundary with automated self-healing
│   │   ├── global-error.tsx  # Root layout critical fail-safe HTML boundary
│   │   └── not-found.tsx     # Custom 404 navigation recovery page
│   ├── components/           # Atomic Design System & UI Components
│   │   ├── ui/               # Reusable primitives (Button, Input, Card, Badge, Modal)
│   │   ├── studio/           # CanvasPlayer, ScriptEditor, SubtitleStyler, CreatorVisualPicker
│   │   ├── dashboard/        # AutoScheduleModal, PublishingCalendar
│   │   └── layout/           # Navbar, Footer
│   ├── db/
│   │   └── client.ts         # Pooled PrismaClient with slow query telemetry (>150ms)
│   ├── lib/                  # Pure Business Logic & Domain Services
│   │   ├── ai/               # Gemini AI script generator, viral angles, prompt engineering
│   │   ├── audio/            # Neural TTS synthesis, timecode alignment, audio ducking
│   │   ├── auth/             # Multi-tenant Clerk context resolution (User & Org DB sync)
│   │   ├── backup/           # SHA-256 cryptographic backup manifests & PITR recovery
│   │   ├── billing/          # Stripe checkout, subscription sync, atomic credit ledgers
│   │   ├── cache/            # Distributed cache manager (SWR, thundering herd coalescing)
│   │   ├── creators/         # Certified creator personas (Sarah Miller, Alex Chen, etc.)
│   │   ├── monitoring/       # Real-time latency percentiles (p50, p95, p99), error budgets
│   │   ├── queue/            # Background job queue (critical, standard, low priority pools, DLQ)
│   │   ├── resilience/       # Circuit breakers & exponential backoff retries with jitter
│   │   ├── scraper/          # Cheerio web scraper, SSRF private subnet filter, palette extractor
│   │   ├── security/         # Sliding-window rate limiting, CSRF origin verification, AES-256 crypto
│   │   └── social/           # Multi-account distribution engine, OAuth token encryption, scheduler
│   └── workers/
│       └── socialPublisher.ts # Horizontally scalable social media publishing batch worker
└── tests/                    # 21 comprehensive automated unit & security audit test suites
```

---

## 3. Core Architectural Patterns

### 3.1 Multi-Tenancy & Strict Isolation
- Every database entity (`Project`, `Video`, `ScheduledPost`, `SocialAccount`) is strictly scoped by `organizationId`.
- Queries and mutations must filter by the authenticated tenant's `organizationId`.
- Verified in `tests/dashboardTenancyIsolation.test.ts`.

### 3.2 Asynchronous Job Queues (`src/lib/queue/jobQueue.ts`)
- Long-running operations (video rendering, batch script synthesis) are queued rather than executed in synchronous HTTP requests.
- Worker pools enforce bounded concurrency to prevent CPU/memory exhaustion and OOM kills under traffic surges.
- Persistently failing tasks are routed to a Dead-Letter Queue (DLQ) after exponential backoff retries.

### 3.3 High-Throughput Caching (`src/lib/cache/cacheManager.ts`)
- **Single-Flight Coalescing**: When multiple concurrent requests seek an uncached key, exactly one fetcher runs; all callers share the identical resolved Promise.
- **Tag Invalidation**: Tenant mutations (plan upgrades, credit grants) trigger `cacheManager.invalidateTag(orgId)` for instant cache consistency.

### 3.4 Horizontal Worker Scaling (`src/workers/socialPublisher.ts`)
- To prevent duplicate publishing when running across multiple container instances, workers execute an atomic conditional update:
  ```typescript
  const claim = await prisma.scheduledPost.updateMany({
    where: { id: post.id, publishStatus: "pending" },
    data: { publishStatus: "processing" },
  });
  if (claim.count === 0) continue; // Another horizontal worker claimed it!
  ```

### 3.5 Circuit Breaker Pattern (`src/lib/resilience/circuitBreaker.ts`)
- Downstream dependencies (Gemini AI, social media posting APIs, Stripe) are wrapped in circuit breakers (`geminiBreaker`, `socialDispatcherBreaker`, `stripeBreaker`).
- When downstream failure thresholds are breached, the circuit flips to `OPEN`, immediately fast-failing subsequent calls to protect Node.js event loops.
- Automatically transitions to `HALF_OPEN` and self-heals after successful canary verification.

### 3.6 Cryptographic Security (`src/lib/security/`)
- **At-Rest Encryption**: OAuth access and refresh tokens are encrypted using **AES-256-GCM** with 128-bit authentication tags. Tampered ciphertexts are rejected.
- **Approval Tokens**: 1-hour pre-publish email links use single-use HMAC-SHA256 signatures with replay attack protection.
- **Rate Limiting**: Sliding-window memory log engine enforces per-organization and per-IP throttles with RFC 6585 headers.
- **CSRF Protection**: State-changing requests (`POST`, `PUT`, `DELETE`) require verified `Origin` and `Referer` headers.

---

## 4. UI Design System Tokens (Fluencify Luxury UGC)

AutoUGC uses a calm, luxury-organic design language:
- **Background Linen**: `#F6F7F2` (`bg-[#F6F7F2]`)
- **Deep Forest Green (Brand / Buttons)**: `#1F3824` (`text-[#1F3824]`, `bg-[#1F3824]`)
- **Dark Active Hover**: `#162719` (`hover:bg-[#162719]`)
- **Border / Divider Sage**: `#CBD5C4` (`border-[#CBD5C4]`)
- **Muted Body Sage**: `#5A6E5D` (`text-[#5A6E5D]`)
- **Card Backgrounds**: `#FFFFFF` with subtle border and rounded corners (`rounded-2xl`).

All buttons, cards, and modal components in `src/components/ui/` adhere to these tokens.

---

## 5. Developer Workflows & Quality Gates

Before committing any code or submitting pull requests, future developers must verify that all 3 quality gates pass cleanly:

### 1. TypeScript Strict Typecheck
```bash
npm run typecheck
```
*Ensures zero typing errors or invalid casts.*

### 2. ESLint Code Cleanliness
```bash
npm run lint
```
*Enforces zero lint errors and zero unused variables.*

### 3. Automated Test Suite (21 Test Suites)
```bash
npm test
```
*Executes all 21 unit, security, scalability, and resilience test suites.*

### 4. Health Check Verification
```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/health?probe=liveness
```
*Verifies database connectivity, cache hit ratio, queue depth, and memory telemetry.*

---

## 6. Commercial Pricing Policy

Strict commercial model with zero free tier:
- **Starter**: **$49 / month** (20 video credits, 1 connected account)
- **Growth**: **$89 / month** (60 video credits, 5 connected accounts)
- **Scale**: **$199 / month** (180 video credits, 15 connected accounts)

Zero-credit accounts trigger the `UpgradePaywallModal` to protect margins and cloud rendering resources.

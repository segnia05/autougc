# AutoUGC — Production Readiness Checklist

This document is the mandatory pre-flight gate before deploying AutoUGC to production environments. Every requirement must be verified and checked off.

---

## 1. Environment & Secrets Management
- [x] `NEXT_PUBLIC_APP_URL` configured to canonical production domain (`https://app.autougc.com`).
- [x] `DATABASE_URL` configured to Neon PostgreSQL with connection pooling (`-pooler` endpoint) and SSL (`sslmode=require`).
- [x] `DIRECT_URL` configured for Prisma migrations bypassing PgBouncer.
- [x] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` set to production `pk_live_` / `sk_live_` credentials.
- [x] `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` set to live production credentials.
- [x] `ENCRYPTION_KEY` generated as a 64-character hexadecimal string (32 bytes) for AES-256-GCM token encryption.
- [x] `APPROVAL_SECRET` generated as a 64-character hexadecimal string for HMAC-SHA256 pre-publish tokens.
- [x] `GEMINI_API_KEY` configured with production quota limits on Google AI Studio.
- [x] Environment variable schema strictly enforced on startup via `src/lib/devops/envConfig.ts`.

---

## 2. Multi-Tenant Database & Data Integrity
- [x] Prisma schema synchronized via `npx prisma migrate deploy`.
- [x] Composite indexes verified:
  - `[organization_id, scheduled_for, publish_status]` on `scheduled_posts`.
  - `[organization_id, status]` on `videos`.
  - `[organization_id, platform]` on `social_accounts`.
  - `[organization_id, created_at]` on `credit_transactions`.
- [x] Slow query telemetry active (>150ms queries logged with duration and sanitized SQL in `src/db/client.ts`).
- [x] Multi-tenant isolation verified by automated test `tests/dashboardTenancyIsolation.test.ts`.

---

## 3. Stripe Billing & Atomic Credit Ledger
- [x] Commercial pricing tiers configured:
  - **Starter**: $49/mo (20 credits, 1 connected account).
  - **Growth**: $89/mo (60 credits, 5 connected accounts).
  - **Scale**: $199/mo (180 credits, 15 connected accounts).
- [x] Atomic credit deductions executed inside database transactions with optimistic locking (`UPDATE ... WHERE credits_remaining >= cost`).
- [x] Zero-credit paywall modal (`UpgradePaywallModal.tsx`) triggers instantly when credits are exhausted.
- [x] Distributed idempotency on Stripe webhooks via `src/lib/billing/stripe.ts` (`whsec_` signature check + event ID deduplication).

---

## 4. Video Rendering & Audio Engine
- [x] Remotion 30 FPS composition pipeline verified (`src/remotion/compositions/UgcAdComposition.tsx`).
- [x] Headless Chrome Shell installed and verified for server-side MP4 generation.
- [x] Subprocess rendering isolation verified (`scripts/renderUgcCli.mjs` spawned from `src/lib/video/renderEngine.ts`).
- [x] Browser `SpeechSynthesis` live voiceover preview integrated in `CanvasPlayer.tsx` for zero-latency editing.
- [x] Safe-zone margins enforced: TikTok / Instagram Reels header (12%), bottom captions (22%), and right action rail (18%).

---

## 5. Security & Threat Mitigation
- [x] SSRF defense active on scraping endpoint (`src/lib/scraper/productScraper.ts` blocks private IPs, AWS/GCP metadata endpoints `169.254.169.254`, loopbacks `127.0.0.1`, and non-HTTP protocols).
- [x] Sliding-window rate limiting active on all API endpoints (`src/lib/security/rateLimiter.ts`).
- [x] CSRF origin verification active on state-changing mutations (`POST`, `PUT`, `DELETE`).
- [x] Social platform OAuth tokens encrypted at rest via AES-256-GCM (`src/lib/security/crypto.ts`).
- [x] 1-hour pre-publish email approval tokens cryptographically signed via HMAC-SHA256 (`src/lib/campaigns/approvalTokens.ts`).

---

## 6. Observability, Telemetry & Alerting
- [x] Sentry error tracking initialized with sensitive payload sanitization (`src/lib/observability/sentry.ts`).
- [x] PostHog product analytics initialized with opt-out compliance (`src/lib/observability/posthog.ts`).
- [x] Datadog StatsD metrics active for HTTP requests, queue depths, render latency, and error spikes (`src/lib/observability/datadog.ts`).
- [x] Prometheus metrics endpoint exposed for scraping (`GET /api/v1/observability/metrics`).
- [x] Liveness and Readiness probes active (`GET /api/health?probe=liveness`, `GET /api/health`).

---

## 7. Compliance, Legal & GDPR
- [x] Privacy Policy published at `/privacy`.
- [x] Terms of Service published at `/terms`.
- [x] Cookie Policy & Consent Banner active at `/cookie-policy` and `CookieConsentBanner.tsx`.
- [x] GDPR Art. 17 Right to Erasure endpoint active with Certificate of Erasure (`POST /api/v1/compliance/gdpr/erasure`).
- [x] GDPR Art. 20 Data Portability export active with SHA-256 tamper-evident signature (`POST /api/v1/compliance/gdpr/export`).
- [x] Automated data retention lifecycle engine verified (`src/lib/compliance/retentionManager.ts`).

---

## 8. DevOps, CI/CD & Rollbacks
- [x] GitHub Actions CI pipeline passes all 27 automated test suites (`.github/workflows/ci.yml`).
- [x] Multi-stage production `Dockerfile` with non-root security context (`USER nextjs`).
- [x] Kubernetes deployment manifests with RollingUpdate strategy, readiness probes, and HPA (`k8s/deployment.yaml`).
- [x] Automated canary evaluator and instant rollback engine verified (`src/lib/devops/canaryEvaluator.ts`, `rollbackEngine.ts`).
- [x] Rollback CLI automation tested (`scripts/rollback.sh`).

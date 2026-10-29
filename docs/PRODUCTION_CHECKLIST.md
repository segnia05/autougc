# AutoUGC Production Readiness Sign-Off Checklist

Before promoting any build from Staging to 100% Production Fleet, on-call release engineers and DevOps leads must verify the following criteria.

---

## Pillar 1: Security & Compliance Sign-Off

- [x] **Clerk Multi-Tenant Authentication**: Production publishable and secret keys configured (`pk_live_...`, `sk_live_...`).
- [x] **At-Rest AES-256-GCM Encryption**: OAuth tokens encrypted with unique IVs and verified auth tags.
- [x] **SSRF Protection**: Private CIDR and cloud metadata IP filters active and verified.
- [x] **CSRF Origin Protection**: Mutations protected against cross-origin attacks.
- [x] **HSTS & Security Headers**: Strict Transport Security (HSTS 2-year preload), `X-Content-Type-Options: nosniff`, and `X-Frame-Options: SAMEORIGIN` active.
- [x] **GDPR Compliance**:
  - `/privacy` published with DPO contact (`dpo@autougc.ai`) and sub-processor directory (Clerk, Stripe, Neon, Google).
  - `/terms` published with Commercial Usage Rights, 14-day refund guarantee, and 99.9% SLA commitments.
  - `/cookies` and interactive `<CookieConsentBanner />` active and storing user consent.
  - GDPR Data Portability (`/api/v1/compliance/export`) and Erasure (`/api/v1/compliance/erasure`) tested.

---

## Pillar 2: Scalability & High-Throughput Sign-Off

- [x] **Bounded Background Queues**: Concurrency bounded to prevent OOM kills under load surges.
- [x] **Distributed SWR Caching**: Thundering herd single-flight coalescing active and verified.
- [x] **Database Optimization**: Neon PgBouncer transaction pooling configured with composite indexing on hot query paths.
- [x] **Horizontal Pod Autoscaling**: Kubernetes HPA configured (`minReplicas: 3`, `maxReplicas: 30`, CPU 70%, Memory 80%).
- [x] **Zero-Downtime Rolling Updates**: Kubernetes Deployment configured with `maxSurge: 25%` and `maxUnavailable: 0`.

---

## Pillar 3: System Reliability & 99.9% Uptime Sign-Off

- [x] **Circuit Breakers Active**: Downstream breakers configured for Gemini AI, Stripe, and Social Dispatchers.
- [x] **Exponential Jitter Retries**: Full decorrelated jitter retries active for transient network errors.
- [x] **Probes Active**:
  - Liveness probe: `/api/health?probe=liveness` returning 200 OK.
  - Readiness probe: `/api/health` returning 200 OK with healthy DB, Cache, and Queue status.
- [x] **UI Error Boundaries**: Client and server root error boundaries active and displaying self-healing controls.
- [x] **Nightly Backup Manifests**: SHA-256 verified backup manifests enabled.

---

## Pillar 4: Enterprise Observability Sign-Off

- [x] **Structured Logging**: JSON logging active with ISO timestamps, correlation IDs, and W3C `traceparent` propagation.
- [x] **Datadog APM & DogStatsD**: Live telemetry emitting HTTP latency histograms, error counts, and queue depth.
- [x] **Prometheus OpenMetrics**: Real-time metrics scraping active at `/api/metrics`.
- [x] **Grafana Dashboards**: Dashboard manifest configured in `dashboards/autougc-grafana-dashboard.json`.
- [x] **Alertmanager Rules**: Prometheus alerting rules configured in `k8s/prometheus-alerts.yaml` for 5xx errors $> 1.0\%$ and P99 latency $> 1.5\text{s}$.

---

## Pillar 5: Commercial Billing Sign-Off

- [x] **Stripe Production Keys**: Webhook secrets (`whsec_...`) and live keys configured.
- [x] **Commercial Tier Gating**:
  - Starter: $49/mo (24 credits, 1 account)
  - Growth: $89/mo (60 credits, 5 accounts)
  - Scale: $199/mo (180 credits, 15 accounts)
- [x] **Atomic Credit Ledger**: Interactive PostgreSQL transactions with optimistic concurrency and overdraft protection.
- [x] **Zero-Credit Paywall**: `UpgradePaywallModal` blocks generation when credits reach zero.

---

## Pillar 6: DevOps & Deployment Sign-Off

- [x] **Production Multi-Stage Dockerfile**: Non-root user `nextjs` (UID 1001), standalone Next.js bundle, native healthcheck.
- [x] **Automated CI/CD Matrix**: `.github/workflows/ci.yml` and `deploy.yml` passing on GitHub Actions.
- [x] **Zero-Downtime Rollback Engine**: `rollbackManager.ts` and `scripts/rollback.sh` tested with cryptographic SHA-256 audit signatures.
- [x] **TypeScript & Lint Quality**:
  - `npm run typecheck` $\to$ **0 errors**.
  - `npm run lint` $\to$ **0 errors & 0 warnings**.
- [x] **Full Test Matrix**: **All 26 test suites passing cleanly**.

# AutoUGC — Production Operations Runbook

This runbook defines standard operating procedures (SOPs) for the engineering team, on-call responders, and DevOps engineers managing AutoUGC in staging and production.

---

## 1. System Topology & Health Endpoints

| Component | Provider / Path | Port / URL | Health Check / Metric |
| :--- | :--- | :--- | :--- |
| **Next.js App Server** | Node.js / Docker | `:3000` | `GET /api/health?probe=liveness` |
| **Readiness Probe** | Multi-subsystem probe | `:3000` | `GET /api/health` |
| **Prometheus Metrics** | Metrics exporter | `:3000` | `GET /api/v1/observability/metrics` |
| **Database** | Neon Serverless PostgreSQL | `:5432` (PgBouncer) | `SELECT 1` (< 150ms) |
| **Headless Video Renderer**| Remotion / Chrome Shell | Subprocess | `scripts/renderUgcCli.mjs` |
| **Social Media Worker** | Node.js batch process | Subprocess / Cron | `src/workers/socialPublisher.ts` |

---

## 2. Severity Levels & Incident Response SLA

| Severity | Definition | Response SLA | Target Resolution |
| :--- | :--- | :--- | :--- |
| **P1 — Critical** | Complete service outage, video rendering offline, credit loss, data exposure. | **< 15 minutes** | < 2 hours |
| **P2 — Major** | Degraded performance, queue latency > 5 min, circuit breaker tripped, elevated 5xx > 1%. | **< 30 minutes** | < 4 hours |
| **P3 — Minor** | Non-critical UI anomaly, individual webhook retry, background retention job warning. | **< 4 hours** | < 24 hours |

---

## 3. Standard Triage Procedures

### 3.1 Database Connection Pool Exhaustion & Slow Queries
**Symptoms:** `prisma:error Error in PostgreSQL connection: Closed` or latency alerts > 500ms.
1. Check active database connections in Neon console.
2. Ensure queries use the connection-pooled endpoint (`-pooler.eastus2.azure.neon.tech`).
3. Check application logs for `[SLOW QUERY DETECTED] Duration: >150ms`.
4. If a specific query is unindexed, inspect `prisma/schema.prisma` composite indexes:
   ```bash
   npx prisma db execute --stdin <<SQL
   EXPLAIN ANALYZE SELECT * FROM scheduled_posts WHERE organization_id = 'org_...' AND scheduled_for <= NOW();
   SQL
   ```

### 3.2 Circuit Breaker Tripping (`geminiBreaker`, `socialDispatcherBreaker`)
**Symptoms:** Requests fail immediately with `Circuit breaker 'geminiBreaker' is OPEN`.
1. Inspect circuit breaker status:
   - Trip threshold: 5 consecutive failures within 30 seconds.
   - Reset timeout: 15 seconds before automatic transition to `HALF_OPEN`.
2. Check upstream provider status:
   - Google AI Studio (Gemini 2.5 Flash API quotas).
   - TikTok / Instagram / YouTube API status dashboards.
3. If upstream is verified operational, trigger canary probe:
   ```bash
   curl -X POST http://localhost:3000/api/v1/scripts/generate \
     -H "Content-Type: application/json" \
     -d '{"brandName":"Test","summary":"Health probe"}'
   ```

### 3.3 Background Job Queue Backpressure & DLQ Processing
**Symptoms:** Queue depth metric `autougc.queue.depth` exceeds 500 items; rendering delayed.
1. Inspect current queue stats via health endpoint:
   ```bash
   curl http://localhost:3000/api/health | jq .subsystems.queue
   ```
2. Inspect Dead-Letter Queue (DLQ) in `src/lib/queue/jobQueue.ts`.
3. To replay failed DLQ jobs after fixing downstream issue:
   ```bash
   curl -X POST http://localhost:3000/api/v1/devops/queue/replay-dlq \
     -H "Authorization: Bearer $DEVOPS_API_TOKEN"
   ```

### 3.4 Headless Chrome Video Rendering Failures
**Symptoms:** Video render returns 500 or timeout error `Render process exited with code 1`.
1. Verify Chrome Headless Shell binary is available:
   ```bash
   npx @remotion/renderer install-headless-shell
   ```
2. Verify disk space in `public/renders/`:
   ```bash
   df -h public/renders
   ```
3. Test isolated rendering worker manually:
   ```bash
   node scripts/renderUgcCli.mjs '{"videoId":"manual_test","inputProps":{"brandName":"Test","hookText":"Hook","bodyText":"Body","ctaText":"CTA"},"framesToRender":30}'
   ```

---

## 4. Canary Deployments & Instant Rollbacks

### 4.1 Running a Production Canary Deployment
Deployments follow a 10% canary traffic progression with automated health evaluation:
```bash
./scripts/deploy.sh v0.2.0
```
The script evaluates:
- 5xx HTTP error rate (< 1%).
- p95 latency (< 350ms).
- Database query latency (< 150ms).

### 4.2 Executing an Emergency Zero-Downtime Rollback
If an unhealthy deployment is detected, trigger an instant rollback:
```bash
# Via CLI Script
./scripts/rollback.sh

# Or via REST API
curl -X POST http://localhost:3000/api/v1/devops/rollback \
  -H "Authorization: Bearer $DEVOPS_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"targetVersion":"v0.1.0","reason":"Elevated 5xx error rate on studio render"}'
```

---

## 5. Backup Recovery & Point-In-Time Restore (PITR)

AutoUGC enforces continuous WAL archiving and daily automated database backups:
1. **Backup Verification:**
   ```bash
   # Inspect cryptographic SHA-256 backup manifest
   cat backups/latest-manifest.json
   ```
2. **Point-In-Time Recovery (PITR) via Neon Console:**
   - Navigate to Neon Project Dashboard $\to$ **Branches**.
   - Create a branch from a specific timestamp (e.g. 5 minutes before incident).
   - Update `DATABASE_URL` in production secret manager to point to restored branch.
   - Restart deployment pods: `kubectl rollout restart deployment/autougc`.

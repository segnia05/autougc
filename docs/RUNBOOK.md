# AutoUGC Production Incident Response & Operational Runbook

This operational runbook defines standard operating procedures (SOPs) for site reliability engineers (SREs), devops operators, and on-call engineers responsible for AutoUGC 24/7 production availability.

---

## 1. Incident Severity Classification Matrix

| Severity | Definition | Impact | MTTR Target | Escalation |
| :--- | :--- | :--- | :--- | :--- |
| **SEV-1 (Critical)** | Core outage, video rendering total halt, data breach, or 5xx error rate $> 5\%$ | All users blocked | $< 15\text{ mins}$ | On-call Lead, VP Eng, DevOps |
| **SEV-2 (Major)** | Circuit breaker tripped, social publisher degradation, queue backlog $> 100$ | Partial feature disruption | $< 30\text{ mins}$ | Primary SRE, Domain Tech Lead |
| **SEV-3 (Moderate)** | Non-blocking UI glitch, single-user quota anomaly, single social account disconnect | Edge-case users | $< 4\text{ hours}$ | Normal sprint triage |

---

## 2. Standard Operating Procedures (SOPs)

### SOP-01: Emergency Zero-Downtime Rollback Execution

**When to use:** Following a bad deployment where synthetic probes fail or 5xx error rates spike.

#### Method A: CLI Instant Rollback
```bash
# In production bastion or CI/CD terminal
bash scripts/rollback.sh production "Deployment canary healthcheck failure"
```

#### Method B: Direct Kubernetes Rollback
```bash
kubectl rollout undo deployment/autougc-deployment -n autougc-production
kubectl rollout status deployment/autougc-deployment -n autougc-production --timeout=120s
```

#### Method C: DevOps Authenticated API Trigger
```bash
curl -X POST https://autougc.com/api/v1/devops/rollback \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEVOPS_ROLLBACK_API_KEY" \
  -d '{
    "action": "rollback",
    "environment": "production",
    "reason": "Elevated P99 latency post-release",
    "triggeredBy": "on-call-sre"
  }'
```

---

### SOP-02: Circuit Breaker Tripped Incident Triage

**When to use:** Datadog alerts indicate `geminiBreaker`, `stripeBreaker`, or `socialDispatcherBreaker` has transitioned to `OPEN`.

1. **Check Status**:
   Inspect real-time circuit state via Datadog or logs:
   ```bash
   grep -i "Circuit breaker" /var/log/autougc/*.log
   ```
2. **Diagnose Downstream API**:
   - For Gemini AI: Verify [Google Cloud Status Dashboard](https://status.cloud.google.com/) and quota limits in Google Cloud Console.
   - For Stripe: Check [Stripe Status](https://status.stripe.com/).
   - For Social APIs: Verify TikTok / Meta Developer Portal token expiration.
3. **Recovery**:
   - The circuit breaker will automatically transition to `HALF_OPEN` after 30 seconds of cooldown and execute a probe canary.
   - If downstream service has restored, normal traffic resumes automatically with 0 manual intervention required.

---

### SOP-03: Dead-Letter Queue (DLQ) Drain & Video Render Retry

**When to use:** Queue backlog exceeds 50 jobs or alerts flag dead-lettered render jobs.

1. **Inspect Dead-Lettered Tasks**:
   ```sql
   SELECT id, "organizationId", "scriptAngle", "createdAt", "retryCount"
   FROM "video_render_jobs"
   WHERE status = 'failed'
   ORDER BY "createdAt" DESC LIMIT 20;
   ```
2. **Identify Root Cause**:
   - Transient audio synthesis timeout?
   - Expired video asset URL?
3. **Re-queue Dead Tasks**:
   Execute the background queue drainage routine:
   ```bash
   npx tsx scripts/drainQueue.ts --status=failed --requeue=true
   ```

---

### SOP-04: Database Connection Pool Exhaustion (Neon PgBouncer)

**When to use:** Error logs report `PrismaClientKnownRequestError` with pool timeout or closed connections.

1. **Verify PgBouncer Metrics**:
   Query active clients and pool queue depth:
   ```sql
   SHOW POOLS;
   SHOW CLIENTS;
   ```
2. **Mitigate Immediate Load**:
   - If traffic surge, HPA will scale pods. Ensure Neon compute autoscaling is enabled (0.25 to 4 CU).
   - In Next.js server configuration, ensure Prisma instances are singletons (`src/db/client.ts`).
3. **Restart Pool Connection**:
   If PgBouncer enters a hung state:
   ```bash
   kubectl rollout restart deployment/autougc-deployment -n autougc-production
   ```

---

### SOP-05: Stripe Webhook Replay & Ledger Reconciliation

**When to use:** Customer reports payment completed but video credits were not granted.

1. **Locate Webhook Event in Stripe Dashboard**:
   - Go to Developers $\to$ Webhooks $\to$ Select endpoint (`https://autougc.com/api/v1/billing/webhook`).
   - Find failing event ID (`evt_...`).
2. **Inspect Error Response**:
   - If HTTP 400: Signature secret mismatch (`STRIPE_WEBHOOK_SECRET`).
   - If HTTP 500: Neon database transaction timeout.
3. **Replay Event**:
   - Click "Resend Event" in Stripe Dashboard.
   - The AutoUGC webhook handler is 100% idempotent; replaying safe events will not duplicate credit grants.
4. **Manual Ledger Correction (If Necessary)**:
   ```typescript
   import { grantCredits } from "@/lib/billing/credits";
   await grantCredits("org_customer_id", 60, "manual_support_reconciliation", "ch_stripe_charge_id");
   ```

---

### SOP-06: GDPR Subject Access Request (DSAR) & Erasure Execution

**When to use:** Customer submits a statutory GDPR/CCPA request to export or delete their data.

1. **Data Portability Export (Art. 20)**:
   - Request endpoint: `POST /api/v1/compliance/export`
   - Yields complete encrypted JSON dossier of user records, projects, video renders, and audit trails.
2. **Right to Erasure (Art. 17)**:
   - Request endpoint: `POST /api/v1/compliance/erasure`
   - Sanitizes PII, redacts email (`anonymized_user_...@deleted.autougc.ai`), clears social tokens, and cancels active subscriptions.
   - Emits a legally binding Certificate of Erasure with cryptographic SHA-256 signature.
3. **SLA**:
   - Both requests must be processed and verified within 30 calendar days under EU GDPR Article 12(3). AutoUGC processes them in $< 5\text{ seconds}$ programmatically.

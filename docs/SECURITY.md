# AutoUGC Enterprise Security & Vulnerability Policy

AutoUGC adheres to strict Defense-in-Depth and Zero-Trust architectural principles across all layers of the application, database, and container infrastructure.

---

## 1. Cryptographic Standards & Data Protection

| Domain | Standard | Implementation | Verification |
| :--- | :--- | :--- | :--- |
| **Data in Transit** | TLS 1.3 / Strict HTTPS | Strict-Transport-Security (HSTS), 2-year preload | Verified in `next.config.ts` |
| **Tokens at Rest** | AES-256-GCM | 256-bit PBKDF2/Argon2 derived key, unique 12-byte IV, 16-byte auth tag | Verified in `tests/securityAudit.test.ts` |
| **State Signatures** | HMAC-SHA256 | Timing-safe cryptographic equality comparisons | Verified in `tests/socialOAuth.test.ts` |
| **Audit Trails** | SHA-256 | Immutable hash chaining for GDPR and Rollbacks | Verified in `tests/complianceAudit.test.ts` |

---

## 2. Multi-Tenant Isolation Guarantee

- **Database-Level Boundaries**: Every table containing customer or operational data enforces an indexed `organizationId` foreign key.
- **Context Synchronization**: Clerk session JWT claims are validated server-side. Requests without a valid organization session cannot access or query data.
- **Verification**: Verified under adversarial test conditions in `tests/dashboardTenancyIsolation.test.ts`.

---

## 3. Attack Vector Mitigations

### 3.1 Server-Side Request Forgery (SSRF)
All user-submitted URLs pass through strict DNS resolution and CIDR filtering before HTTP clients are initialized:
- Rejects loopback (`127.0.0.0/8`, `::1`).
- Rejects RFC 1918 private subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`).
- Rejects cloud provider link-local metadata endpoints (`169.254.169.254`).
- Rejects local development domains (`*.local`, `*.internal`, `localhost`).

### 3.2 Cross-Site Request Forgery (CSRF)
All state-modifying HTTP methods (`POST`, `PUT`, `PATCH`, `DELETE`) are gated by CSRF middleware:
- Verifies that `Origin` or `Referer` headers match the legitimate application host.
- Requests originating from foreign web origins are aborted with `403 Forbidden`.

### 3.3 SQL Injection
AutoUGC utilizes Prisma ORM with parameterized query construction exclusively. User input is never concatenated into raw SQL strings.

### 3.4 Rate Limiting & Denial-of-Service (DoS)
- Sliding-window rate limiters throttle abuse attempts across IP addresses and authenticated tenants.
- Rate limits comply with RFC 6585 and emit standard headers.

---

## 4. Container & Infrastructure Hardening

- **Non-Root Execution**: Container processes run under unprivileged user `nextjs` (`UID 1001`).
- **Read-Only Root Filesystem**: Write operations are restricted strictly to mounted `/tmp` emptyDir scratch volumes.
- **Capability Dropping**: Kubernetes pods drop all Linux kernel capabilities (`capabilities: drop: [ALL]`).
- **Privilege Escalation Prevention**: `allowPrivilegeEscalation: false` enforced.

---

## 5. Vulnerability Disclosure & Reporting

If you believe you have identified a security vulnerability in AutoUGC:
1. Do not open public issues on GitHub.
2. Email full technical details and reproduction steps to **`security@autougc.ai`**.
3. We acknowledge reports within 24 hours and commit to triage within 72 hours.

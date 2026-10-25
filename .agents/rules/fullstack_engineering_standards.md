# Fullstack SaaS Engineering Standards & Architectural Commandments

## 1. Type Safety & API Design
- **End-to-End Type Safety**: Shared TypeScript types or Zod schemas between client and server. Never accept unvalidated payload data (`req.body` must be parsed through Zod or similar validator).
- **Strict API Response Envelope**:
  - Success responses return `{ success: true, data: T, meta?: Record<string, unknown> }`.
  - Error responses return `{ success: false, error: { code: string, message: string, details?: unknown } }` with appropriate HTTP status codes (400, 401, 403, 404, 409, 422, 429, 500).
- **Idempotency**: All payment, billing mutation, and media processing triggers MUST accept an `Idempotency-Key` header stored in Redis/DB with a 24-hour TTL to prevent double-charging or duplicate generation jobs.

---

## 2. Database Standards (PostgreSQL / Relational)
- **Primary Keys**: Use UUIDv7 or `gen_random_uuid()` for distributed scale and leak-proof IDs (never expose sequential auto-incrementing integer IDs in URLs).
- **Indexing Rules**:
  - Add indexes on all foreign keys (`user_id`, `organization_id`, `project_id`).
  - Index columns frequently filtered or sorted (`created_at`, `status`, `slug`).
  - Create composite indexes for high-frequency multi-column queries (e.g., `(user_id, status)`).
- **Connection Management**:
  - Always use a connection pooler (e.g., PgBouncer or Supabase transaction pooler) to avoid exhausting PostgreSQL max connections during traffic spikes or serverless cold starts.
  - Keep transactions brief. Never await external HTTP requests (e.g., AI inference, Stripe call) inside an open database transaction lock.

---

## 3. Asynchronous Workloads & Media Processing (UGC Core)
- **Direct-to-Storage Uploads**:
  - Web servers must NEVER buffer large video or image files in memory.
  - Generate pre-signed PUT URLs (AWS S3 or Cloudflare R2) on the server; the client uploads directly to object storage with client-side chunking/progress tracking.
- **Background Queue Decoupling**:
  - Any task exceeding 500ms (video transcoding, AI generation, watermark application, email dispatch) belongs in a persistent queue (BullMQ + Redis, Inngest, or SQS).
  - Webhooks notify the client via WebSockets or Server-Sent Events (SSE) upon completion.
- **Dead Letter Queues (DLQ) & Circuit Breakers**:
  - Limit job retries to 3 attempts with exponential backoff. Failed jobs route to DLQ with detailed error logs and user-facing notifications.

---

## 4. Frontend Performance & UX Guidelines
- **Core Web Vitals Thresholds**:
  - **LCP (Largest Contentful Paint)**: < 1.5 seconds.
  - **INP (Interaction to Next Paint)**: < 100 milliseconds.
  - **CLS (Cumulative Layout Shift)**: < 0.05.
- **State Management & Data Fetching**:
  - Server-render public/marketing and landing pages for instant indexing and paint.
  - Use SWR or TanStack React Query for client-side data fetching with aggressive caching and optimistic UI updates for instantaneous user interactions.
  - Never allow an unhandled loading or error state. Every async component must render skeleton states, clear error fallbacks, and retry buttons.

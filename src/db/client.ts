import { PrismaClient } from "@prisma/client";

declare global {
  // Prevent multiple PrismaClient instances during Next.js hot-reloads in development
  var prisma: PrismaClient | undefined;
}

/**
 * Enterprise Database Client with Connection Pooling & Query Performance Telemetry.
 *
 * Configured for Neon PostgreSQL with PgBouncer transaction-mode pooling.
 * Protects connection capacity when scaling across hundreds of concurrent serverless
 * or containerized worker instances.
 */
function createPrismaClient(): PrismaClient {
  const isDev = process.env.NODE_ENV === "development";

  const client = new PrismaClient({
    log: isDev
      ? [
          { emit: "event", level: "query" },
          { emit: "stdout", level: "error" },
          { emit: "stdout", level: "warn" },
        ]
      : [{ emit: "stdout", level: "error" }],
  });

  // Slow query telemetry (>150ms) to ensure sub-second response times under 100k scale
  if (isDev) {
    (client as any).$on("query", (e: { query: string; duration: number }) => {
      if (e.duration > 150) {
        console.warn(`[SLOW QUERY DETECTED] Duration: ${e.duration}ms | Query: ${e.query.substring(0, 100)}...`);
      }
    });
  }

  return client;
}

export const db = global.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = db;
}

// Graceful container shutdown handling
if (typeof process !== "undefined" && typeof process.once === "function") {
  const cleanup = async () => {
    try {
      await db.$disconnect();
    } catch {
      // Ignore disconnect errors during shutdown
    }
  };

  process.once("beforeExit", cleanup);
}

export const prisma = db;
export default db;

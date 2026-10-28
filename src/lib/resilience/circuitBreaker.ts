/**
 * Enterprise Circuit Breaker Pattern.
 *
 * Prevents cascading service degradation by isolating failing downstream dependencies
 * (e.g., TikTok/Instagram OAuth APIs, Gemini AI, Stripe).
 *
 * Lifecycle States:
 * - CLOSED: Normal healthy traffic.
 * - OPEN: Downstream outage detected. Calls fail fast immediately without waiting.
 * - HALF_OPEN: Trial canary request sent to verify downstream recovery before full resumption.
 */

export type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";

export interface CircuitBreakerOptions {
  failureThreshold?: number; // Failures before tripping (default 5)
  recoveryTimeoutMs?: number; // Time in OPEN state before trying HALF_OPEN (default 10,000ms)
  successThreshold?: number; // Successes in HALF_OPEN before returning to CLOSED (default 2)
}

export class CircuitBreakerOpenError extends Error {
  constructor(public serviceName: string) {
    super(`Circuit breaker for '${serviceName}' is OPEN. Fast-failing downstream request to protect system stability.`);
    this.name = "CircuitBreakerOpenError";
  }
}

export class CircuitBreaker {
  private state: CircuitState = "CLOSED";
  private failureCount = 0;
  private successCount = 0;
  private lastFailureTime = 0;

  private failureThreshold: number;
  private recoveryTimeoutMs: number;
  private successThreshold: number;

  constructor(public name: string, options: CircuitBreakerOptions = {}) {
    this.failureThreshold = options.failureThreshold ?? 5;
    this.recoveryTimeoutMs = options.recoveryTimeoutMs ?? 10_000;
    this.successThreshold = options.successThreshold ?? 2;
  }

  getState(): CircuitState {
    if (this.state === "OPEN") {
      // Check if recovery timeout has elapsed
      if (Date.now() - this.lastFailureTime > this.recoveryTimeoutMs) {
        this.state = "HALF_OPEN";
        this.successCount = 0;
      }
    }
    return this.state;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    const currentState = this.getState();

    if (currentState === "OPEN") {
      throw new CircuitBreakerOpenError(this.name);
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      throw err;
    }
  }

  private onSuccess(): void {
    if (this.state === "HALF_OPEN") {
      this.successCount++;
      if (this.successCount >= this.successThreshold) {
        this.state = "CLOSED";
        this.failureCount = 0;
        this.successCount = 0;
      }
    } else {
      this.failureCount = 0;
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.state === "HALF_OPEN" || this.failureCount >= this.failureThreshold) {
      this.state = "OPEN";
    }
  }

  reset(): void {
    this.state = "CLOSED";
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = 0;
  }

  getMetrics() {
    return {
      service: this.name,
      state: this.getState(),
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
    };
  }
}

// Pre-configured global circuit breakers
export const geminiBreaker = new CircuitBreaker("gemini_ai", { failureThreshold: 5, recoveryTimeoutMs: 15_000 });
export const socialDispatcherBreaker = new CircuitBreaker("social_publisher", { failureThreshold: 4, recoveryTimeoutMs: 10_000 });
export const stripeBreaker = new CircuitBreaker("stripe_billing", { failureThreshold: 3, recoveryTimeoutMs: 10_000 });

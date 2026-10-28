/**
 * Enterprise Exponential Backoff Retry Utility with Jitter.
 *
 * Automatically recovers from transient network glitches, 502/503/504 gateway blips,
 * and external rate limits (429) without crashing worker processes or request threads.
 */

export interface RetryOptions {
  maxRetries?: number; // Default 3
  baseDelayMs?: number; // Default 200ms
  maxDelayMs?: number; // Default 3000ms
  jitterMs?: number; // Default 100ms
  retryIf?: (error: unknown) => boolean;
  onRetry?: (error: unknown, attempt: number, delayMs: number) => void;
}

/**
 * Executes an asynchronous function with full jitter exponential backoff.
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxRetries = options.maxRetries ?? 3;
  const baseDelay = options.baseDelayMs ?? 200;
  const maxDelay = options.maxDelayMs ?? 3000;
  const jitter = options.jitterMs ?? 100;

  let attempt = 0;

  while (true) {
    try {
      return await fn();
    } catch (err: unknown) {
      attempt++;

      // Check if maximum retries reached
      if (attempt > maxRetries) {
        throw err;
      }

      // Check if error is retryable
      if (options.retryIf && !options.retryIf(err)) {
        throw err;
      }

      // Calculate exponential backoff with full randomized jitter to prevent herd collisions
      const rawDelay = baseDelay * Math.pow(2, attempt - 1);
      const cappedDelay = Math.min(maxDelay, rawDelay);
      const delayMs = Math.round(cappedDelay + Math.random() * jitter);

      if (options.onRetry) {
        options.onRetry(err, attempt, delayMs);
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

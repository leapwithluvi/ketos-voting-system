import { RateLimiterMemory } from 'rate-limiter-flexible'

// Login: 5 attempts per 15 minutes per IP
export const loginRateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 15 * 60,
  blockDuration: 15 * 60,
})

// API general: 100 req per minute
export const apiRateLimiter = new RateLimiterMemory({
  points: 100,
  duration: 60,
})

// Vote: 1 per user ever (enforced by DB), but rate limit by IP: 3 per hour
export const voteRateLimiter = new RateLimiterMemory({
  points: 3,
  duration: 60 * 60,
})

// Upload: 10 per hour per IP
export const uploadRateLimiter = new RateLimiterMemory({
  points: 10,
  duration: 60 * 60,
})

export async function checkRateLimit(
  limiter: RateLimiterMemory,
  key: string
): Promise<{ allowed: boolean; remainingPoints?: number; msBeforeNext?: number }> {
  try {
    const result = await limiter.consume(key)
    return { allowed: true, remainingPoints: result.remainingPoints }
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'msBeforeNext' in err) {
      const rateLimitErr = err as { msBeforeNext: number }
      return {
        allowed: false,
        msBeforeNext: rateLimitErr.msBeforeNext,
      }
    }
    throw err
  }
}

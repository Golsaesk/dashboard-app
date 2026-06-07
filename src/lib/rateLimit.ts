let Ratelimit: any
let Redis: any

async function getClients() {
  if (!Ratelimit || !Redis) {
    ;({ Ratelimit } = await import('@upstash/ratelimit'))
    ;({ Redis } = await import('@upstash/redis'))
  }
  return { Ratelimit, Redis }
}

const limiters: Record<string, any> = {}

export interface RateLimitConfig {
  endpoint: string
  limit?: number
  windowSeconds?: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  reset: number
}

export async function checkRateLimit(
  userId: string,
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  const { limit = 10, windowSeconds = 60, endpoint } = config

  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    console.warn('[rateLimit] Upstash env vars not set — skipped')
    return {
      allowed: true,
      remaining: limit,
      reset: Date.now() + windowSeconds * 1000,
    }
  }

  try {
    const { Ratelimit: RL, Redis: R } = await getClients()

    if (!limiters[endpoint]) {
      const redis = new R({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
      limiters[endpoint] = new RL({
        redis,
        limiter: RL.slidingWindow(limit, `${windowSeconds} s`),
        prefix: `rl:${endpoint}`,
      })
    }

    const result = await limiters[endpoint].limit(`user:${userId}`)
    return {
      allowed: result.success,
      remaining: result.remaining,
      reset: result.reset,
    }
  } catch (err) {
    console.error('[rateLimit] Redis error, failing open:', err)
    return {
      allowed: true,
      remaining: 0,
      reset: Date.now() + windowSeconds * 1000,
    }
  }
}

export function rateLimitHeaders(
  result: RateLimitResult,
): Record<string, string> {
  return {
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(result.reset),
  }
}

import type { Redis as RedisType } from '@upstash/redis'
import type { Ratelimit as RatelimitType } from '@upstash/ratelimit'

let RatelimitClass: typeof RatelimitType | null = null
let RedisClass: typeof RedisType | null = null

async function getClients(): Promise<{
  Ratelimit: typeof RatelimitType
  Redis: typeof RedisType
}> {
  if (!RatelimitClass || !RedisClass) {
    const [rlMod, redisMod] = await Promise.all([
      import('@upstash/ratelimit'),
      import('@upstash/redis'),
    ])
    RatelimitClass = rlMod.Ratelimit
    RedisClass = redisMod.Redis
  }
  return { Ratelimit: RatelimitClass, Redis: RedisClass }
}

const limiters: Map<string, RatelimitType> = new Map()

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
    console.warn('[rateLimit] Upstash env vars not set — skipping rate limit')
    return {
      allowed: true,
      remaining: limit,
      reset: Date.now() + windowSeconds * 1000,
    }
  }

  try {
    const { Ratelimit, Redis } = await getClients()

    if (!limiters.has(endpoint)) {
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
      limiters.set(
        endpoint,
        new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
          prefix: `rl:${endpoint}`,
        }),
      )
    }

    const limiter = limiters.get(endpoint)!
    const result = await limiter.limit(`user:${userId}`)

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

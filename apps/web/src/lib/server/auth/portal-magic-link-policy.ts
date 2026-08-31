import {
  bucketRetryAfter,
  incrementBuckets,
  type RateBucketSpec,
} from '@/lib/server/utils/redis-rate-bucket'

export interface PortalMagicLinkRateLimitResult {
  allowed: boolean
  retryAfter?: number
}

const LIMITS = [1, 5, 10] as const

/**
 * Protect the public portal email flow independently of Better Auth's
 * lower-level endpoint limiter. The email buckets intentionally do not
 * include the IP so rotating source addresses cannot spam one inbox.
 */
export async function checkPortalMagicLinkRateLimit(
  ip: string,
  rawEmail: string
): Promise<PortalMagicLinkRateLimitResult> {
  const email = rawEmail.trim().toLowerCase()
  const specs: RateBucketSpec[] = [
    { key: `portal-signin:email-cooldown:${email}`, windowSeconds: 60 },
    { key: `portal-signin:email-hour:${email}`, windowSeconds: 60 * 60 },
    { key: `portal-signin:ip-hour:${ip}`, windowSeconds: 60 * 60 },
  ]
  const counts = await incrementBuckets(specs)

  // Match the shared limiter's availability posture: Redis outages must not
  // lock every runner out of passwordless authentication.
  if (counts.some((count) => count === null)) return { allowed: true }

  const blockedIndex = counts.findIndex(
    (count, index) => typeof count === 'number' && count > LIMITS[index]
  )
  if (blockedIndex === -1) return { allowed: true }

  return {
    allowed: false,
    retryAfter: await bucketRetryAfter(specs[blockedIndex]),
  }
}

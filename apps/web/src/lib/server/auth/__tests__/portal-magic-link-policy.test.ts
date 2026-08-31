import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockIncrementBuckets = vi.fn()
const mockBucketRetryAfter = vi.fn()

vi.mock('@/lib/server/utils/redis-rate-bucket', () => ({
  incrementBuckets: (...args: unknown[]) => mockIncrementBuckets(...args),
  bucketRetryAfter: (...args: unknown[]) => mockBucketRetryAfter(...args),
}))

const { checkPortalMagicLinkRateLimit } = await import('../portal-magic-link-policy')

beforeEach(() => {
  vi.clearAllMocks()
  mockIncrementBuckets.mockResolvedValue([1, 1, 1])
  mockBucketRetryAfter.mockResolvedValue(60)
})

describe('checkPortalMagicLinkRateLimit', () => {
  it('uses independent cooldown, per-email, and per-IP buckets', async () => {
    await expect(
      checkPortalMagicLinkRateLimit('203.0.113.8', ' Runner@Example.com ')
    ).resolves.toEqual({ allowed: true })

    expect(mockIncrementBuckets).toHaveBeenCalledWith([
      { key: 'portal-signin:email-cooldown:runner@example.com', windowSeconds: 60 },
      { key: 'portal-signin:email-hour:runner@example.com', windowSeconds: 3600 },
      { key: 'portal-signin:ip-hour:203.0.113.8', windowSeconds: 3600 },
    ])
  })

  it.each([
    [[2, 1, 1], 0],
    [[1, 6, 1], 1],
    [[1, 1, 11], 2],
  ])('blocks when a policy bucket is exceeded', async (counts, blockedIndex) => {
    mockIncrementBuckets.mockResolvedValueOnce(counts)
    mockBucketRetryAfter.mockResolvedValueOnce(321)

    await expect(
      checkPortalMagicLinkRateLimit('203.0.113.8', 'runner@example.com')
    ).resolves.toEqual({ allowed: false, retryAfter: 321 })
    expect(mockBucketRetryAfter).toHaveBeenCalledWith(
      mockIncrementBuckets.mock.calls[0][0][blockedIndex]
    )
  })

  it('fails open when Redis is unavailable', async () => {
    mockIncrementBuckets.mockResolvedValueOnce([null, null, null])
    await expect(
      checkPortalMagicLinkRateLimit('203.0.113.8', 'runner@example.com')
    ).resolves.toEqual({ allowed: true })
  })
})

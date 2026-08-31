import { describe, expect, it, vi } from 'vitest'
import { verifyTurnstileToken } from '../turnstile'

describe('verifyTurnstileToken', () => {
  it('skips validation when Turnstile is not configured', async () => {
    const fetcher = vi.fn()
    await expect(
      verifyTurnstileToken({ token: null, ip: '203.0.113.8', secretKey: undefined }, fetcher)
    ).resolves.toEqual({ valid: true, skipped: true })
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('rejects a missing token when configured', async () => {
    const fetcher = vi.fn()
    await expect(
      verifyTurnstileToken({ token: null, ip: '203.0.113.8', secretKey: 'secret' }, fetcher)
    ).resolves.toEqual({ valid: false, skipped: false })
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('validates action and hostname when Cloudflare returns them', async () => {
    const fetcher = vi.fn().mockResolvedValue(
      Response.json({
        success: true,
        action: 'magic-link',
        hostname: 'feedback.layertoday.com',
      })
    )

    await expect(
      verifyTurnstileToken(
        {
          token: 'token',
          ip: '203.0.113.8',
          secretKey: 'secret',
          expectedHostname: 'feedback.layertoday.com',
        },
        fetcher
      )
    ).resolves.toEqual({ valid: true, skipped: false })
  })

  it.each([
    [{ success: false }, 'failed validation'],
    [{ success: true, action: 'other' }, 'wrong action'],
    [{ success: true, hostname: 'evil.example' }, 'wrong hostname'],
  ])('rejects %s (%s)', async (payload) => {
    const fetcher = vi.fn().mockResolvedValue(Response.json(payload))
    await expect(
      verifyTurnstileToken(
        {
          token: 'token',
          ip: '203.0.113.8',
          secretKey: 'secret',
          expectedHostname: 'feedback.layertoday.com',
        },
        fetcher
      )
    ).resolves.toEqual({ valid: false, skipped: false })
  })
})

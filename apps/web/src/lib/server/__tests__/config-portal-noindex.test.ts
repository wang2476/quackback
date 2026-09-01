import { afterEach, describe, expect, it, vi } from 'vitest'
import { config, resetConfig } from '../config'

function setRequiredConfig(): void {
  vi.stubEnv('BASE_URL', 'https://feedback.layertoday.com')
  vi.stubEnv('DATABASE_URL', 'postgres://quackback:secret@postgres/quackback')
  vi.stubEnv('SECRET_KEY', '0123456789abcdef0123456789abcdef')
}

afterEach(() => {
  resetConfig()
  vi.unstubAllEnvs()
})

describe('PORTAL_NOINDEX', () => {
  it('enables the portal indexing guard from the environment', () => {
    setRequiredConfig()
    vi.stubEnv('PORTAL_NOINDEX', 'true')

    expect(config.portalNoindex).toBe(true)
  })

  it('defaults to normal indexing when the environment variable is absent', () => {
    setRequiredConfig()
    vi.stubEnv('PORTAL_NOINDEX', '')

    expect(config.portalNoindex).toBe(false)
  })
})

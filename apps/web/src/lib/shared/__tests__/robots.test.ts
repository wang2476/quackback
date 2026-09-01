import { describe, expect, it } from 'vitest'
import { buildRobotsTxt } from '../robots'

describe('buildRobotsTxt', () => {
  it('disallows the entire portal and omits sitemaps when noindex is enabled', () => {
    expect(
      buildRobotsTxt({
        baseUrl: 'https://feedback.layertoday.com',
        portalNoindex: true,
        helpCenterEnabled: true,
        helpCenterIndexable: true,
      })
    ).toBe('User-agent: *\nDisallow: /\n')
  })

  it('preserves the normal public indexing directives when noindex is disabled', () => {
    expect(
      buildRobotsTxt({
        baseUrl: 'https://feedback.example.com',
        portalNoindex: false,
        helpCenterEnabled: false,
        helpCenterIndexable: false,
      })
    ).toContain('Sitemap: https://feedback.example.com/sitemap.xml')
  })
})

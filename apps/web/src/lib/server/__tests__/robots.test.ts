import { describe, expect, it } from 'vitest'
import { buildRobotsTxt } from '../robots'

describe('buildRobotsTxt', () => {
  it('disallows all crawling for private and noindex deployments', () => {
    expect(buildRobotsTxt('https://feedback.layertoday.com', true)).toBe(
      'User-agent: *\nDisallow: /\n'
    )
  })

  it('keeps the upstream public indexing policy by default', () => {
    const result = buildRobotsTxt('https://feedback.example.com', false)

    expect(result).toContain('Allow: /')
    expect(result).toContain('Disallow: /admin/')
    expect(result).toContain('Sitemap: https://feedback.example.com/sitemap.xml')
  })
})

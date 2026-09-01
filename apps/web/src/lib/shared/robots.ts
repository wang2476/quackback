export interface RobotsTxtOptions {
  baseUrl: string
  portalNoindex: boolean
  helpCenterEnabled: boolean
  helpCenterIndexable: boolean
}

export function buildRobotsTxt({
  baseUrl,
  portalNoindex,
  helpCenterEnabled,
  helpCenterIndexable,
}: RobotsTxtOptions): string {
  if (portalNoindex) {
    return ['User-agent: *', 'Disallow: /', ''].join('\n')
  }

  const lines = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin/',
    'Disallow: /auth/',
    'Disallow: /onboarding/',
    'Disallow: /api/',
    'Disallow: /widget',
    ...(helpCenterEnabled && !helpCenterIndexable ? ['Disallow: /hc'] : []),
    '',
    `Sitemap: ${baseUrl}/sitemap.xml`,
    ...(helpCenterIndexable ? [`Sitemap: ${baseUrl}/hc/sitemap.xml`] : []),
  ]

  return lines.join('\n') + '\n'
}

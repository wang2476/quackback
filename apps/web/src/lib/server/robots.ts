export function buildRobotsTxt(baseUrl: string, noindex: boolean): string {
  if (noindex) {
    return `User-agent: *
Disallow: /
`
  }

  return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /auth/
Disallow: /onboarding/
Disallow: /api/
Disallow: /widget

Sitemap: ${baseUrl}/sitemap.xml
`
}

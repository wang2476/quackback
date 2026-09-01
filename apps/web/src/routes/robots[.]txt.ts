import { createFileRoute } from '@tanstack/react-router'
import { buildRobotsTxt } from '@/lib/shared/robots'

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: async () => {
        const [{ config }, { isFeatureEnabled, getHelpCenterConfig }] = await Promise.all([
          import('@/lib/server/config'),
          import('@/lib/server/domains/settings/settings.service'),
        ])
        const baseUrl = config.baseUrl

        const helpCenterConfig = await getHelpCenterConfig()
        const helpCenterEnabled = await isFeatureEnabled('helpCenter')
        // Indexing toggle (domains/languages §1): off means neither crawlable
        // nor advertised via a sitemap link.
        const helpCenterIndexable = helpCenterEnabled && helpCenterConfig.seo?.indexable !== false

        const body = buildRobotsTxt({
          baseUrl,
          portalNoindex: config.portalNoindex,
          helpCenterEnabled,
          helpCenterIndexable,
        })

        return new Response(body, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=86400',
            Vary: 'Host',
          },
        })
      },
    },
  },
})

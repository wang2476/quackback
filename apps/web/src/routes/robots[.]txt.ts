import { createFileRoute } from '@tanstack/react-router'
import { buildRobotsTxt } from '@/lib/server/robots'

export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: async () => {
        const { config } = await import('@/lib/server/config')
        const baseUrl = config.baseUrl

        const body = buildRobotsTxt(baseUrl, process.env.PORTAL_NOINDEX === 'true')

        return new Response(body, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=86400',
          },
        })
      },
    },
  },
})

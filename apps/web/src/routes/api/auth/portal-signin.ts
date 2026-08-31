import { createFileRoute } from '@tanstack/react-router'
import { requestEmailSignin } from '@/lib/server/auth/email-signin'
import { checkPortalMagicLinkRateLimit } from '@/lib/server/auth/portal-magic-link-policy'
import { verifyTurnstileToken } from '@/lib/server/auth/turnstile'
import { getClientIp } from '@/lib/server/domains/api/rate-limit'
import { config } from '@/lib/server/config'
import { logger } from '@/lib/server/logger'

const log = logger.child({ component: 'portal-signin' })

interface PortalSigninBody {
  email?: unknown
  callbackURL?: unknown
  turnstileToken?: unknown
}

export const Route = createFileRoute('/api/auth/portal-signin')({
  server: {
    handlers: {
      /** Public runtime configuration; the site key is intentionally non-secret. */
      GET: async () => {
        const siteKey = process.env.TURNSTILE_SITE_KEY?.trim()
        const secretKey = process.env.TURNSTILE_SECRET_KEY?.trim()
        return Response.json(
          siteKey && secretKey ? { enabled: true, siteKey } : { enabled: false },
          { headers: { 'cache-control': 'no-store' } }
        )
      },

      /**
       * POST /api/auth/portal-signin
       * Triggers a passwordless sign-in email containing both a magic
       * link and a 6-digit OTP. The frontend then shows the OTP input
       * as primary; users can also click the link in the email.
       */
      POST: async ({ request }) => {
        let body: PortalSigninBody
        try {
          body = (await request.json()) as PortalSigninBody
        } catch {
          return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
        }

        if (typeof body.email !== 'string' || !body.email.includes('@')) {
          return Response.json({ error: 'Valid email required' }, { status: 400 })
        }
        const callbackURL = typeof body.callbackURL === 'string' ? body.callbackURL : '/'
        const turnstileToken = typeof body.turnstileToken === 'string' ? body.turnstileToken : null
        const ip = getClientIp(request.headers)

        const turnstile = await verifyTurnstileToken({
          token: turnstileToken,
          ip,
          secretKey: process.env.TURNSTILE_SECRET_KEY?.trim(),
          expectedHostname: new URL(config.baseUrl).hostname,
        })
        if (!turnstile.valid) {
          return Response.json(
            { error: 'Please complete the security check and try again.' },
            { status: 403 }
          )
        }

        const limit = await checkPortalMagicLinkRateLimit(ip, body.email)
        if (!limit.allowed) {
          return Response.json(
            { error: 'Too many sign-in requests. Try again later.' },
            {
              status: 429,
              headers: limit.retryAfter ? { 'retry-after': String(limit.retryAfter) } : undefined,
            }
          )
        }

        try {
          await requestEmailSignin({ email: body.email, callbackURL })
          return Response.json({ ok: true }, { status: 202 })
        } catch (err) {
          log.error({ err }, 'portal signin failed')
          // A generic accepted response prevents transport/account state from
          // becoming an email-enumeration oracle. Operators still get the log.
          return Response.json({ ok: true }, { status: 202 })
        }
      },
    },
  },
})

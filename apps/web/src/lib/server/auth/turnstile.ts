const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const EXPECTED_ACTION = 'magic-link'

interface TurnstileVerificationRequest {
  token: string | null
  ip: string
  secretKey: string | undefined
  expectedHostname?: string
}

interface TurnstileSiteverifyResponse {
  success?: boolean
  action?: string
  hostname?: string
}

export interface TurnstileVerificationResult {
  valid: boolean
  skipped: boolean
}

type Fetcher = (input: string | URL | Request, init?: RequestInit) => Promise<Response>

/** Server-side, single-use Turnstile validation for the magic-link action. */
export async function verifyTurnstileToken(
  request: TurnstileVerificationRequest,
  fetcher: Fetcher = fetch
): Promise<TurnstileVerificationResult> {
  if (!request.secretKey) return { valid: true, skipped: true }
  if (!request.token) return { valid: false, skipped: false }

  try {
    const response = await fetcher(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        secret: request.secretKey,
        response: request.token,
        remoteip: request.ip,
      }),
    })
    if (!response.ok) return { valid: false, skipped: false }

    const result = (await response.json()) as TurnstileSiteverifyResponse
    if (!result.success) return { valid: false, skipped: false }
    if (result.action && result.action !== EXPECTED_ACTION) {
      return { valid: false, skipped: false }
    }
    if (
      request.expectedHostname &&
      result.hostname &&
      result.hostname !== request.expectedHostname
    ) {
      return { valid: false, skipped: false }
    }
    return { valid: true, skipped: false }
  } catch {
    return { valid: false, skipped: false }
  }
}

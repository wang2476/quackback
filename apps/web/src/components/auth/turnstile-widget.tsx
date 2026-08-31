import { useEffect, useRef, useState } from 'react'

interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string
      action: string
      theme: 'auto'
      callback: (token: string) => void
      'error-callback': () => void
      'expired-callback': () => void
    }
  ) => string
  remove: (widgetId: string) => void
  reset: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

interface TurnstileConfig {
  enabled: boolean
  siteKey?: string
}

interface TurnstileWidgetProps {
  resetKey: number
  onTokenChange: (token: string | null) => void
  onRequirementChange: (required: boolean) => void
}

let scriptPromise: Promise<void> | null = null

function loadTurnstileScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Turnstile failed to load'))
    document.head.appendChild(script)
  })
  return scriptPromise
}

/** Runtime-configured Turnstile widget for public magic-link requests. */
export function TurnstileWidget({
  resetKey,
  onTokenChange,
  onRequirementChange,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const [siteKey, setSiteKey] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    void fetch('/api/auth/portal-signin', { signal: controller.signal })
      .then((response) => response.json() as Promise<TurnstileConfig>)
      .then((config) => {
        const required = config.enabled && Boolean(config.siteKey)
        onRequirementChange(required)
        if (required) setSiteKey(config.siteKey ?? null)
      })
      .catch(() => onRequirementChange(false))
    return () => controller.abort()
  }, [onRequirementChange])

  useEffect(() => {
    if (!siteKey || !containerRef.current) return
    let cancelled = false
    void loadTurnstileScript().then(() => {
      if (cancelled || !window.turnstile || !containerRef.current) return
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action: 'magic-link',
        theme: 'auto',
        callback: onTokenChange,
        'error-callback': () => onTokenChange(null),
        'expired-callback': () => onTokenChange(null),
      })
    })
    return () => {
      cancelled = true
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [onTokenChange, siteKey])

  useEffect(() => {
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current)
      onTokenChange(null)
    }
  }, [onTokenChange, resetKey])

  if (!siteKey) return null
  return <div ref={containerRef} className="flex min-h-[65px] justify-center" />
}

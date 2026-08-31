const DEFAULT_EMAIL_PRODUCT_NAME = 'Quackback'

/** Runtime-configurable product name used only in user-facing email copy. */
export function getEmailProductName(env: Record<string, string | undefined> = process.env): string {
  return env.EMAIL_PRODUCT_NAME?.trim() || DEFAULT_EMAIL_PRODUCT_NAME
}

export interface PortalSiteMetadata {
  title: string
  description: string
}

export const PORTAL_FAVICON_HREF = '/favicon.svg'
export const LAYER_HOME_LINK = {
  label: 'Back to Layer',
  url: 'https://layertoday.com',
} as const

export const LAYER_SUPPORT_EMAIL = 'help@layertoday.com'

export function getPortalSiteMetadata(workspaceName: string): PortalSiteMetadata {
  const name = workspaceName.trim() || 'Layer'
  return {
    title: `${name} Feedback`,
    description: `Share and vote on ideas to help shape ${name}.`,
  }
}

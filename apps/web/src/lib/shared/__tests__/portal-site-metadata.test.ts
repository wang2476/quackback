import { describe, expect, it } from 'vitest'
import { getPortalSiteMetadata, PORTAL_FAVICON_HREF } from '../portal-site-metadata'

describe('portal site metadata', () => {
  it('brands the Layer portal title and description', () => {
    expect(getPortalSiteMetadata('Layer')).toEqual({
      title: 'Layer Feedback',
      description: 'Share and vote on ideas to help shape Layer.',
    })
  })

  it('keeps metadata workspace-driven', () => {
    expect(getPortalSiteMetadata('Acme')).toEqual({
      title: 'Acme Feedback',
      description: 'Share and vote on ideas to help shape Acme.',
    })
  })

  it('uses the bundled Layer favicon', () => {
    expect(PORTAL_FAVICON_HREF).toBe('/favicon.svg')
  })
})

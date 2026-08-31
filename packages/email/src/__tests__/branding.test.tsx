import { afterEach, describe, expect, it } from 'vitest'
import { render } from '@react-email/components'
import { getEmailProductName } from '../branding'
import { InvitationEmail } from '../templates/invitation'
import { MagicLinkEmail } from '../templates/magic-link'
import { PasswordResetEmail } from '../templates/password-reset'
import { WelcomeEmail } from '../templates/welcome'

const originalProductName = process.env.EMAIL_PRODUCT_NAME

afterEach(() => {
  if (originalProductName === undefined) delete process.env.EMAIL_PRODUCT_NAME
  else process.env.EMAIL_PRODUCT_NAME = originalProductName
})

describe('email product branding', () => {
  it('defaults to Quackback for upstream-compatible deployments', () => {
    delete process.env.EMAIL_PRODUCT_NAME
    expect(getEmailProductName()).toBe('Quackback')
  })

  it('normalizes a configured product name', () => {
    process.env.EMAIL_PRODUCT_NAME = '  Layer  '
    expect(getEmailProductName()).toBe('Layer')
  })

  it('renders transactional templates without upstream branding when configured', async () => {
    process.env.EMAIL_PRODUCT_NAME = 'Layer'
    const html = await Promise.all([
      render(
        InvitationEmail({
          invitedByName: 'Aaron',
          organizationName: 'Layer',
          inviteLink: 'https://feedback.layertoday.com/invite',
        })
      ),
      render(
        WelcomeEmail({
          name: 'Runner',
          workspaceName: 'Layer',
          dashboardUrl: 'https://feedback.layertoday.com/admin',
        })
      ),
      render(
        MagicLinkEmail({
          signInUrl: 'https://feedback.layertoday.com/verify',
          code: '123456',
        })
      ),
      render(PasswordResetEmail({ resetLink: 'https://feedback.layertoday.com/reset' })),
    ])

    for (const rendered of html) {
      expect(rendered).toContain('Layer')
      expect(rendered).not.toContain('Quackback')
    }
  })
})

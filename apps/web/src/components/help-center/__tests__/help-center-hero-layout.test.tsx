// @vitest-environment happy-dom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { HelpCenterHero } from '../help-center-hero'

afterEach(cleanup)

describe('HelpCenterHero layout', () => {
  it('uses the portal background and one constrained content column', () => {
    render(
      <HelpCenterHero variant="home" title="Layer Help" description="Help for Layer runners.">
        <div data-testid="hero-search" />
      </HelpCenterHero>
    )

    const hero = screen.getByRole('heading', { name: 'Layer Help' }).closest('section')
    expect(hero).not.toBeNull()
    expect(hero).toHaveClass('py-12', 'sm:py-14')
    expect(hero?.querySelector('[aria-hidden="true"]')).toBeNull()
    expect(hero?.querySelector('.max-w-4xl')).not.toBeNull()
  })

  it('keeps compact search pages on the same content column', () => {
    render(
      <HelpCenterHero variant="compact">
        <div data-testid="compact-search" />
      </HelpCenterHero>
    )

    const search = screen.getByTestId('compact-search')
    expect(search.closest('.max-w-4xl')).not.toBeNull()
    expect(search.closest('section')).toHaveClass('py-6', 'sm:py-8')
  })
})

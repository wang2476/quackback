// @vitest-environment happy-dom
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { PortalBackground } from '../portal-background'

afterEach(cleanup)

describe('PortalBackground', () => {
  it('keeps the decorative grid and brand glow in the shared portal shell', () => {
    const { container } = render(<PortalBackground />)
    const background = container.firstElementChild

    expect(background).toHaveAttribute('aria-hidden', 'true')
    expect(background).toHaveClass('absolute', 'inset-x-0', 'top-0', '-z-10')
    expect(background?.children).toHaveLength(2)
    expect(background?.children[0]).toHaveStyle({ backgroundSize: '52px 52px' })
    expect(background?.children[1]).toHaveStyle({
      background:
        'radial-gradient(ellipse at center, color-mix(in oklch, var(--primary) 20%, transparent), transparent 70%)',
    })
  })
})

// @vitest-environment happy-dom
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HelpCenterPopularArticles } from '../help-center-popular-articles'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, ...props }: React.ComponentProps<'a'> & { to: string }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

afterEach(cleanup)

describe('HelpCenterPopularArticles', () => {
  it('keeps article metadata readable on narrow screens', () => {
    render(
      <HelpCenterPopularArticles
        articles={[
          {
            id: 'article-1',
            slug: 'bugs-features-and-support',
            title: 'Report a bug, request a feature, or contact support',
            categorySlug: 'safety-and-support',
            categoryName: 'Safety & support',
          },
        ]}
      />
    )

    const link = screen.getByRole('link', {
      name: /report a bug, request a feature, or contact support/i,
    })
    const categoryLabels = screen.getAllByText('Safety & support')

    expect(link).toHaveClass('items-start', 'sm:items-center')
    expect(categoryLabels).toHaveLength(2)
    expect(categoryLabels[0]).toHaveClass('sm:hidden')
    expect(categoryLabels[1]).toHaveClass('hidden', 'sm:block')
  })
})

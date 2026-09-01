// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { HelpCenterFaqItem } from '@/lib/shared/types/settings'
import { HelpCenterQuickAnswers } from '../help-center-quick-answers'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, ...props }: React.ComponentProps<'a'> & { to: string }) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}))

const items: HelpCenterFaqItem[] = [
  {
    id: 'account',
    question: 'Do I need an account to use Layer?',
    answer: 'You can use Layer without an account.',
    articlePath: '/hc/articles/accounts-connections/accounts-sync-and-restoring-data',
  },
  {
    id: 'safety',
    question: 'Does Layer tell me whether it is safe to run?',
    answer: 'No. Check an official local source.',
  },
]

afterEach(() => cleanup())

describe('HelpCenterQuickAnswers', () => {
  it('renders nothing when no items are configured', () => {
    const { container } = render(<HelpCenterQuickAnswers items={[]} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders collapsed questions and the optional guide link', () => {
    render(<HelpCenterQuickAnswers items={items} />)

    expect(screen.getByRole('heading', { name: 'Quick answers' })).toBeInTheDocument()
    const details = document.querySelectorAll('details')
    expect(details).toHaveLength(2)
    expect(details[0]).not.toHaveAttribute('open')
    expect(screen.getByRole('link', { name: 'Read the full guide' })).toHaveAttribute(
      'href',
      items[0].articlePath
    )
  })

  it('allows more than one answer to remain open', () => {
    render(<HelpCenterQuickAnswers items={items} />)

    fireEvent.click(screen.getByText('Do I need an account to use Layer?'))
    fireEvent.click(screen.getByText('Does Layer tell me whether it is safe to run?'))

    const details = document.querySelectorAll('details')
    expect(details[0]).toHaveAttribute('open')
    expect(details[1]).toHaveAttribute('open')
  })
})

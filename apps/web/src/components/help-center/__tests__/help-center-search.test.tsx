// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { IntlProvider } from 'react-intl'

vi.mock('@/components/help-center/use-kb-search', () => ({
  useKbSearch: () => ({ results: [], isSearching: false }),
}))

vi.mock('@/components/help-center/ask-ai', () => ({
  AskAiAnswerPanel: () => null,
  AskAiRow: () => null,
  HighlightedText: ({ text }: { text: string }) => text,
  useAskAiAvailable: () => false,
  useAskAiSearchController: () => ({
    askAiState: null,
    selectedIndex: -1,
    hasAskRow: false,
    answerOpen: false,
    askRowOffset: 0,
    triggerAsk: vi.fn(),
    dismissAnswer: vi.fn(),
    handleKeyDown: vi.fn(),
  }),
}))

import { HelpCenterHeroSearch } from '../help-center-search'

afterEach(cleanup)

describe('HelpCenterHeroSearch', () => {
  it('warns visitors not to submit private details', () => {
    render(
      <IntlProvider locale="en" messages={{}}>
        <HelpCenterHeroSearch />
      </IntlProvider>
    )

    const searchbox = screen.getByRole('searchbox', { name: 'Search articles...' })
    expect(searchbox).toBeInTheDocument()
    expect(searchbox.parentElement).toHaveClass('bg-card', 'shadow-sm')
    expect(searchbox.parentElement).not.toHaveClass('bg-muted', 'shadow-lg')

    const warning = screen.getByText(
      'Do not enter private run, health, exact location, account, or authentication details.'
    )
    expect(warning).toBeInTheDocument()
    expect(warning).not.toHaveClass('px-1')
  })
})

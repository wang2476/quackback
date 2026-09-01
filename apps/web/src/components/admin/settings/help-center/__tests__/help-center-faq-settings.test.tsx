// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { HelpCenterFaqItem } from '@/lib/shared/types/settings'
import { cleanFaqItems, HelpCenterFaqSettings, moveFaqItem } from '../help-center-faq-settings'

const items: HelpCenterFaqItem[] = [
  { id: 'first', question: 'First question?', answer: 'First answer.' },
  { id: 'second', question: 'Second question?', answer: 'Second answer.' },
]

afterEach(() => cleanup())

describe('HelpCenterFaqSettings', () => {
  it('moves and removes answers in the editor', () => {
    render(<HelpCenterFaqSettings initialItems={items} isBusy={false} onSave={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Move answer 1 down' }))
    expect(
      screen.getAllByLabelText('Question').map((input) => input.getAttribute('value'))
    ).toEqual(['Second question?', 'First question?'])

    fireEvent.click(screen.getByRole('button', { name: 'Remove answer 1' }))
    expect(screen.getAllByLabelText('Question')).toHaveLength(1)
    expect(screen.getByLabelText('Question')).toHaveValue('First question?')
  })

  it('adds a blank answer below the configured items', () => {
    render(<HelpCenterFaqSettings initialItems={items} isBusy={false} onSave={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Add answer' }))

    expect(screen.getAllByLabelText('Question')).toHaveLength(3)
    expect(screen.getAllByLabelText('Question')[2]).toHaveValue('')
    expect(screen.getByRole('button', { name: 'Save answers' })).toBeDisabled()
  })

  it('trims fields and removes a blank guide path before saving', () => {
    const onSave = vi.fn()
    render(
      <HelpCenterFaqSettings
        initialItems={[
          {
            id: 'trim',
            question: '  Question?  ',
            answer: '  Answer.  ',
            articlePath: '   ',
          },
        ]}
        isBusy={false}
        onSave={onSave}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Save answers' }))

    expect(onSave).toHaveBeenCalledWith([{ id: 'trim', question: 'Question?', answer: 'Answer.' }])
  })

  it('disables adding when eight answers are configured', () => {
    const eight = Array.from({ length: 8 }, (_, index) => ({
      id: `faq-${index}`,
      question: `Question ${index}?`,
      answer: `Answer ${index}.`,
    }))

    render(<HelpCenterFaqSettings initialItems={eight} isBusy={false} onSave={vi.fn()} />)

    expect(screen.getByRole('button', { name: 'Add answer' })).toBeDisabled()
  })
})

describe('FAQ item helpers', () => {
  it('does not mutate the source array while reordering', () => {
    expect(moveFaqItem(items, 0, 1).map((item) => item.id)).toEqual(['second', 'first'])
    expect(items.map((item) => item.id)).toEqual(['first', 'second'])
  })

  it('cleans a populated guide path', () => {
    expect(
      cleanFaqItems([
        {
          id: 'guide',
          question: ' Question? ',
          answer: ' Answer. ',
          articlePath: ' /hc/articles/category/article ',
        },
      ])
    ).toEqual([
      {
        id: 'guide',
        question: 'Question?',
        answer: 'Answer.',
        articlePath: '/hc/articles/category/article',
      },
    ])
  })
})

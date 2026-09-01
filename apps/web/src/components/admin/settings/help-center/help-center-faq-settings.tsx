import { useState } from 'react'
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SettingsCard } from '@/components/admin/settings/settings-card'
import { InlineSpinner } from '@/components/admin/settings/inline-spinner'
import type { HelpCenterFaqItem } from '@/lib/shared/types/settings'
import { HELP_CENTER_FAQ_ITEMS_MAX } from '@/lib/shared/help-center-config'

interface HelpCenterFaqSettingsProps {
  initialItems: HelpCenterFaqItem[]
  isBusy: boolean
  onSave: (items: HelpCenterFaqItem[]) => void
}

function newFaqId(): string {
  return `faq-${crypto.randomUUID()}`
}

export function cleanFaqItems(items: HelpCenterFaqItem[]): HelpCenterFaqItem[] {
  return items.map((item) => {
    const articlePath = item.articlePath?.trim()
    return {
      id: item.id,
      question: item.question.trim(),
      answer: item.answer.trim(),
      ...(articlePath ? { articlePath } : {}),
    }
  })
}

export function moveFaqItem(
  items: HelpCenterFaqItem[],
  fromIndex: number,
  toIndex: number
): HelpCenterFaqItem[] {
  if (
    fromIndex < 0 ||
    fromIndex >= items.length ||
    toIndex < 0 ||
    toIndex >= items.length ||
    fromIndex === toIndex
  ) {
    return items
  }
  const next = [...items]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}

export function HelpCenterFaqSettings({
  initialItems,
  isBusy,
  onSave,
}: HelpCenterFaqSettingsProps) {
  const [items, setItems] = useState<HelpCenterFaqItem[]>(initialItems)
  const isComplete = items.every((item) => item.question.trim() && item.answer.trim())

  function updateItem(index: number, patch: Partial<HelpCenterFaqItem>) {
    setItems((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item))
    )
  }

  function addItem() {
    setItems((current) =>
      current.length >= HELP_CENTER_FAQ_ITEMS_MAX
        ? current
        : [...current, { id: newFaqId(), question: '', answer: '' }]
    )
  }

  function removeItem(index: number) {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  function saveItems() {
    const cleaned = cleanFaqItems(items)
    setItems(cleaned)
    onSave(cleaned)
  }

  return (
    <SettingsCard
      title="Quick answers"
      description={`Up to ${HELP_CENTER_FAQ_ITEMS_MAX} expandable answers shown on the default Help Center homepage`}
    >
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="space-y-3 rounded-xl border border-border p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-foreground">Answer {index + 1}</span>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setItems((current) => moveFaqItem(current, index, index - 1))}
                  disabled={isBusy || index === 0}
                  aria-label={`Move answer ${index + 1} up`}
                >
                  <ArrowUpIcon className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setItems((current) => moveFaqItem(current, index, index + 1))}
                  disabled={isBusy || index === items.length - 1}
                  aria-label={`Move answer ${index + 1} down`}
                >
                  <ArrowDownIcon className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
                  disabled={isBusy}
                  aria-label={`Remove answer ${index + 1}`}
                >
                  <TrashIcon className="size-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor={`faq-question-${item.id}`}>Question</Label>
              <Input
                id={`faq-question-${item.id}`}
                value={item.question}
                onChange={(event) => updateItem(index, { question: event.target.value })}
                maxLength={160}
                disabled={isBusy}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`faq-answer-${item.id}`}>Answer</Label>
              <Textarea
                id={`faq-answer-${item.id}`}
                value={item.answer}
                onChange={(event) => updateItem(index, { answer: event.target.value })}
                maxLength={600}
                rows={3}
                disabled={isBusy}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`faq-guide-${item.id}`}>Full guide path</Label>
              <Input
                id={`faq-guide-${item.id}`}
                value={item.articlePath ?? ''}
                onChange={(event) => updateItem(index, { articlePath: event.target.value })}
                placeholder="/hc/articles/category/article"
                maxLength={500}
                disabled={isBusy}
              />
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
            disabled={isBusy || items.length >= HELP_CENTER_FAQ_ITEMS_MAX}
          >
            <PlusIcon className="me-2 size-4" />
            Add answer
          </Button>
          <div className="flex items-center gap-2">
            <InlineSpinner visible={isBusy} />
            <Button type="button" size="sm" onClick={saveItems} disabled={isBusy || !isComplete}>
              Save answers
            </Button>
          </div>
        </div>
      </div>
    </SettingsCard>
  )
}

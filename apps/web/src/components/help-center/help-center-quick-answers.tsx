import { Link } from '@tanstack/react-router'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import type { HelpCenterFaqItem } from '@/lib/shared/types/settings'

interface HelpCenterQuickAnswersProps {
  items: HelpCenterFaqItem[]
}

export function HelpCenterQuickAnswers({ items }: HelpCenterQuickAnswersProps) {
  if (items.length === 0) return null

  return (
    <section aria-labelledby="hc-quick-answers" className="max-w-4xl">
      <div className="mb-5">
        <h2 id="hc-quick-answers" className="text-2xl font-semibold tracking-tight text-foreground">
          Quick answers
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Open a question for a short answer. Each one links to the full guide.
        </p>
      </div>

      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {items.map((item) => (
          <details key={item.id} className="group">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-base font-medium text-foreground transition-colors hover:bg-primary/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <ChevronDownIcon
                aria-hidden="true"
                className="size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
              />
            </summary>
            <div className="px-5 pb-5 pe-12">
              <p className="text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
              {item.articlePath && (
                <Link
                  to={item.articlePath as '/hc'}
                  className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                >
                  Read the full guide
                </Link>
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}

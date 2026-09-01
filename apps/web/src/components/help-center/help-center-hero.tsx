import type { ReactNode } from 'react'
import { cn } from '@/lib/shared/utils'

interface HelpCenterHeroProps {
  /** 'home' shows the heading + subtitle above the search; 'compact' is search-only. */
  variant: 'home' | 'compact'
  title?: string
  description?: string
  /** The search element (rendered below the heading on home, alone on compact). */
  children: ReactNode
}

/**
 * Help Center heading and search. The shared portal shell owns the decorative
 * background so switching between Feedback and Help Center keeps one visual ground.
 */
export function HelpCenterHero({ variant, title, description, children }: HelpCenterHeroProps) {
  return (
    <section className={cn('w-full', variant === 'home' ? 'py-12 sm:py-14' : 'py-6 sm:py-8')}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-4xl">
          {variant === 'home' && title && (
            <div>
              <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
                {title}
              </h1>
              {description && (
                <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {description}
                </p>
              )}
              <div className="mt-7">{children}</div>
            </div>
          )}
          {variant === 'compact' && children}
        </div>
      </div>
    </section>
  )
}

import { Link } from '@tanstack/react-router'
import { DocumentTextIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

export interface PopularArticle {
  id: string
  slug: string
  title: string
  categorySlug: string
  categoryName: string
}

interface HelpCenterPopularArticlesProps {
  articles: PopularArticle[]
}

export function HelpCenterPopularArticles({ articles }: HelpCenterPopularArticlesProps) {
  if (articles.length === 0) return null

  return (
    <section aria-labelledby="hc-popular">
      <h2 id="hc-popular" className="mb-5 text-2xl font-semibold tracking-tight text-foreground">
        Popular articles
      </h2>
      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {articles.map((article) => (
          <Link
            key={article.id}
            to={`/hc/articles/${article.categorySlug}/${article.slug}` as '/hc'}
            className="group flex items-start gap-3 px-5 py-4 transition-colors hover:bg-primary/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:items-center sm:gap-4 sm:px-6 sm:py-5"
          >
            <DocumentTextIcon className="mt-0.5 size-5 shrink-0 text-primary sm:mt-0" />
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-foreground sm:text-base">
                {article.title}
              </span>
              <span className="mt-1 block text-xs text-muted-foreground sm:hidden">
                {article.categoryName}
              </span>
            </span>
            <span className="hidden shrink-0 whitespace-nowrap text-xs text-muted-foreground sm:block">
              {article.categoryName}
            </span>
            <ChevronRightIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground/60 transition-colors group-hover:text-primary sm:mt-0" />
          </Link>
        ))}
      </div>
    </section>
  )
}

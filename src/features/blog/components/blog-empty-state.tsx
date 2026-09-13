"use client"

import { useTranslation } from "@/lib/i18n/use-translation"

export function BlogEmptyState() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-base font-semibold text-foreground">
        {t.blog.emptyTitle}
      </p>
      <p className="text-sm text-muted-foreground">
        {t.blog.emptyDescription}
      </p>
    </div>
  )
}

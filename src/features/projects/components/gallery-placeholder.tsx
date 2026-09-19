"use client"

import { useTranslation } from "@/lib/i18n/use-translation"

/**
 * Filler tile for the gallery grid when the item count is odd. Kept as a tiny
 * client component so the localized label can live in the shared dictionary
 * while the gallery page itself stays a server component.
 */
export function GalleryPlaceholder() {
  const { t } = useTranslation()

  return (
    <div className="hidden min-h-62.5 flex-col items-center justify-center bg-card p-6 select-none sm:flex">
      <span className="font-handwritten text-3xl font-medium tracking-wider text-muted-foreground">
        {t.gallery.workInProgress}
      </span>
    </div>
  )
}

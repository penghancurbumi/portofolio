"use client"

import { differenceInMonths, format, parse } from "date-fns"

import { Collapsible, CollapsibleChevronsIcon } from "@/components/base/collapsible-animated"
import { CollapsibleContent, CollapsibleTrigger } from "@/components/base/ui/collapsible"
import { Markdown } from "@/components/markdown"
import { Tag } from "@/components/ui/tag"
import { Prose } from "@/components/ui/typography"
import type { ExperiencePosition } from "@/features/portfolio/types/experiences"
import { useTranslation } from "@/lib/i18n/use-translation"
import { cn } from "@/lib/utils"

const EMPLOYMENT_TYPE_ID: Record<string, string> = {
  Internship: "Magang",
  Cohort: "Kohort",
  "Part-time": "Paruh Waktu",
  Community: "Komunitas",
}

export function ExperiencePositionItem({
  position,
}: {
  position: ExperiencePosition
}) {
  const { t, l, language } = useTranslation()
  const { start, end } = position.employmentPeriod
  const isOngoing = !end
  const duration = formatDuration(start, end, language)
  const employmentType =
    language === "id" && position.employmentType
      ? (EMPLOYMENT_TYPE_ID[position.employmentType] ?? position.employmentType)
      : position.employmentType

  return (
    <Collapsible
      className="group/experience-position relative"
      defaultOpen={position.isExpanded}
      disabled={!position.description}
    >
      <CollapsibleTrigger
        className={cn(
          "group block w-full text-left",
          "outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset",
          "data-disabled:pointer-events-none"
        )}
      >
        <div className="relative z-1 flex items-start gap-3">
          <span className="flex-1 font-medium text-balance">
            {position.title}
          </span>

          <div className="shrink-0 text-muted-foreground group-data-disabled:hidden [&_svg]:size-4">
            <CollapsibleChevronsIcon duration={0.15} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {employmentType && (
            <>
              <span>{employmentType}</span>
              <span aria-hidden className="inline-block h-3 w-px shrink-0 self-center bg-border" />
            </>
          )}

          <span className="font-mono text-xs tabular-nums">
            <span>{formatPeriodDate(start)}</span>
            <span> - </span>
            <span>{isOngoing ? t.experiences.present : (end ? formatPeriodDate(end) : "")}</span>
          </span>

          {duration && (
            <>
              <span aria-hidden className="inline-block h-3 w-px shrink-0 self-center bg-border" />
              <span suppressHydrationWarning className="font-mono text-xs tabular-nums">
                {duration}
              </span>
            </>
          )}
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="overflow-hidden">
        {position.description && (
          <div className="relative ml-2.5 pt-2 pb-2 pl-6">
            <div
              className="pointer-events-none absolute left-0 top-0 bottom-3 w-px bg-border"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute bottom-1 left-0 size-3.5 rounded-bl-sm border-b border-l border-border"
              aria-hidden
            />
            <Prose>
              <Markdown>{l(position.description, position.descriptionId)}</Markdown>
            </Prose>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}

function formatDuration(
  start: string,
  end?: string,
  language: string = "en"
): string {
  const startHasMonth = start.includes(".")
  const endHasMonth = end ? end.includes(".") : true

  // Both year-only: granularity is years, no month arithmetic needed.
  if (!startHasMonth && end && !endHasMonth) {
    const years = parseInt(end, 10) - parseInt(start, 10)
    if (years <= 0) {
      return ""
    }
    if (language === "id") {
      return `${years} tahun`
    }
    return `${years} ${years === 1 ? "year" : "years"}`
  }

  const startDate = parsePeriodDate(start, "first")
  const endDate = end ? parsePeriodDate(end, "last") : new Date()

  // +1 to count both the start and end months inclusively.
  const totalMonths = differenceInMonths(endDate, startDate) + 1
  if (totalMonths <= 0) {
    return ""
  }

  if (language === "id") {
    if (totalMonths < 12) {
      return `${totalMonths} bulan`
    }
    const years = Math.floor(totalMonths / 12)
    const months = totalMonths % 12
    if (months === 0) {
      return `${years} tahun`
    }
    return `${years} tahun ${months} bulan`
  }

  if (totalMonths < 12) {
    return `${totalMonths} ${totalMonths === 1 ? "month" : "months"}`
  }

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  const yearStr = `${years} ${years === 1 ? "year" : "years"}`

  if (months === 0) {
    return yearStr
  }
  const monthStr = `${months} ${months === 1 ? "month" : "months"}`
  return `${yearStr} ${monthStr}`
}

function parsePeriodDate(str: string, fallbackMonth: "first" | "last"): Date {
  if (str.includes(".")) {
    return parse(str, "MM.yyyy", new Date())
  }
  return parse(
    `${fallbackMonth === "last" ? "12" : "01"}.${str}`,
    "MM.yyyy",
    new Date()
  )
}

function formatPeriodDate(str: string): string {
  if (str.includes(".")) {
    const date = parse(str, "MM.yyyy", new Date())
    return format(date, "MMM yyyy")
  }
  // Year-only string, return as-is
  return str
}

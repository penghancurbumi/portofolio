"use client"

import { useEffect, useState } from "react"

/**
 * Analogue clock stamp for the footer colophon, adapted from cali.so
 * (MIT, © Cali Castle) onto this project's tokens.
 *
 * The hands only start once mounted: rendering a real time on the server would
 * be a different second than the client's first paint, which is a hydration
 * mismatch. Until then the readout shows placeholder dashes and the hands sit
 * at twelve, so nothing shifts when it resolves.
 */

// Stamp styling is duplicated from site-footer.tsx on purpose: importing the
// constants from there would pull the server footer module into this client
// bundle. Keep both copies in sync when the shape changes.
const STAMP_CLASS =
  "flex min-h-5.5 items-center gap-2 font-ibm-plex-mono text-[12px] leading-none tracking-wide text-muted-foreground/88 tabular-nums"

const STAMP_LINES_CLASS =
  "flex flex-col gap-px font-ibm-plex-mono text-[12px] tracking-wide [&>span]:tracking-[0.08em] [&>span]:text-muted-foreground/78 [&>span:last-child:not(:first-child)]:block [&>span:last-child:not(:first-child)]:min-w-[8ch] [&>span:last-child:not(:first-child)]:tracking-[0.02em] [&>span:last-child:not(:first-child)]:whitespace-nowrap [&>span:last-child:not(:first-child)]:text-muted-foreground/90"

function useClockParts(timeZone: string) {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    let timer: number | undefined

    const tick = () => {
      const current = new Date()
      setNow(current)
      // Re-align to the next second boundary instead of drifting by interval.
      timer = window.setTimeout(tick, 1010 - (current.getTime() % 1000))
    }

    // A background tab does not need a running second hand.
    const syncVisibility = () => {
      if (timer !== undefined) window.clearTimeout(timer)
      timer = undefined
      if (!document.hidden) tick()
    }

    syncVisibility()
    document.addEventListener("visibilitychange", syncVisibility)

    return () => {
      document.removeEventListener("visibilitychange", syncVisibility)
      if (timer !== undefined) window.clearTimeout(timer)
    }
  }, [])

  // The zone's offset is deterministic, so it is derived here rather than held
  // in state: server and client resolve the same string for the same zone.
  const offset = utcOffsetLabel(timeZone, now ?? new Date(0))

  if (!now) {
    return {
      hour: 0,
      minute: 0,
      second: 0,
      label: "--:-- --",
      iso: undefined,
      offset,
    }
  }

  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hourCycle: "h23",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
      .formatToParts(now)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value])
  )

  return {
    hour: Number(parts.hour),
    minute: Number(parts.minute),
    second: Number(parts.second),
    label: new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour12: true,
      hour: "numeric",
      minute: "2-digit",
    }).format(now),
    iso: now.toISOString(),
    offset,
  }
}

/** "Asia/Jakarta" → "UTC+7", read from the zone rather than hardcoded. */
function utcOffsetLabel(timeZone: string, at: Date) {
  const zonePart = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeZoneName: "shortOffset",
  })
    .formatToParts(at)
    .find((part) => part.type === "timeZoneName")

  return zonePart?.value.replace("GMT", "UTC") ?? "UTC"
}

export function FooterClock({
  timeZone,
  place,
}: {
  timeZone: string
  place: string
}) {
  const { hour, minute, second, label, iso, offset } = useClockParts(timeZone)

  const secondAngle = second * 6
  const minuteAngle = (minute + second / 60) * 6
  const hourAngle = ((hour % 12) + minute / 60 + second / 3600) * 30

  return (
    <div className={STAMP_CLASS}>
      {/* Size, fill and stroke are attributes as well as classes: an SVG with
          none of them falls back to its 300×150 intrinsic box filled solid
          black, so any moment without the stylesheet renders a black disc
          instead of a dial. */}
      <svg
        className="size-5.5 flex-none overflow-visible"
        viewBox="0 0 32 32"
        width="22"
        height="22"
        fill="none"
        stroke="currentColor"
        aria-hidden
        focusable="false"
      >
        <circle cx="16" cy="16" r="14.5" opacity={0.28} strokeWidth={1} />
        <path
          d="M16 3.5v2M28.5 16h-2M16 28.5v-2M3.5 16h2"
          opacity={0.28}
          strokeWidth={1}
          strokeLinecap="round"
        />
        <line
          x1="16"
          y1="16"
          x2="16"
          y2="9.5"
          opacity={0.78}
          strokeWidth={1.6}
          strokeLinecap="round"
          transform={`rotate(${hourAngle} 16 16)`}
        />
        <line
          x1="16"
          y1="16"
          x2="16"
          y2="6.75"
          opacity={0.72}
          strokeWidth={1.2}
          strokeLinecap="round"
          transform={`rotate(${minuteAngle} 16 16)`}
        />
        <line
          x1="16"
          y1="17.5"
          x2="16"
          y2="5.5"
          opacity={0.42}
          strokeWidth={0.75}
          strokeLinecap="round"
          transform={`rotate(${secondAngle} 16 16)`}
        />
        <circle cx="16" cy="16" r="1" fill="currentColor" stroke="none" />
      </svg>

      <span className={STAMP_LINES_CLASS}>
        <span suppressHydrationWarning>{offset}</span>
        <time
          suppressHydrationWarning
          dateTime={iso}
          aria-label={`Current local time in ${place}: ${label}`}
        >
          {label}
        </time>
      </span>
    </div>
  )
}

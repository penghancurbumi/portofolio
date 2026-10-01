"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { useTranslation } from "@/lib/i18n/use-translation"

export interface AsciiFooterBannerProps {
  className?: string
}

export function AsciiFooterBanner({ className = "" }: AsciiFooterBannerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const { l } = useTranslation()
  const pathname = usePathname()

  // Runs on every mount. The banner is dropped on `/terminal` (it early-returns
  // `null`), so navigating in and out of that route unmounts and remounts this
  // component - the effect below runs again on the fresh instance.
  useEffect(() => {
    const container = containerRef.current
    const video = videoRef.current
    if (!container || !video) return

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (reducedMotion) {
      // The clip holds its first frame as a still. `onLoadedData` (bound on the
      // element) flips `isPlaying`, so the still is visible without the effect
      // touching state synchronously - which React warns about.
      return
    }

    let isIntersecting = false

    const tryPlay = () => {
      // `play()` rejects while the element is detached or the tab is hidden;
      // swallow it, the observer fires again on the next change.
      video.play().catch(() => { })
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry?.isIntersecting ?? false
        if (isIntersecting && !document.hidden) {
          tryPlay()
        } else {
          video.pause()
        }
      },
      { threshold: 0.05, rootMargin: "400px 0px" }
    )

    observer.observe(container)

    // The observer only fires on a *change* of intersection. If the banner is
    // already in view when this effect mounts (a client-side navigation keeps
    // the scroll position), no change ever arrives and the clip would never
    // start. Kick it once explicitly after the observer is attached.
    if (!document.hidden) {
      tryPlay()
    }

    const handleVisibility = () => {
      if (document.hidden) {
        video.pause()
      } else if (isIntersecting) {
        tryPlay()
      }
    }

    document.addEventListener("visibilitychange", handleVisibility)

    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [])

  // The full-screen chat view owns the terminal aesthetic; the banner's
  // editorial text would collide with it, so the banner is dropped there.
  if (pathname === "/terminal") return null

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Footer banner"
      className={`relative min-h-[195px] w-full overflow-hidden border-b border-line bg-card select-none sm:min-h-[250px] ${className}`}
    >
      {/* Looped Video */}
      {/* No `autoPlay`: it defeated `preload="none"` and pulled the clip during
          initial load even though the banner sits below the fold. The observer
          below starts it when it actually scrolls into view.

          Visibility is keyed off `isPlaying`, which is set from BOTH
          `onPlaying` and `onLoadedData`. `onPlaying` alone is not enough: when
          the clip is already buffered (a re-mount after navigating away and
          back) the browser may serve it without firing `playing` again, leaving
          the element stuck at `opacity-0` - i.e. invisible.

          Opacity is dialled down in light mode: the clip is dark, so on a white
          card it needs to sit far back to keep the editorial text legible. */}
      <video
        ref={videoRef}
        src="/background-footers.mp4"
        loop
        muted
        playsInline
        preload="metadata"
        aria-hidden="true"
        onPlaying={() => setIsPlaying(true)}
        onLoadedData={() => setIsPlaying(true)}
        onEmptied={() => setIsPlaying(false)}
        className={`absolute inset-0 size-full object-cover object-bottom transition-opacity duration-500 ${isPlaying ? "opacity-30 dark:opacity-40" : "opacity-0"
          }`}
      />

      {/* Inset shadow frame - black in dark mode, a light ink wash in light mode
          so the frame does not read as a dirty smudge on the white card. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-5 shadow-[inset_0_0_24px_rgba(0,0,0,0.12),inset_0_1px_3px_rgba(0,0,0,0.08),inset_0_-1px_3px_rgba(0,0,0,0.08)] dark:shadow-[inset_0_0_24px_rgba(0,0,0,0.45),inset_0_1px_3px_rgba(0,0,0,0.3),inset_0_-1px_3px_rgba(0,0,0,0.3)]"
      />

      {/* Editorial Content - Perfectly centered vertically (50% / 50%) */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-5 py-6 sm:px-8">
        <div className="max-w-lg sm:max-w-xl">
          {/* Headline */}
          <h2 className="font-pixel text-lg leading-snug font-bold tracking-tight text-zinc-950 sm:text-2xl sm:leading-tight sm:whitespace-nowrap dark:text-white">
            {l(
              "Turning ideas into working software.",
              "Membangun masa depan dengan data, AI, dan kode."
            )}
          </h2>

          {/* Description */}
          <p className="font-pixel mt-1.5 max-w-sm text-xs leading-relaxed text-zinc-700 sm:mt-2 sm:max-w-lg sm:text-sm dark:text-white/85">
            {l(
              "Exploring, building, and learning through real-world projects.",
              "Mengeksplorasi, membangun, dan belajar melalui proyek nyata."
            )}
          </p>

          {/* CTA Button */}
          <div className="mt-3.5 sm:mt-4.5">
            <a
              href="https://wa.me/6287816001844"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-7 shrink-0 items-center justify-center rounded-[min(var(--radius-lg),10px)] bg-zinc-950 px-3 font-pixel text-xs font-medium tracking-wide text-white shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-950/90 hover:shadow-md focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:outline-none active:translate-y-0 active:scale-[0.98] sm:h-8 sm:px-3.5 sm:text-sm dark:bg-white dark:text-zinc-950 dark:hover:bg-white/90 dark:focus-visible:ring-white"
            >
              <span>{l("Get in touch", "Hubungi Saya")}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

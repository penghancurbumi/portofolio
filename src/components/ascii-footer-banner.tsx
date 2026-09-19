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

  useEffect(() => {
    const container = containerRef.current
    const video = videoRef.current
    if (!container || !video) return

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (reducedMotion) return

    let isIntersecting = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry?.isIntersecting ?? false
        if (isIntersecting && !document.hidden) {
          video.play().catch(() => { })
        } else {
          video.pause()
        }
      },
      { threshold: 0.05, rootMargin: "400px 0px" }
    )

    observer.observe(container)

    const handleVisibility = () => {
      if (document.hidden) {
        video.pause()
      } else if (isIntersecting) {
        video.play().catch(() => { })
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
      aria-label="Footer ASCII landscape banner"
      className={`relative min-h-[195px] w-full overflow-hidden border-b border-line bg-card select-none sm:min-h-[250px] ${className}`}
    >
      {/* Looped Video */}
      {/* No `autoPlay`: it defeated `preload="none"` and pulled the clip during
          initial load even though the banner sits below the fold. The observer
          below starts it when it actually scrolls into view. */}
      <video
        ref={videoRef}
        src="/ascii-footer.mp4"
        loop
        muted
        playsInline
        preload="none"
        aria-hidden="true"
        onPlaying={() => setIsPlaying(true)}
        className={`absolute inset-0 size-full object-cover object-bottom transition-opacity duration-500 ${isPlaying ? "opacity-100" : "opacity-0"
          }`}
      />

      {/* Subtle Inset Black Shadow Frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-5 shadow-[inset_0_0_24px_rgba(0,0,0,0.45),inset_0_1px_3px_rgba(0,0,0,0.3),inset_0_-1px_3px_rgba(0,0,0,0.3)]"
      />

      {/* Editorial Content - Perfectly centered vertically (50% / 50%) */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center px-5 sm:px-8">
        <div className="max-w-lg sm:max-w-xl">
          {/* Headline */}
          <h2 className="font-pixel text-lg leading-snug font-bold tracking-tight text-white sm:text-2xl sm:leading-tight sm:whitespace-nowrap">
            {l(
              "Turning ideas into working software.",
              "Membangun masa depan dengan data, AI, dan kode."
            )}
          </h2>

          {/* Description */}
          <p className="font-pixel mt-1.5 max-w-sm text-xs leading-relaxed text-white/85 sm:mt-2 sm:max-w-lg sm:text-sm">
            {l(
              "Exploring, building, and learning through real-world projects.",
              "Mengeksplorasi, membangun, dan belajar melalui proyek nyata."
            )}
          </p>

          {/* CTA Button */}
          <div className="mt-3.5 sm:mt-4.5">
            <a
              href="https://wa.me/6285155487647"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-7 shrink-0 items-center justify-center rounded-[min(var(--radius-lg),10px)] bg-white px-3 font-pixel text-xs font-medium tracking-wide text-zinc-950 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-md focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none active:translate-y-0 active:scale-[0.98] sm:h-8 sm:px-3.5 sm:text-sm"
            >
              <span>{l("Get in touch", "Hubungi Saya")}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

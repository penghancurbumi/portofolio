"use client"

import { useEffect, useRef, useState } from "react"

export interface AsciiBannerProps {
  src?: string
  alt?: string
  className?: string
  scanlines?: boolean
}

export function AsciiBanner({
  src = "/ascii-animation.mp4",
  alt = "Profile Banner",
  className = "",
  scanlines = true,
}: AsciiBannerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    const video = videoRef.current
    if (!container || !video) return

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (reducedMotion) return

    let isIntersecting = true

    video.play().catch(() => { })

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry?.isIntersecting ?? false
        if (isIntersecting && !document.hidden) {
          video.play().catch(() => { })
        } else {
          video.pause()
        }
      },
      { threshold: 0.05, rootMargin: "200px 0px" }
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
  }, [src])

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={alt}
      className={`relative size-full overflow-hidden bg-black select-none ${className}`}
    >
      {/* 1. Looped Video Banner */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        onPlaying={() => setIsPlaying(true)}
        className={`absolute inset-0 size-full object-cover object-center transition-opacity duration-300 ${isPlaying ? "opacity-100" : "opacity-0"
          }`}
      />

      {/* 2. CRT Scanlines Overlay */}
      {scanlines && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.35)_51%)] bg-[length:100%_3px] opacity-30 mix-blend-overlay"
        />
      )}

      {/* 3. Inset Shadow Frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-5 shadow-[inset_0_0_24px_rgba(0,0,0,0.4),inset_0_1px_3px_rgba(0,0,0,0.3),inset_0_-1px_3px_rgba(0,0,0,0.3)]"
      />
    </div>
  )
}

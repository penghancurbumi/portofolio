"use client"

import { useEffect, useRef } from "react"

export interface VideoBackgroundProps {
  className?: string
  src?: string
  poster?: string
}

export function VideoBackground({
  className = "",
  src = "/background-portofolio.mp4",
  poster,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Respect the user's motion preference: hold the first frame as a still.
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (reducedMotion) {
      video.pause()
      return
    }

    // Autoplay can be rejected before user interaction on some browsers.
    const playPromise = video.play()
    playPromise?.catch(() => {
      // Silent: the poster/first frame stays visible.
    })
  }, [])

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none ${className}`}
    >
      {/* The clip is a dark, moody loop: at full strength on the light theme it
          reads as a black page behind white cards. Opacity is dialled way down
          in light mode so the `--background` tint shows through, then dark:*
          restores the original full-strength look. */}
      <video
        ref={videoRef}
        className="size-full object-cover opacity-60 dark:opacity-100"
        src={src}
        poster={poster}
        autoPlay
        loop
        muted
        playsInline
        // `metadata` instead of `auto`: the clip is ~24 MB, and `auto` pulled
        // the whole thing down on initial load, competing with the LCP banner.
        // This still lets the poster/first frame appear and playback start,
        // while the rest streams in as it is needed.
        preload="metadata"
        disablePictureInPicture
      />

      {/* A white wash over the video in light mode only. Together with the low
          video opacity it flattens the clip to a faint, even tint instead of a
          dark image competing with the foreground. Removed entirely in dark
          mode so the original contrast is untouched. */}
      <div className="absolute inset-0 bg-background/80 dark:hidden" />
    </div>
  )
}

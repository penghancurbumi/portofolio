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
      <video
        ref={videoRef}
        className="size-full object-cover"
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
    </div>
  )
}

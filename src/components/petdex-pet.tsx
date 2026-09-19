"use client"

import { useEffect, useRef, useState } from "react"

const COLS = 8
const ROWS = 9
const ROW_IDLE = 0
const ROW_RIGHT = 1
const ROW_LEFT = 2
const ROW_WAVING = 3
const ROW_FAILED = 5

const SPEED = 46 // px / second
const FRAME_MS = 140
const TURNS_BEFORE_REST = 2 // bolak-balik sebelum "capek" -> failed (sad)
const REST_MS = 3200 // durasi animasi failed/istirahat
const WAVE_MS_MIN = 1600
const WAVE_MS_MAX = 2800
const WAVE_CHANCE = 0.0016 // peluang melambai tiap frame saat berjalan
// Guards so a walk stretch can never run forever without resting. If the pet
// hasn't turned (and thus can't reach the turn-based sad trigger) within this
// window, it goes sad anyway. Without this the "sad" state could stay hidden
// for minutes on a wide screen where turns are rare.
const MAX_WALK_MS = 9000

type Props = {
  src?: string
  size?: number
  slug?: string
  /** Fall speed in px/second. */
  speed?: number
  /** Milliseconds of walking before the pet is guaranteed to rest (sad). */
  maxWalkMs?: number
  /** How long the sad/rest state lasts, in milliseconds. */
  restMs?: number
}

export function PetdexPet({
  src = "/pets/prabowo-2.webp",
  size = 84,
  slug = "Prabowo",
  speed = SPEED,
  maxWalkMs = MAX_WALK_MS,
  restMs = REST_MS,
}: Props) {
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null)
  const framesRef = useRef<number[]>(new Array(ROWS).fill(4))

  const boxRef = useRef<HTMLDivElement>(null)
  const xRef = useRef(0)
  const dirRef = useRef<1 | -1>(1)
  const rowRef = useRef(ROW_IDLE)
  const frameRef = useRef(0)
  const modeRef = useRef<"walk" | "wave" | "failed">("walk")
  const turnsRef = useRef(0)
  const untilRef = useRef(0)
  // Tracks how long the current walk stretch has lasted, so the pet is forced
  // into the sad/rest state when it can't reach the turn-based trigger.
  const walkStartRef = useRef(0)

  // Load the sprite sheet, measure the per-state frame count by scanning alpha.
  useEffect(() => {
    const img = new window.Image()
    img.decoding = "async"
    img.onload = () => {
      const fw = img.naturalWidth / COLS
      const fh = img.naturalHeight / ROWS
      setDims({ w: size * (fw / fh), h: size })

      try {
        const canvas = document.createElement("canvas")
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.drawImage(img, 0, 0)
          const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const counts: number[] = []
          for (let r = 0; r < ROWS; r++) {
            let used = 0
            for (let c = 0; c < COLS; c++) {
              let filled = false
              for (let y = 0; y < fh && !filled; y += 4) {
                for (let x = 0; x < fw && !filled; x += 4) {
                  const px =
                    (Math.floor(r * fh + y) * canvas.width +
                      Math.floor(c * fw + x)) *
                    4
                  if (data[px + 3] > 12) filled = true
                }
              }
              if (filled) used = c + 1
            }
            counts.push(Math.max(1, used))
          }
          framesRef.current = counts
        }
      } catch {
        // tainted canvas / unsupported - fall back to the default counts
      }
    }
    img.src = src
  }, [src, size])

  // Walk loop.
  useEffect(() => {
    if (!dims) return
    const el = boxRef.current
    if (!el) return

    let vw = window.innerWidth
    const onResize = () => {
      vw = window.innerWidth
    }
    window.addEventListener("resize", onResize)
    xRef.current = Math.max(0, vw * 0.12)

    let raf = 0
    let last = performance.now()
    let frameAcc = 0
    walkStartRef.current = last

    const tick = (now: number) => {
      const dt = now - last
      last = now

      if (modeRef.current === "walk") {
        xRef.current += dirRef.current * speed * (dt / 1000)
        let turned = false
        if (xRef.current + dims.w >= vw) {
          xRef.current = vw - dims.w
          dirRef.current = -1
          turned = true
        } else if (xRef.current <= 0) {
          xRef.current = 0
          dirRef.current = 1
          turned = true
        }

        const walkedFor = now - walkStartRef.current
        if (turned) {
          turnsRef.current += 1
          if (turnsRef.current >= TURNS_BEFORE_REST) {
            turnsRef.current = 0
            modeRef.current = "failed"
            untilRef.current = now + restMs
          }
        } else if (
          // Guarantee a rest even when the pet never reaches a wall.
          walkedFor >= maxWalkMs ||
          Math.random() < WAVE_CHANCE
        ) {
          if (walkedFor >= maxWalkMs) {
            turnsRef.current = 0
            modeRef.current = "failed"
            untilRef.current = now + restMs
          } else {
            modeRef.current = "wave"
            untilRef.current =
              now + WAVE_MS_MIN + Math.random() * (WAVE_MS_MAX - WAVE_MS_MIN)
          }
        }
      } else if (now >= untilRef.current) {
        modeRef.current = "walk"
        walkStartRef.current = now
      }

      const active = modeRef.current
      const targetRow =
        active === "walk"
          ? dirRef.current === 1
            ? ROW_RIGHT
            : ROW_LEFT
          : active === "wave"
            ? ROW_WAVING
            : ROW_FAILED
      if (targetRow !== rowRef.current) {
        rowRef.current = targetRow
        frameRef.current = 0
        frameAcc = 0
      }

      frameAcc += dt
      const total = dims.w * COLS
      const totalH = dims.h * ROWS
      if (frameAcc >= FRAME_MS) {
        frameAcc = 0
        const count = framesRef.current[rowRef.current] || 1
        frameRef.current = (frameRef.current + 1) % count
      }

      el.style.width = `${dims.w}px`
      el.style.height = `${dims.h}px`
      el.style.backgroundImage = `url("${src}")`
      el.style.backgroundSize = `${total}px ${totalH}px`
      el.style.backgroundPosition = `-${frameRef.current * dims.w}px -${rowRef.current * dims.h}px`
      el.style.transform = `translate3d(${Math.round(xRef.current)}px, 0, 0)`

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
    }
  }, [dims, src, speed, maxWalkMs, restMs])

  if (!dims) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-0 left-0 z-20 select-none"
    >
      <div ref={boxRef} style={{ imageRendering: "pixelated", willChange: "transform" }} title={slug} />
    </div>
  )
}

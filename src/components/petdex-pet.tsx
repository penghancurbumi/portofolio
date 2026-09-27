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
// "Capek" dipicu setelah 2 kali pulang-pergi penuh. Satu putaran penuh =
// menyusuri layar kiri->kanan->kiri, artinya menyentuh dinding 2 kali
// (kanan lalu kiri). Jadi 2 putaran penuh = 4 kali sentuh dinding.
const TURNS_BEFORE_REST = 4 // sentuhan dinding sebelum "capek" -> failed (sad)
const REST_MS = 3200 // durasi animasi failed/istirahat
const WAVE_MS = 2800 // durasi animasi melambai (wave)

type Props = {
  src?: string
  size?: number
  slug?: string
  /** Fall speed in px/second. */
  speed?: number
  /** How long the sad/rest state lasts, in milliseconds. */
  restMs?: number
}

export function PetdexPet({
  src = "/pets/prabowo-2.webp",
  size = 84,
  slug = "Prabowo",
  speed = SPEED,
  restMs = REST_MS,
}: Props) {
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null)
  const [isWaving, setIsWaving] = useState(false)
  const [bubbleFlipped, setBubbleFlipped] = useState(false)
  const isWavingRef = useRef(false)
  const bubbleFlippedRef = useRef(false)
  const framesRef = useRef<number[]>(new Array(ROWS).fill(4))

  const boxRef = useRef<HTMLDivElement>(null)
  const bubbleContainerRef = useRef<HTMLDivElement>(null)
  const xRef = useRef(0)
  const dirRef = useRef<1 | -1>(1)
  const rowRef = useRef(ROW_IDLE)
  const frameRef = useRef(0)
  const modeRef = useRef<"walk" | "wave" | "failed" | "idle">("walk")
  const hoverRef = useRef(false)
  const turnsRef = useRef(0)
  const untilRef = useRef(0)

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

    const tick = (now: number) => {
      const dt = now - last
      last = now

      // Saat cursor mengarah ke petdex, pet berhenti dan menampilkan animasi
      // idle. Ini hanya berlaku saat pet sedang berjalan - kalau sedang
      // "failed" (capek) atau "wave" (melambai), animasi itu diselesaikan
      // dulu sebelum idle. Begitu cursor pergi, pet lanjut berjalan.
      if (modeRef.current === "walk" && hoverRef.current) {
        modeRef.current = "idle"
      } else if (modeRef.current === "idle" && !hoverRef.current) {
        modeRef.current = "walk"
      }

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

        if (turned) {
          turnsRef.current += 1
          if (turnsRef.current >= TURNS_BEFORE_REST) {
            turnsRef.current = 0
            modeRef.current = "failed"
            untilRef.current = now + restMs
          } else {
            // Setiap kali pet menyentuh ujung dinding (dan belum waktunya
            // capek), pet melambai (wave) satu kali.
            modeRef.current = "wave"
            untilRef.current = now + WAVE_MS
          }
        }
      } else if (modeRef.current === "failed" || modeRef.current === "wave") {
        if (now >= untilRef.current) {
          modeRef.current = "walk"
        }
      }

      const active = modeRef.current
      const isWaveNow = active === "wave"
      if (isWaveNow !== isWavingRef.current) {
        isWavingRef.current = isWaveNow
        setIsWaving(isWaveNow)
      }

      // Saat pet berada di ujung kanan desktop, bubble normal akan terpotong.
      // Bubble di-offset 32px ke kanan (left-8) dan lebarnya 178px, jadi perlu
      // ruang ~210px di kanan pet. Bila tidak cukup, pakai bubble-reverse yang
      // diposisikan di sisi kiri pet agar tidak terpotong/tertutup.
      const bubbleWidth = 178
      const bubbleOffset = 32
      const shouldFlip = xRef.current + dims.w + bubbleWidth + bubbleOffset > vw
      if (shouldFlip !== bubbleFlippedRef.current) {
        bubbleFlippedRef.current = shouldFlip
        setBubbleFlipped(shouldFlip)
      }

      const targetRow =
        active === "walk"
          ? dirRef.current === 1
            ? ROW_RIGHT
            : ROW_LEFT
          : active === "wave"
            ? ROW_WAVING
            : active === "idle"
              ? ROW_IDLE
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
  }, [dims, src, speed, restMs])

  if (!dims) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-0 left-0 z-20 select-none"
    >
      <div
        ref={boxRef}
        onMouseEnter={() => {
          hoverRef.current = true
        }}
        onMouseLeave={() => {
          hoverRef.current = false
        }}
        className="relative pointer-events-auto"
        style={{ imageRendering: "pixelated", willChange: "transform" }}
        title={`${slug}`}
      >
        {/* Speech Bubble when waving */}
        <div
          ref={bubbleContainerRef}
          className={`absolute -top-[102px] pointer-events-none ${
            bubbleFlipped ? "right-8" : "left-8"
          }`}
          style={{ zIndex: 50 }}
        >
          <div
            className={`w-[178px] h-[105px] relative transition-all duration-300 ${
              bubbleFlipped ? "origin-bottom-right" : "origin-bottom-left"
            } ${isWaving
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-75 translate-y-2 pointer-events-none"
              }`}
          >
            <img
              src={bubbleFlipped ? "/pets/bubble-reverse.png" : "/pets/bubble.png"}
              alt="Speech bubble"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              style={{ imageRendering: "pixelated" }}
            />
            <div
              className="absolute inset-0 flex items-center justify-center text-center font-bold"
              style={{
                fontFamily:
                  'var(--font-pixel), "PixelifySans", "Pixelify Sans", monospace',
                paddingTop: "6px",
                paddingBottom: "24px",
                paddingLeft: "14px",
                paddingRight: "14px",
                fontSize: "14px",
                lineHeight: "1.2",
                color: "#ffffff",
                WebkitTextStroke: "0",
                textShadow: `
                      -2px -2px 0 #000,
                      0px -2px 0 #000,
                      2px -2px 0 #000,
                      -2px  0px 0 #000,
                      2px  0px 0 #000,
                      -2px  2px 0 #000,
                      0px  2px 0 #000,
                      2px  2px 0 #000
                `,
              }}
            >
              Hei Antek-Antek AI!!
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Slot } from "@radix-ui/react-slot"
import React from "react"

import { cn } from "@/lib/utils"

function Panel({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="panel"
      className={cn(
        "relative z-1 -mt-px border border-line bg-card max-md:border-x-0",
        className
      )}
      {...props}
    >
      {props.children}
    </section>
  )
}

function PanelHeader({ className, children, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-slot="panel-header"
      className={cn(
        "relative flex items-stretch border-b border-line overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Left Hatch Accent with Crosshair */}
      <div
        className="relative w-8 shrink-0 border-r border-line/80 bg-[repeating-linear-gradient(-45deg,transparent,transparent_2px,var(--panel-hatch)_2px,var(--panel-hatch)_4px)] max-sm:w-5"
        aria-hidden
      >
        <span className="pointer-events-none absolute -top-1 -right-1 z-10 font-mono text-[15px] leading-none text-foreground/50 select-none">
          +
        </span>
        <span className="pointer-events-none absolute -bottom-1 -right-1 z-10 font-mono text-[15px] leading-none text-foreground/50 select-none">
          +
        </span>
      </div>

      {/* Center Content Area */}
      <div className="relative flex flex-1 items-center justify-between min-w-0 py-3 px-4 sm:py-4 sm:px-6">
        {/* Horizontal center guideline */}
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 h-[1px] -translate-y-1/2 bg-foreground/10"
          aria-hidden
        />

        {/* Header Children (Title, Sup, Actions) */}
        <div className="relative z-1 flex w-full items-center justify-between gap-3">
          {children}
        </div>
      </div>

      {/* Right Hatch Accent with Crosshair */}
      <div
        className="relative w-8 shrink-0 border-l border-line/80 bg-[repeating-linear-gradient(-45deg,transparent,transparent_2px,var(--panel-hatch)_2px,var(--panel-hatch)_4px)] max-sm:w-5"
        aria-hidden
      >
        <span className="pointer-events-none absolute -top-1 -left-1 z-10 font-mono text-[15px] leading-none text-foreground/50 select-none">
          +
        </span>
        <span className="pointer-events-none absolute -bottom-1 -left-1 z-10 font-mono text-[15px] leading-none text-foreground/50 select-none">
          +
        </span>
      </div>
    </header>
  )
}

function PanelTitle({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"h2"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "h2"

  return (
    <Comp
      data-slot="panel-title"
      className={cn(
        "font-ibm-plex-mono text-2xl tracking-tight text-foreground sm:text-3xl",
        className
      )}
      {...props}
    />
  )
}

function PanelTitleSup({ className, ...props }: React.ComponentProps<"sup">) {
  return (
    <sup
      className={cn(
        "top-[-0.75em] ml-1.5 font-mono text-xs font-medium tracking-normal text-foreground/50",
        className
      )}
      {...props}
    />
  )
}

function PanelDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-description"
      className={cn(
        "px-6 py-4 text-base text-balance text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function PanelContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="panel-body" className={cn("p-4", className)} {...props} />
  )
}

export {
  Panel,
  PanelContent,
  PanelDescription,
  PanelHeader,
  PanelTitle,
  PanelTitleSup,
}

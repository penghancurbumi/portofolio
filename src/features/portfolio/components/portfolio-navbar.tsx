"use client"

import { Icon } from "@iconify/react"
import {
  CaretDown,
  GearSix,
  Monitor,
  Moon,
  Sun,
} from "@phosphor-icons/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useRef, useState } from "react"

import { useLanguagePreference } from "@/hooks/use-language-preference"
import { useTranslation } from "@/lib/i18n/use-translation"
import { cn } from "@/lib/utils"

type IconProps = {
  className?: string
  active?: boolean
}

/* Refined Duotone SVG Icons with subtle translucent fills adaptive to light & dark mode + micro-animations */
function IconHome({ className, active = false }: IconProps) {
  return (
    <Icon
      icon="boxicons:home-alt-3"
      className={cn(
        "transition-transform duration-300 ease-out group-hover:scale-105",
        active && "opacity-90",
        className
      )}
    />
  )
}

function IconProjects({ className, active = false }: IconProps) {
  return (
    <Icon
      icon="ant-design:folder-open-filled"
      className={cn(
        "transition-transform duration-300 ease-out group-hover:scale-105",
        active && "opacity-90",
        className
      )}
    />
  )
}

function IconBlog({ className, active = false }: IconProps) {
  return (
    <Icon
      icon="ic:outline-article"
      className={cn(
        "transition-transform duration-300 ease-out group-hover:scale-105",
        active && "opacity-90",
        className
      )}
    />
  )
}

function IconGallery({ className, active = false }: IconProps) {
  return (
    <Icon
      icon="boxicons:image"
      className={cn(
        "transition-transform duration-300 ease-out group-hover:scale-105",
        active && "opacity-90",
        className
      )}
    />
  )
}

function IconChat({ className, active = false }: IconProps) {
  return (
    <Icon
      icon="garden:terminal-cli-stroke-12"
      className={cn(
        "transition-transform duration-300 ease-out group-hover:scale-105",
        active && "opacity-90",
        className
      )}
    />
  )
}

export function PortfolioNavbar({ className }: { className?: string }) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage } = useLanguagePreference()
  const { t } = useTranslation()
  const [settingsOpen, setSettingsOpen] = useState(false)

  const settingsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!settingsOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null
      if (target?.closest?.("[data-settings-trigger]")) return
      if (!settingsRef.current?.contains(target)) setSettingsOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSettingsOpen(false)
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [settingsOpen])

  const handleLinkClick = () => {
    setSettingsOpen(false)
  }

  const items = [
    {
      id: "home",
      label: t.nav.home,
      href: "/",
      icon: IconHome,
      type: "link" as const,
    },
    {
      id: "projects",
      label: t.nav.projects,
      href: "/projects",
      icon: IconProjects,
      type: "link" as const,
    },
    {
      id: "blog",
      label: t.nav.blog,
      href: "/blog",
      icon: IconBlog,
      type: "link" as const,
    },
    {
      id: "gallery",
      label: t.nav.gallery,
      href: "/gallery",
      icon: IconGallery,
      type: "link" as const,
    },
    {
      id: "terminal",
      label: t.nav.chat,
      href: "/terminal",
      icon: IconChat,
      type: "link" as const,
    },
    {
      id: "settings",
      label: t.nav.settings,
      icon: GearSix,
      type: "action" as const,
      onClick: () => {
        setSettingsOpen((open) => !open)
      },
    },
  ]

  const activeItemIndex = items.findIndex(
    (item) =>
      item.type === "link" &&
      (item.href === "/" ? pathname === "/" : pathname.startsWith(item.href))
  )

  return (
    <nav
      className={cn(
        "relative sticky top-0 z-40 -mt-px border border-line bg-card/95 backdrop-blur-md max-md:border-x-0",
        className
      )}
      aria-label="Main Navigation"
    >
      <div className="relative grid h-full w-full grid-cols-6">
        {items.map((item) => {
          const isActive =
            item.type === "link" &&
            (item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href))
          const Icon = item.icon

          if (item.type === "link") {
            return (
              <Link
                key={item.id}
                href={item.href}
                aria-label={item.label}
                aria-current={isActive ? "page" : undefined}
                data-active={isActive || undefined}
                onClick={handleLinkClick}
                className={cn(
                  "group relative flex h-full min-w-0 cursor-pointer items-center justify-center gap-1.5 px-2 text-xs font-medium transition-colors duration-200 select-none focus-visible:z-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset sm:text-sm",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon
                  active={isActive}
                  className="size-4 shrink-0 transition-colors duration-200 sm:size-4.5"
                />
                <span
                  className={cn(
                    "hidden max-w-24 overflow-hidden font-sans whitespace-nowrap transition-[opacity,max-width] duration-200 ease-out sm:block",
                    isActive ? "opacity-100" : "max-w-0 opacity-0"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            )
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              data-settings-trigger={item.id === "settings" || undefined}
              aria-expanded={item.id === "settings" ? settingsOpen : undefined}
              aria-haspopup={item.id === "settings" ? "dialog" : undefined}
              title={item.label}
              aria-label={item.label}
              className={cn(
                "group relative flex h-full min-w-0 cursor-pointer items-center justify-center gap-1.5 px-2 text-xs font-medium text-muted-foreground transition-colors duration-200 select-none hover:text-foreground focus-visible:z-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset sm:text-sm",
                item.id === "settings" && settingsOpen && "text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "size-4 shrink-0 transition-transform duration-300 ease-out sm:size-4.5",
                  item.id === "settings" &&
                  (settingsOpen
                    ? "rotate-180 duration-500"
                    : "duration-500 group-hover:rotate-90")
                )}
              />
              <span
                className={cn(
                  "hidden max-w-24 overflow-hidden font-sans whitespace-nowrap transition-[opacity,max-width] duration-200 ease-out sm:block",
                  item.id === "settings" && settingsOpen
                    ? "opacity-100"
                    : "max-w-0 opacity-0"
                )}
              >
                {item.label}
              </span>
              {item.id === "settings" && (
                <CaretDown
                  className={cn(
                    "hidden size-3 shrink-0 transition-transform duration-200 sm:block",
                    settingsOpen && "rotate-180"
                  )}
                  weight="bold"
                  aria-hidden
                />
              )}
            </button>
          )
        })}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/6 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            opacity: activeItemIndex >= 0 ? 1 : 0,
            transform: `translate3d(${Math.max(activeItemIndex, 0) * 100}%, 0, 0)`,
          }}
        >
          <span
            className="absolute bottom-0 h-0.5 bg-foreground"
            style={{ insetInline: "min(1rem, 20%)" }}
          />
        </span>
      </div>

      {settingsOpen && (
        <div
          ref={settingsRef}
          role="dialog"
          aria-label="Settings"
          className="absolute top-[calc(100%+0.75rem)] right-3 z-50 w-72 rounded-2xl border border-line bg-card p-3 shadow-xl sm:right-6"
        >
          <span
            aria-hidden
            className="absolute -top-1.5 right-7 size-3 rotate-45 border-t border-l border-line bg-card"
          />
          <div className="relative space-y-3">
            <SettingsRow label={t.settings.language}>
              <SettingsOption
                label={t.settings.english}
                pressed={language === "en"}
                onClick={() => setLanguage("en")}
              >
                <span className="text-[10px] font-semibold">EN</span>
              </SettingsOption>
              <SettingsOption
                label={t.settings.indonesian}
                pressed={language === "id"}
                onClick={() => setLanguage("id")}
              >
                <span className="text-[10px] font-semibold">ID</span>
              </SettingsOption>
            </SettingsRow>

            <SettingsRow label={t.settings.theme}>
              <SettingsOption
                label={t.settings.light}
                pressed={theme === "light"}
                onClick={() => setTheme("light")}
              >
                <Sun size={16} weight="duotone" aria-hidden />
              </SettingsOption>
              <SettingsOption
                label={t.settings.system}
                pressed={theme === "system"}
                onClick={() => setTheme("system")}
              >
                <Monitor size={16} weight="duotone" aria-hidden />
              </SettingsOption>
              <SettingsOption
                label={t.settings.dark}
                pressed={theme === "dark"}
                onClick={() => setTheme("dark")}
              >
                <Moon size={16} weight="duotone" aria-hidden />
              </SettingsOption>
            </SettingsRow>
          </div>
        </div>
      )}
    </nav>
  )
}

function SettingsRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs font-medium text-foreground">{label}</span>
      <div className="flex items-center gap-1 rounded-xl bg-muted p-1">
        {children}
      </div>
    </div>
  )
}

function SettingsOption({
  label,
  pressed,
  onClick,
  children,
}: {
  label: string
  pressed: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        pressed && "bg-card text-foreground shadow-sm"
      )}
    >
      {children}
    </button>
  )
}

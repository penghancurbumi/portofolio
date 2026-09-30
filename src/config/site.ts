import { USER } from "@/features/portfolio/data/user"
import type { NavItem } from "@/types/nav"

const DEFAULT_SITE_URL = "https://www.alfakhrza.dev"

function normalizeSiteUrl(value?: string) {
  if (!value) return DEFAULT_SITE_URL

  const url = value.startsWith("http") ? value : `https://${value}`
  return url.replace(/\/+$/, "")
}

export const SITE_INFO = {
  name: USER.displayName,
  url: normalizeSiteUrl(process.env.APP_URL),
  ogImage: USER.ogImage,
  description: USER.seoDescription ?? USER.bio,
  keywords: USER.keywords,
}

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#000000",
}

export const MAIN_NAV: NavItem[] = [
  {
    title: "Projects",
    href: "/projects",
  },
  {
    title: "Blog",
    href: "/blog",
  },
  {
    title: "Gallery",
    href: "/gallery",
  },
  {
    title: "Terminal",
    href: "/terminal",
  },
]

export const GITHUB_USERNAME = "penghancurbumi"
export const GITHUB_REPO = "penghancurbumi"
export const GITHUB_REPO_URL = `https://github.com/${GITHUB_REPO}`

/** Appended as `?utm_source=...` to outbound links so visits can be attributed. */
export const UTM_PARAMS = {
  utm_source: "alfakhrza",
}

import { AsciiFooterBanner } from "@/components/ascii-footer-banner"
import { FooterIndexList, FooterLabel } from "@/components/footer-chrome"
import { FooterClock } from "@/components/footer-clock"
import { FooterContactList } from "@/components/footer-contact-list"
import { MAIN_NAV } from "@/config/site"
import { getGitHubSocialCard } from "@/features/portfolio/data/github-social"
import { USER } from "@/features/portfolio/data/user"
import { brailleText } from "@/lib/braille"

/**
 * Swiss editorial footer, after cali.so: the left cell is the colophon -
 * copyright, printer's mark, and the two location stamps - followed by the
 * contact and index columns.
 *
 * All footer styling lives in this file as plain Tailwind classes (previously
 * `@utility footer-*` rules in globals.css) so the footer can be edited in one
 * place.
 */

const INDEX_LINKS = [{ title: "Home", href: "/" }, ...MAIN_NAV]

// Directory column: rows are uniformly tall so the two columns line up.
const TREE_CLASS =
  "[&_ul]:flex [&_ul]:flex-col [&_li]:flex [&_li]:min-h-7 [&_li]:items-center [&_li]:font-ibm-plex-mono [&_li]:text-[1.1rem] [&_li]:tracking-wide [&_li>*]:min-w-0 [&_li>*]:flex-1"

const LABEL_CLASS =
  "mb-1.5 font-ibm-plex-mono text-[12px] tracking-[0.18em] text-muted-foreground/75 uppercase select-none"

const BRAILLE_CLASS =
  "mt-1 font-ibm-plex-mono text-[12px] leading-none tracking-[0.15em] text-muted-foreground"

// Clock and geo lines share one stamp shape: a small dial or globe, then a
// two-line monospaced readout.
const STAMP_CLASS =
  "flex min-h-5.5 items-center gap-2 font-ibm-plex-mono text-[12px] leading-none tracking-wide text-muted-foreground/88 tabular-nums"

// 72% landed on 4.45:1 against the dark card - just under WCAG AA. 78% clears
// it at 5.1:1 and is the same muted grey to the eye; the time line sits at 90%.
const STAMP_LINES_CLASS =
  "flex flex-col gap-px font-ibm-plex-mono text-[12px] tracking-wide [&>span]:tracking-[0.08em] [&>span]:text-muted-foreground/78 [&>span:last-child:not(:first-child)]:block [&>span:last-child:not(:first-child)]:min-w-[8ch] [&>span:last-child:not(:first-child)]:tracking-[0.02em] [&>span:last-child:not(:first-child)]:whitespace-nowrap [&>span:last-child:not(:first-child)]:text-muted-foreground/90"

export async function SiteFooter() {
  // Baked at build time on the statically prerendered routes, which is why it
  // is read here rather than in a client component: a year resolved in the
  // browser would not match the prerendered HTML.
  const year = new Date().getFullYear()

  // Both calls behind it are cached for a day and swallow their own failures,
  // so a slow or rate-limited GitHub degrades the card, never the page.
  const github = await getGitHubSocialCard()

  return (
    <footer className="relative z-1 max-w-screen overflow-x-hidden font-ibm-plex-mono sm:px-2">
      <div className="relative mx-auto bg-card group-has-data-[slot=layout-wide]/layout:container md:max-w-[720px]">
        {/* Video preview banner first */}
        <AsciiFooterBanner />

        <div className="grid grid-cols-2 gap-x-6 gap-y-8 px-4 pt-8 pb-6 text-sm text-muted-foreground sm:grid-cols-3">
          {/* Colophon. Last on mobile where it reads as a sign-off, first on
              desktop where it anchors the row. */}
          <div className="col-span-2 flex flex-col justify-between gap-6 sm:order-first sm:col-span-1">
            <div>
              <p className="font-ibm-plex-mono tracking-tight">
                © {year} {USER.displayName}
              </p>
              {/* The handle echoed in braille - a printer's mark on the sheet. */}
              <p className={BRAILLE_CLASS} aria-hidden>
                {brailleText(USER.username)}
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <FooterClock timeZone={USER.timeZone} place={USER.address} />

              {/* Location stamp: the colophon's place line, a decorative twin of
                  the clock. Coordinates are deliberately absent - the data set
                  records a country, not a point. */}
              <div className={STAMP_CLASS} aria-hidden>
                <svg
                  className="size-5.5 flex-none opacity-50"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={0.7}
                >
                  <circle cx="10" cy="10" r="9" />
                  <ellipse cx="10" cy="10" rx="4" ry="9" />
                  <path d="M1 10h18M1.9 6h16.2M1.9 14h16.2" />
                </svg>
                <span className={STAMP_LINES_CLASS}>
                  <span>{USER.timeZone}</span>
                  <span>{USER.address}</span>
                </span>
              </div>
            </div>
          </div>

          {/* The list itself is a client component: it owns the hover cards,
              so no element crosses into a Radix `Slot` from the server. */}
          <FooterTree label={<FooterLabel k="contact" />}>
            <FooterContactList github={github} />
          </FooterTree>

          <FooterTree label={<FooterLabel k="index" />}>
            <FooterIndexList links={INDEX_LINKS} />
          </FooterTree>
        </div>

        <div className="flex h-6" />
      </div>
    </footer>
  )
}

function FooterTree({
  label,
  children,
}: {
  label: React.ReactNode
  children: React.ReactNode
}) {
  // The `<ul>` is supplied by each caller rather than wrapped here, because the
  // contact column's list is rendered by a client component.
  return (
    <div className={TREE_CLASS}>
      <h2 className={LABEL_CLASS}>{label}</h2>
      {children}
    </div>
  )
}

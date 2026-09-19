import Image from "next/image"
import Script from "next/script"

import { GalleryVideo } from "@/components/gallery-video"
import { SectionSeparator } from "@/components/section-separator"
import { SITE_INFO } from "@/config/site"
import { GalleryPlaceholder } from "@/features/projects/components/gallery-placeholder"
import { createPageMetadata } from "@/lib/seo"
import { cn } from "@/lib/utils"

const title = "AI & Software Project Gallery"
const description =
  "A look at my AI projects, hackathons, technical events, and the software work behind them."
const keywords = [
  "Firdaus Khotibul Zickrian gallery",
  "zickrian portfolio gallery",
  "AI project showcase",
  "machine learning project gallery",
  "software engineering portfolio",
]

export const metadata = createPageMetadata({
  title,
  description,
  path: "/gallery",
  keywords,
})

type GalleryItem = {
  src: string
  title: string
  date: string
  type?: "image" | "video"
  aspect?: "square" | "wide"
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    src: "/image/antik 2024.webp",
    title: "antik 2024 junalism",
    date: "2025",
  },
  {
    src: "/image/diklat nusapala.webp",
    title: "nusapala diklat",
    date: "2025",
  },
  {
    src: "/image/divisi kominfo.webp",
    title: "divisi kominfo",
    date: "2024",
  },
  {
    src: "/image/divisi kominfo 2.webp",
    title: "divisi kominfo 2",
    date: "2026",
  },
  {
    src: "/image/fun run nusapala.webp",
    title: "fun run nusapala",
    date: "2026",
  },
  {
    src: "/image/mabim 2023.webp",
    title: "mabim 2023",
    date: "2023",
  },
  {
    src: "/image/mabim 2025.webp",
    title: "mabim 2025",
    date: "2025",
  },
  {
    src: "/image/magang pt silga perkasa.webp",
    title: "magang pt silga perkasa",
    date: "2026",
  },
  {
    src: "/image/mentoring kelompok singapura.webp",
    title: "mentoring kelompok singapura",
    date: "2026",
  },
  {
    src: "/image/mubes 2025.webp",
    title: "mubes 2025",
    date: "2025",
  },
  {
    src: "/image/panitia ldkm.webp",
    title: "panitia ldkm",
    date: "2025",
  },
  {
    src: "/image/pelatihan jurnalis.webp",
    title: "pelatihan jurnalis",
    date: "2025",
  },
  {
    src: "/image/rapat himpunan.webp",
    title: "rapat himpunan",
    date: "2025",
  },
  {
    src: "/image/restek.webp",
    title: "restek",
    date: "2025",
  },

]

function getGalleryJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "@id": `${SITE_INFO.url}/gallery#gallery`,
    url: `${SITE_INFO.url}/gallery`,
    name: title,
    description,
    inLanguage: "en-US",
    isPartOf: {
      "@id": `${SITE_INFO.url}/#website`,
    },
    associatedMedia: GALLERY_ITEMS.map((item) => ({
      "@type": item.type === "video" ? "VideoObject" : "ImageObject",
      name: item.title,
      contentUrl: item.src.startsWith("http")
        ? item.src
        : `${SITE_INFO.url}${item.src}`,
      uploadDate: item.date,
      thumbnailUrl:
        item.type === "video"
          ? `${SITE_INFO.url}/image/btng-poster-v1.webp`
          : undefined,
    })),
  }
}

export default function GalleryPage() {
  return (
    <>
      <Script
        id="gallery-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getGalleryJsonLd()).replace(/</g, "\\u003c"),
        }}
      />
      <SectionSeparator />
      <div className="relative z-1 -mt-px border-x border-t border-line bg-card max-md:border-x-0">
        <div className="grid grid-cols-1 gap-px border-b border-line bg-line sm:grid-cols-2">
          {GALLERY_ITEMS.map((item, index) => (
            <GalleryCard key={item.src} item={item} eager={index < 2} />
          ))}
          {GALLERY_ITEMS.length % 2 === 1 && <GalleryPlaceholder />}
        </div>

        {/* Butts straight against the last row's rule, with no gap - that rule
            becomes the band's top edge and closes the box, which is what the
            home page's sections do. A spacer here left the band floating. */}
        <SectionSeparator sides={false} />
      </div>
    </>
  )
}

function GalleryCard({ item, eager }: { item: GalleryItem; eager?: boolean }) {
  return (
    <div className="flex flex-col gap-2 bg-card p-3">
      <div
        className={cn(
          "group/media relative overflow-hidden select-none",
          item.aspect === "wide" ? "aspect-2/1" : "aspect-4/3"
        )}
      >
        {item.type === "video" ? (
          <GalleryVideo
            src={item.src}
            poster="/image/btng-poster-v1.webp"
            title={item.title}
            className="absolute inset-0 size-full object-cover object-[center_30%]"
          />
        ) : (
          <Image
            src={item.src}
            alt={item.title}
            fill
            sizes="(min-width: 768px) 360px, calc(100vw - 16px)"
            loading={eager ? "eager" : "lazy"}
            fetchPriority={eager ? "high" : "auto"}
            quality={75}
            // Matches the lift the project cards already have, so the two grids
            // respond to the pointer the same way.
            className="object-cover transition-transform duration-500 ease-out group-hover/media:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover/media:scale-100"
          />
        )}
        <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10 ring-inset dark:ring-white/10" />
      </div>
    </div>
  )
}

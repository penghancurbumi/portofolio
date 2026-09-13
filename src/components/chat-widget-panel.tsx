"use client"

import {
  ArrowUpRightIcon,
  MailIcon,
  PencilIcon,
  SendIcon,
  XIcon,
} from "lucide-react"
import { type FormEvent, memo, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import ReactMarkdown from "react-markdown"
// remark-breaks turns a single "\n" into a real line break. Without it,
// consecutive lines from the model collapse into one <p>, which is the main
// reason answers looked like unreadable walls of text.
import remarkBreaks from "remark-breaks"
import remarkGfm from "remark-gfm"

import { useChat } from "@/components/chat-provider"
import { TextShimmer } from "@/components/core/text-shimmer"
import { Button } from "@/components/ui/button"
import { BUILD_INFO, TIMEZONE, TIMEZONE_LABEL } from "@/lib/build-info"
import { useTranslation } from "@/lib/i18n/use-translation"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type ChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

type EmailFlowStep =
  "idle" | "filling_form" | "formatting" | "confirming" | "sending" | "done"

type EmailFlowData = {
  step: EmailFlowStep
  name: string
  email: string
  rawMessage: string
  formattedSubject: string
  formattedMessage: string
}

type FormattedEmail = {
  subject: string
  message: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const RECENT_MESSAGE_LIMIT = 4
const STREAM_TOKEN_BATCH_SIZE = 2 // 1 word + 1 space
const STREAM_BATCH_DELAY_MS = 12

// ─── Utilities ────────────────────────────────────────────────────────────────

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

// ─── Per-browser Rate Limit (localStorage) ───────────────────────────────────

const RATE_LIMIT_KEY = "zickrian_email_rl"
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour

function getRateLimitTimestamps(): number[] {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as number[]
  } catch {
    return []
  }
}

function checkRateLimit(): {
  allowed: boolean
  remaining: number
  resetInMs: number
} {
  const now = Date.now()
  const valid = getRateLimitTimestamps().filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  )
  const remaining = RATE_LIMIT_MAX - valid.length

  if (remaining <= 0) {
    const oldest = Math.min(...valid)
    const resetInMs = RATE_LIMIT_WINDOW_MS - (now - oldest)
    return { allowed: false, remaining: 0, resetInMs }
  }

  return { allowed: true, remaining, resetInMs: 0 }
}

function recordEmailSend() {
  const now = Date.now()
  const valid = getRateLimitTimestamps().filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  )
  valid.push(now)
  try {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(valid))
  } catch {
    // localStorage might be unavailable (private mode edge case)
  }
}

function formatResetTime(ms: number): string {
  const totalMinutes = Math.ceil(ms / 60000)
  if (totalMinutes >= 60) return "1 jam"
  return `${totalMinutes} menit`
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

const SPINNER_FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]

function AsciiSpinner() {
  const [frameIndex, setFrameIndex] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % SPINNER_FRAMES.length)
    }, 80)
    return () => clearInterval(interval)
  }, [])
  return (
    <span className="mr-1.5 inline-block w-3 text-center font-mono text-xs font-bold text-white">
      {SPINNER_FRAMES[frameIndex]}
    </span>
  )
}

// ─── Email Confirmation Card (CLI Terminal Box) ──────────────────────────────

function EmailConfirmCard({
  data,
  onConfirm,
  onCancel,
  isSending,
  onUpdate,
}: {
  data: EmailFlowData
  onConfirm: () => void
  onCancel: () => void
  isSending: boolean
  onUpdate: (subject: string, message: string) => void
}) {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [editedSubject, setEditedSubject] = useState(data.formattedSubject)
  const [editedMessage, setEditedMessage] = useState(data.formattedMessage)

  const handleSave = () => {
    onUpdate(editedSubject, editedMessage)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditedSubject(data.formattedSubject)
    setEditedMessage(data.formattedMessage)
    setIsEditing(false)
  }

  return (
    <div className="my-2 flex flex-col gap-2 rounded border border-white/40 bg-black/70 p-3 font-mono text-xs shadow-inner backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/20 pb-2 text-[11px]">
        <div className="flex items-center gap-1.5 font-bold text-white">
          <span>[CONFIRM]</span>
          <span>EMAIL PREVIEW &amp; DISPATCH</span>
        </div>
        <span className="text-[10px] text-muted-foreground">interactive dialog</span>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 py-1">
        <div className="flex items-center gap-2 border-b border-line/40 pb-1.5">
          <span className="w-16 font-semibold text-muted-foreground">FROM:</span>
          <div className="flex-1 truncate font-mono text-foreground">
            {data.name} <span className="text-white/80">&lt;{data.email}&gt;</span>
          </div>
        </div>

        <div className="flex items-start gap-2 border-b border-line/40 pb-1.5">
          <span className="w-16 font-semibold text-muted-foreground">SUBJECT:</span>
          {isEditing ? (
            <input
              name="subject"
              className="flex-1 border-b border-white/60 bg-transparent font-mono text-foreground focus:outline-none"
              value={editedSubject}
              onChange={(e) => setEditedSubject(e.target.value)}
            />
          ) : (
            <span className="flex-1 font-mono text-foreground">
              {data.formattedSubject}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1 pt-1">
          <span className="font-semibold text-muted-foreground">MESSAGE:</span>
          {isEditing ? (
            <textarea
              name="message"
              rows={Math.max(3, editedMessage.split("\n").length)}
              className="w-full resize-y rounded border border-line bg-black/40 p-2 font-mono text-foreground focus:border-white/60 focus:outline-none"
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
            />
          ) : (
            <div className="max-h-50 w-full overflow-y-auto whitespace-pre-wrap rounded border border-line/40 bg-black/30 p-2 font-mono leading-relaxed text-foreground/90">
              {data.formattedMessage}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 border-t border-line/40 pt-2">
        {isEditing ? (
          <>
            <Button
              onClick={handleCancelEdit}
              variant="ghost"
              size="sm"
              className="h-7 rounded border border-line px-3 font-mono text-[11px] text-muted-foreground hover:text-foreground"
            >
              [Cancel]
            </Button>
            <Button
              onClick={handleSave}
              size="sm"
              className="h-7 rounded border border-white/50 bg-white/20 px-3 font-mono text-[11px] font-semibold text-white hover:bg-white/30"
            >
              [Save Changes]
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={onCancel}
              variant="ghost"
              size="sm"
              className="h-7 rounded border border-line px-3 font-mono text-[11px] text-muted-foreground hover:text-foreground"
            >
              [Cancel]
            </Button>
            <Button
              onClick={() => setIsEditing(true)}
              disabled={isSending}
              variant="ghost"
              size="sm"
              className="h-7 rounded border border-line px-2.5 font-mono text-[11px] text-muted-foreground hover:text-foreground"
              title={t.chat.editEmail}
            >
              <PencilIcon className="mr-1 size-3" />
              Edit
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isSending}
              size="sm"
              className="flex h-7 items-center gap-1.5 rounded border border-white/50 bg-white/20 px-3 font-mono text-[11px] font-semibold text-white hover:border-white hover:bg-white/30 active:scale-95 disabled:opacity-40"
            >
              {isSending ? (
                <>
                  <AsciiSpinner />
                  <span>Dispatching...</span>
                </>
              ) : (
                <>
                  <SendIcon className="size-3" />
                  <span>[Confirm &amp; Send ↵]</span>
                </>
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Markdown Renderer ────────────────────────────────────────────────────────
// Readability rules: left-aligned text (justify created rivers of whitespace in
// a narrow panel), generous vertical rhythm between blocks, and headings that
// get extra breathing room so each "### item" reads as its own card.

const MarkdownRenderer = memo(({ content }: { content: string }) => {
  return (
    <div className="flex flex-col gap-2 font-mono text-xs sm:text-[13px]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          p: ({ children }) => (
            <p className="my-1 font-mono leading-relaxed wrap-break-word text-foreground/90">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-mono font-semibold text-white">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="font-mono text-muted-foreground italic">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="my-1 space-y-1.5 pl-1 font-mono">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-1 list-decimal space-y-1.5 pl-4 font-mono text-foreground/90">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="relative list-none pl-3.5 font-mono leading-relaxed wrap-break-word text-foreground/90 before:absolute before:left-0 before:font-bold before:text-white before:content-['›']">
              {children}
            </li>
          ),
          hr: () => <hr className="my-2.5 border-dashed border-line/60" />,
          blockquote: ({ children }) => (
            <blockquote className="my-1.5 rounded-r border-l-2 border-white/60 bg-white/5 px-2.5 py-1 font-mono text-xs text-foreground/90">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-2 w-full overflow-x-auto rounded border border-line/60 bg-black/40 pb-1">
              <table className="w-full border-collapse font-mono text-xs text-foreground/90">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="border-b border-line bg-muted/60 font-bold text-white">
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="border-r border-line px-3 py-1.5 text-left font-semibold last:border-r-0">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-t border-r border-line/40 px-3 py-1.5 last:border-r-0">
              {children}
            </td>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-mono text-cyan-400 underline decoration-cyan-400/40 underline-offset-3 transition-colors hover:text-cyan-300 hover:decoration-cyan-300"
            >
              {children}
              <ArrowUpRightIcon className="size-3" />
            </a>
          ),
          h1: ({ children }) => (
            <h2 className="mt-3 mb-1 flex items-center gap-1.5 font-mono text-sm font-bold uppercase tracking-wider text-white first:mt-0">
              <span className="select-none text-muted-foreground/60">[#]</span>
              {children}
            </h2>
          ),
          h2: ({ children }) => (
            <h2 className="mt-3 mb-1 flex items-center gap-1.5 font-mono text-sm font-bold uppercase tracking-wider text-white first:mt-0">
              <span className="select-none text-muted-foreground/60">[#]</span>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-2.5 mb-1 flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-white first:mt-0">
              <span className="select-none text-muted-foreground/60">[::]</span>
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="mt-2 mb-1 flex items-center gap-1 font-mono text-xs font-semibold text-sky-400 first:mt-0">
              <span className="select-none text-muted-foreground/60">&gt;</span>
              {children}
            </h4>
          ),
          code: ({ className, children }) => {
            const match = /language-(\w+)/.exec(className || "")
            const lang = match ? match[1] : ""
            const codeString = String(children).trim()

            if (lang === "widget" && codeString === "contact-form") {
              return (
                <div className="animate-in fade-in slide-in-from-bottom-2 my-2 font-mono duration-300">
                  <div className="relative flex flex-col justify-between gap-3 overflow-hidden rounded border border-white/40 bg-black/60 p-3 shadow-inner sm:flex-row sm:items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded border border-white/30 bg-white/10 text-white">
                        <MailIcon className="size-4" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <div className="text-xs font-bold tracking-wide text-white uppercase">
                          [FORM] DIRECT MESSAGE
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          Kirim pesan langsung ke Muhammad Al Fakhreza
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        window.dispatchEvent(new CustomEvent("startEmailFlow"))
                      }
                      className="flex h-8 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded border border-white/50 bg-white/20 px-3 font-mono text-xs font-semibold text-white transition-all hover:border-white hover:bg-white/30 active:scale-95"
                    >
                      <span>./send-message.sh</span>
                      <ArrowUpRightIcon className="size-3" />
                    </button>
                  </div>
                </div>
              )
            }

            if (lang === "help" || lang === "plain") {
              return (
                <code className="block font-mono text-foreground/90">{children}</code>
              )
            }

            if (match) {
              return (
                <div className="my-2 overflow-hidden rounded border border-line bg-black/60 font-mono text-xs text-foreground">
                  <div className="border-b border-line/60 bg-muted/30 px-3 py-1 font-mono text-[10px] text-white">
                    {lang}
                  </div>
                  <pre className="overflow-x-auto p-3">
                    <code>{children}</code>
                  </pre>
                </div>
              )
            }

            return (
              <code className="rounded border border-white/20 bg-white/5 px-1.5 py-0.5 font-mono text-[11px] text-white">
                {children}
              </code>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
})
MarkdownRenderer.displayName = "MarkdownRenderer"

// ─── CLI terminal chrome ──────────────────────────────────────────────────────

const CLI_BANNER = [
  "█████╗ ██╗     ███████╗ █████╗ ██╗  ██╗██╗  ██╗██████╗ ███████╗███████╗ █████╗ ",
  "██╔══██╗██║     ██╔════╝██╔══██╗██║ ██╔╝██║  ██║██╔══██╗██╔════╝╚══███╔╝██╔══██╗",
  "███████║██║     █████╗  ███████║█████╔╝ ███████║██████╔╝█████╗    ███╔╝ ███████║",
  "██╔══██║██║     ██╔══╝  ██╔══██║██╔═██╗ ██╔══██║██╔══██╗██╔══╝   ███╔╝  ██╔══██║",
  "██║  ██║███████╗██║     ██║  ██║██║  ██╗██║  ██║██║  ██║███████╗███████╗██║  ██║",
  "╚═╝  ╚═╝╚══════╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝",
].join("\n")

const COMMAND_ALIASES: Record<string, string> = {
  about: "about",
  tentang: "about",
  bio: "about",
  profile: "about",
  profil: "about",

  projects: "projects",
  project: "projects",
  proyek: "projects",
  portfolio: "projects",
  portofolio: "projects",

  skills: "skills",
  skill: "skills",
  keahlian: "skills",
  stack: "skills",
  tech: "skills",
  techstack: "skills",

  experience: "experience",
  experiences: "experience",
  pengalaman: "experience",
  karir: "experience",
  career: "experience",
  kerja: "experience",

  contact: "contact",
  kontak: "contact",
  email: "contact",
  hubungi: "contact",

  help: "help",
  bantuan: "help",
  commands: "help",
  menu: "help",

  clear: "clear",
  cls: "clear",
}

function parseTerminalCommand(raw: string): string | null {
  const trimmed = raw.trim().toLowerCase()
  const cleaned = trimmed
    .replace(/^[>/]+/, "")
    .replace(/[.!?]+$/, "")
    .trim()
  return COMMAND_ALIASES[cleaned] || null
}

function getTerminalCommandResponse(cmdKey: string, lang: string = "id"): string {
  const isEn = lang === "en"

  switch (cmdKey) {
    case "help":
      return isEn
        ? [
          "Here are the available commands:",
          "",
          "```help",
          "> about        Display profile information, background, and technical focus.",
          "> projects     Display featured projects, AI/ML systems, and web applications.",
          "> skills       Display technical skills, programming languages, frameworks, and tools.",
          "> experience   Display work experience, internships, cohort programs, and career history.",
          "> contact      Display contact channels, social profiles, and direct message form.",
          "> help         Display this list of terminal commands and their descriptions.",
          "```",
        ].join("\n")
        : [
          "Berikut adalah daftar perintah yang tersedia:",
          "",
          "```help",
          "> about        Menampilkan informasi profil, latar belakang pendidikan, dan fokus keahlian.",
          "> projects     Menampilkan daftar proyek unggulan, sistem AI/ML, dan aplikasi web yang telah dibangun.",
          "> skills       Menampilkan keahlian teknis, bahasa pemrograman, framework, dan tools yang dikuasai.",
          "> experience   Menampilkan riwayat pengalaman kerja, magang, dan perjalanan karier profesional.",
          "> contact      Menampilkan informasi kontak langsung (email, media sosial) dan formulir kirim pesan.",
          "> help         Menampilkan panduan daftar perintah terminal ini beserta penjelasannya.",
          "```",
        ].join("\n")

    case "about":
      return isEn
        ? [
          "```plain",
          "MUHAMMAD AL FAKHREZA DWI PUTRA",
          "Software Engineer · Data · Artificial Intelligence",
          "",
          "Location:   Indonesia",
          "Education:  Computer Science Student",
          "Role:       AI Engineer Intern at PT Custompedia Creative Group",
          "Website:    https://www.alfakhrza.dev",
          "",
          "PROFILE",
          "Computer Science student passionate about Software Engineering,",
          "Data Science, and AI — focused on building modern, scalable apps.",
          "Experienced in problem-solving, debugging, and analysis.",
          "",
          "CORE FOCUS",
          "> Software Engineering : full-stack web apps with Next.js, TypeScript, Node.js, REST APIs.",
          "> Data & AI / ML       : ML pipelines, computer vision, data analysis, LLM/agent integrations.",
          "> System Reliability   : async processing, cloud storage workflows, production stability.",
          "",
          "Type > projects to view projects, or > experience for career history.",
          "```",
        ].join("\n")
        : [
          "```plain",
          "MUHAMMAD AL FAKHREZA DWI PUTRA",
          "Software Engineer · Data · Artificial Intelligence",
          "",
          "Lokasi:       Indonesia",
          "Pendidikan:   Mahasiswa Teknik Informatika",
          "Peran:        AI Engineer Intern di PT Custompedia Creative Group",
          "Website:      https://www.alfakhrza.dev",
          "",
          "PROFIL",
          "Mahasiswa Teknik Informatika yang berminat pada Software",
          "Engineering, Data Science, dan AI — berfokus pada aplikasi modern",
          "dan scalable. Terbiasa problem-solving, debugging, dan analisis.",
          "",
          "FOKUS KEAHLIAN",
          "> Software Engineering : aplikasi web full-stack dengan Next.js, TypeScript, Node.js, REST API.",
          "> Data & AI / ML       : machine learning, computer vision, data pipeline, integrasi agen AI/LLM.",
          "> System Reliability   : pemrosesan asinkron, manajemen cloud storage, penanganan defek produksi.",
          "",
          "Ketik > projects untuk melihat proyek, atau > experience untuk riwayat karier.",
          "```",
        ].join("\n")

    case "projects":
      return isEn
        ? [
          "```plain",
          "FEATURED PROJECTS",
          "",
          "> Narratio AI — Business Narrative Deck Generator",
          "  ML platform: raw data + web research + conversations -> consulting-style decks.",
          "  Stack: Next.js, TypeScript, Python, BiLSTM, Sentence Transformers, PostgreSQL",
          "  https://narrativoai-sable.vercel.app/",
          "",
          "> Custora AI — Customer Intelligence for Retention Decisions",
          "  Churn prediction, sentiment analysis, LLM retention recommendations.",
          "  (Best Capstone Project Award — IBM & Dicoding)",
          "  Stack: Next.js, Python, Supabase, Azure ML, Scikit-Learn",
          "",
          "> Financial Assistant Bot — AI Telegram Bot with RAG & OCR",
          "  Receipt OCR, RAG spending insights, transactional database.",
          "  Stack: Python, Docker, Telegram Bot API, Render, PostgreSQL",
          "",
          "> FloodSegmen — Aerial Flood Semantic Segmentation",
          "  Flood segmentation & hazard mapping from drone/satellite imagery.",
          "  Stack: Python, PyTorch, OpenCV, Microsoft Azure",
          "",
          "> Base Realms — Onchain Game Experience",
          "  Onchain game integrated with Solidity contracts on the Base network.",
          "  Stack: Next.js, Solidity, Web3, Base App",
          "",
          "Type > skills to see the tech stack, or > contact to collaborate.",
          "```",
        ].join("\n")
        : [
          "```plain",
          "PROYEK UNGGULAN",
          "",
          "> Narratio AI — Business Narrative Deck Generator",
          "  Platform ML: data mentah + riset web + percakapan -> deck bergaya konsultan.",
          "  Stack: Next.js, TypeScript, Python, BiLSTM, Sentence Transformers, PostgreSQL",
          "  https://narrativoai-sable.vercel.app/",
          "",
          "> Custora AI — Customer Intelligence for Retention Decisions",
          "  Prediksi churn, analisis sentimen, rekomendasi retensi berbasis LLM.",
          "  (Best Capstone Project Award — IBM & Dicoding)",
          "  Stack: Next.js, Python, Supabase, Azure ML, Scikit-Learn",
          "",
          "> Financial Assistant Bot — AI Telegram Bot with RAG & OCR",
          "  OCR struk belanja, insight keuangan RAG, database transaksi.",
          "  Stack: Python, Docker, Telegram Bot API, Render, PostgreSQL",
          "",
          "> FloodSegmen — Aerial Flood Semantic Segmentation",
          "  Segmentasi & pemetaan banjir dari citra drone/satelit.",
          "  Stack: Python, PyTorch, OpenCV, Microsoft Azure",
          "",
          "> Base Realms — Onchain Game Experience",
          "  Game onchain dengan smart contract Solidity di jaringan Base.",
          "  Stack: Next.js, Solidity, Web3, Base App",
          "",
          "Ketik > skills untuk melihat tech stack, atau > contact untuk kerja sama.",
          "```",
        ].join("\n")

    case "skills":
      return isEn
        ? [
          "```plain",
          "TECHNICAL SKILLS",
          "",
          "> Programming Languages :",
          "  Python · TypeScript · JavaScript · SQL · HTML5 · CSS3 · C++ · PHP",
          "",
          "> AI & Data :",
          "  TensorFlow · PyTorch · Keras · Scikit-Learn · OpenCV · Pandas · NumPy · BiLSTM",
          "",
          "> Frontend :",
          "  Next.js · React · Tailwind CSS · Framer Motion · HTML/CSS",
          "",
          "> Backend & Database :",
          "  Node.js · Express · Fastify · Flask · PostgreSQL · Supabase · REST APIs",
          "",
          "> Cloud, DevOps & Tools :",
          "  Git · GitHub · Docker · Microsoft Azure · Vercel · Cloudflare R2 · Figma",
          "",
          "Type > projects to see these tools applied in real products.",
          "```",
        ].join("\n")
        : [
          "```plain",
          "KEAHLIAN TEKNIS",
          "",
          "> Bahasa Pemrograman :",
          "  Python · TypeScript · JavaScript · SQL · HTML5 · CSS3 · C++ · PHP",
          "",
          "> AI & Data :",
          "  TensorFlow · PyTorch · Keras · Scikit-Learn · OpenCV · Pandas · NumPy · BiLSTM",
          "",
          "> Frontend :",
          "  Next.js · React · Tailwind CSS · Framer Motion · HTML/CSS",
          "",
          "> Backend & Database :",
          "  Node.js · Express · Fastify · Flask · PostgreSQL · Supabase · REST APIs",
          "",
          "> Cloud, DevOps & Tools :",
          "  Git · GitHub · Docker · Microsoft Azure · Vercel · Cloudflare R2 · Figma",
          "",
          "Ketik > projects untuk melihat teknologi ini dipakai di proyek nyata.",
          "```",
        ].join("\n")

    case "experience":
      return isEn
        ? [
          "```plain",
          " EXPERIENCE & CAREER HISTORY",
          "",
          "> AI Engineer Intern — PT Custompedia Creative Group   (07.2026 – Present)",
          "  - Internal ERP with AI modules: recruitment, EMS, scheduling, automation.",
          "  - Cut production error rate 88% -> 2% via async processing + Cloudflare R2.",
          "  - Coordinated 20+ cross-functional stakeholders to integrate AI agents.",
          "",
          "> AI Engineer Cohort — Pijak by Dicoding & IBM   (01.2026 – 07.2026)",
          "  - National AI program by IBM SkillsBuild & Dicoding (600+ participants).",
          "  - Graduated with Distinction (Top 10% nationwide).",
          "  - Best Capstone Project (Top 5 of 120+ teams) — Custora AI.",
          "",
          "> Education",
          "  - B.S. Computer Science / Teknik Informatika",
          "    Focus: Software Engineering, Databases, Artificial Intelligence.",
          "",
          "Type > contact to discuss hiring or collaboration.",
          "```",
        ].join("\n")
        : [
          "```plain",
          "RIWAYAT PENGALAMAN & KARIER",
          "",
          "> AI Engineer Intern — PT Custompedia Creative Group   (07.2026 – Sekarang)",
          "  - ERP internal bermuatan AI: rekrutmen, EMS, penjadwalan, automasi alur kerja.",
          "  - Menekan error rate produksi 88% -> 2% via pemrosesan asinkron + Cloudflare R2.",
          "  - Koordinasi 20+ stakeholder lintas tim untuk integrasi agen AI.",
          "",
          "> AI Engineer Cohort — Pijak by Dicoding & IBM   (01.2026 – 07.2026)",
          "  - Program AI nasional IBM SkillsBuild & Dicoding (600+ peserta).",
          "  - Lulus predikat Distinction (Top 10% nasional).",
          "  - Best Capstone Project (Top 5 dari 120+ tim) — Custora AI.",
          "",
          "> Pendidikan",
          "  - S1 Teknik Informatika (Computer Science)",
          "    Fokus: Software Engineering, Basis Data, Artificial Intelligence.",
          "",
          "Ketik > contact untuk membahas peluang kerja sama atau rekrutmen.",
          "```",
        ].join("\n")

    case "contact":
      return isEn
        ? [
          "```plain",
          "",
          "Interested in collaborating, discussing projects, or hiring? Reach out anytime:",
          "",
          "> Email: techsavvy@gmail.com",
          "> LinkedIn: Muhammad Al Fakhreza Dwi Putra",
          "> GitHub: github.com/penghancurbumi",
          "> Discord: sieza.`",
          "> Instagram: malfakhreza",
          "",
          "You can also send a direct message through the interactive form below:",
        ].join("\n")
        : [
          "```plain",
          "",
          "Tertarik untuk berdiskusi proyek, peluang kerja sama, atau rekrutmen? Hubungi saya melalui kanal berikut:",
          "",
          "> Email: techsavvy@gmail.com",
          "> LinkedIn: Muhammad Al Fakhreza Dwi Putra",
          "> GitHub: github.com/penghancurbumi",
          "> Discord: sieza.",
          "> Instagram: malfakhreza",
          "",
          "Atau kirim pesan langsung melalui formulir interaktif di bawah:",
          "",
        ].join("\n")

    default:
      return ""
  }
}

function BlinkCursor({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block h-[1.05em] w-[0.6em] shrink-0 translate-y-[0.12em] animate-terminal-blink bg-white",
        className
      )}
    />
  )
}

function TerminalWelcome({
  onSelectCommand,
}: {
  onSelectCommand?: (cmd: string) => void
}) {
  const [now, setNow] = useState(() => new Date())
  const [online, setOnline] = useState(true)

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (typeof navigator === "undefined") return
    setOnline(navigator.onLine)
    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)
    window.addEventListener("online", goOnline)
    window.addEventListener("offline", goOffline)
    return () => {
      window.removeEventListener("online", goOnline)
      window.removeEventListener("offline", goOffline)
    }
  }, [])

  const clock = `${now.toLocaleTimeString("id-ID", {
    timeZone: TIMEZONE,
    hour12: false,
  })} ${TIMEZONE_LABEL}`

  const commitLabel = BUILD_INFO.commit
    ? `${BUILD_INFO.commitSubject ? `${BUILD_INFO.commitSubject} · ` : ""}#${BUILD_INFO.commit}`
    : "latest portfolio update"

  return (
    <div className="flex flex-col gap-3 font-mono select-none">
      <pre className="overflow-x-auto text-[6px] leading-[1.15] text-white sm:text-[8px] md:text-[9.5px]">
        {CLI_BANNER}
      </pre>

      <div className="text-xs text-muted-foreground">
        <div className="flex gap-2">
          <span className="w-20 shrink-0 text-white">Name:</span>
          <span>Muhammad Al Fakhreza Dwi Putra</span>
        </div>

        <div className="flex gap-2">
          <span className="w-20 shrink-0 text-white">Role:</span>
          <span>Software Engineer · Data · AI</span>
        </div>

        <div className="flex gap-2">
          <span className="w-20 shrink-0 text-white">Education:</span>
          <span>Informatics Engineering</span>
        </div>

        <div className="flex gap-2">
          <span className="w-20 shrink-0 text-white">Location:</span>
          <span>Indonesia</span>
        </div>

        <div className="flex gap-2">
          <span className="w-20 shrink-0 text-white">System:</span>
          <span>Portfolio CLI</span>
        </div>

        <div className="flex gap-2">
          <span className="w-20 shrink-0 text-white">Version:</span>
          <span>1.0.0</span>
        </div>

        <div className="flex gap-2">
          <span className="w-20 shrink-0 text-white">Branch:</span>
          <span>{BUILD_INFO.branch || "main"}</span>
        </div>

        <div className="flex gap-2">
          <span className="w-20 shrink-0 text-white">Commit:</span>
          <span className="min-w-0 truncate">{commitLabel}</span>
        </div>

        <div className="flex gap-2">
          <span className="w-20 shrink-0 text-white">Time:</span>
          <span>{clock}</span>
        </div>

        <div className="flex gap-2">
          <span className="w-20 shrink-0 text-white">Status:</span>
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden
              className={`inline-block size-2 rounded-full ${online ? "animate-pulse bg-white" : "bg-muted-foreground/40"
                }`}
            />
            {online ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Type <span className="font-bold text-white">help</span> for available commands.
      </div>
    </div>
  )
}

export function ChatWidgetPanel({
  mode = "dock",
}: {
  mode?: "dock" | "inline"
}) {
  const { isChatOpen, setIsChatOpen } = useChat()
  const { t, language } = useTranslation()
  const [isChatActive, setIsChatActive] = useState(false)

  // No width state and nothing published to the document: the panel is a
  // fixed-width dock whose size lives entirely in `--chat-panel-width`
  // (globals.css), and the page does not react to it opening at all.
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0)

  const [error, setError] = useState<string | null>(null)

  const [emailFlow, setEmailFlow] = useState<EmailFlowData>({
    step: "idle",
    name: "",
    email: "",
    rawMessage: "",
    formattedSubject: "",
    formattedMessage: "",
  })
  const [emailError, setEmailError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const inlineRef = useRef<HTMLDivElement>(null)

  // In inline mode the panel sits below the profile header; align its top with
  // the sticky navbar on mount so the input never falls below the fold.
  useEffect(() => {
    if (mode !== "inline") return
    const scroll = () => {
      const el = inlineRef.current
      if (!el) return
      const nav = document.querySelector("nav")
      const top =
        el.getBoundingClientRect().top +
        window.scrollY -
        (nav?.offsetHeight || 0)
      window.scrollTo({ top, behavior: "instant" })
    }
    scroll()
    const frame = requestAnimationFrame(scroll)
    return () => cancelAnimationFrame(frame)
  }, [mode])

  // ── Keyboard handling (visual viewport) ─────────────────────────────────────
  useEffect(() => {
    if (!window.visualViewport) return

    const handleResize = () => {
      if (containerRef.current && window.visualViewport) {
        containerRef.current.style.height = `${window.visualViewport.height}px`
        containerRef.current.style.top = `${window.visualViewport.offsetTop}px`
      }
    }

    window.visualViewport.addEventListener("resize", handleResize)
    window.visualViewport.addEventListener("scroll", handleResize)
    handleResize()

    return () => {
      window.visualViewport?.removeEventListener("resize", handleResize)
      window.visualViewport?.removeEventListener("scroll", handleResize)
    }
  }, [])

  // ── Scroll to bottom ────────────────────────────────────────────────────────
  useEffect(() => {
    // While tokens are streaming in every few milliseconds, a `smooth` scroll
    // animation starts a fresh eased scroll on each append - the browser is
    // perpetually catching up to content it has not rendered yet, which reads
    // as jank and burns main-thread time. Snap (`auto`) keeps the view pinned
    // to the latest token, and the discrete updates (send, email steps) still
    // get the gentle smooth scroll.
    messagesEndRef.current?.scrollIntoView({
      behavior: isLoading ? "auto" : "smooth",
    })
  }, [messages, isLoading, emailFlow.step])

  // ── Textarea auto-reset ─────────────────────────────────────────────────────
  useEffect(() => {
    if (input === "" && textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }
  }, [input])

  // ── Loading message rotation ────────────────────────────────────────────────
  const latestMessage = messages[messages.length - 1]
  const waitingForFirstChunk =
    isLoading &&
    latestMessage?.role === "assistant" &&
    latestMessage.content.length === 0
  const loadingMessage =
    t.chat.loadingMessages[loadingMessageIndex % t.chat.loadingMessages.length]

  const isAgentThinking =
    isLoading || emailFlow.step === "formatting" || emailFlow.step === "sending"

  const showLoadingShimmer =
    waitingForFirstChunk ||
    emailFlow.step === "formatting" ||
    emailFlow.step === "sending"

  useEffect(() => {
    if (!isAgentThinking) {
      const timeoutId = window.setTimeout(() => setLoadingMessageIndex(0), 0)
      return () => window.clearTimeout(timeoutId)
    }
    const interval = window.setInterval(() => {
      setLoadingMessageIndex((i) => i + 1)
    }, 1200)
    return () => window.clearInterval(interval)
  }, [isAgentThinking])

  // ── Abort on unmount ────────────────────────────────────────────────────────
  useEffect(() => {
    return () => abortControllerRef.current?.abort()
  }, [])

  // ── Escape to close & Body Scroll Lock (Mobile Only) ───────────────────────
  useEffect(() => {
    if (mode !== "dock" || !isChatOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsChatOpen(false)
    }
    window.addEventListener("keydown", handleKeyDown)

    // Only lock body on mobile/touch devices to prevent layout shift on PC
    const isMobile = window.matchMedia("(max-width: 640px)").matches
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as Window & { MSStream?: unknown }).MSStream

    let scrollY = 0
    let originalStyle = ""

    if (isMobile) {
      scrollY = window.scrollY
      originalStyle = document.body.style.overflow

      if (isIOS) {
        document.body.style.position = "fixed"
        document.body.style.top = `-${scrollY}px`
        document.body.style.width = "100%"
        document.body.style.height = "100%"
      }
      document.body.style.overflow = "hidden"
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      if (isMobile) {
        if (isIOS) {
          document.body.style.position = ""
          document.body.style.top = ""
          document.body.style.width = ""
          document.body.style.height = ""
        }
        document.body.style.overflow = originalStyle
        if (isIOS) {
          window.scrollTo(0, scrollY)
        }
      }
    }
  }, [isChatOpen, setIsChatOpen, mode])

  // ── Reset textarea height ───────────────────────────────────────────────────
  useEffect(() => {
    if (emailFlow.step !== "filling_form" && textareaRef.current) {
      const el = textareaRef.current
      requestAnimationFrame(() => {
        el.style.height = "auto"
        if (el.value) {
          el.style.height = `${el.scrollHeight}px`
        }
      })
    }
  }, [emailFlow.step])

  // ── Streaming helpers ────────────────────────────────────────────────────────
  function appendAssistantContent(messageId: string, content: string) {
    if (!content) return
    setMessages((currentMessages) =>
      currentMessages.map((message) =>
        message.id === messageId
          ? { ...message, content: message.content + content }
          : message
      )
    )
  }

  async function appendAssistantContentFast(
    messageId: string,
    content: string
  ) {
    const tokens = content.split(/(\s+)/).filter(Boolean)
    for (
      let index = 0;
      index < tokens.length;
      index += STREAM_TOKEN_BATCH_SIZE
    ) {
      appendAssistantContent(
        messageId,
        tokens.slice(index, index + STREAM_TOKEN_BATCH_SIZE).join("")
      )
      await new Promise<void>((resolve) =>
        window.setTimeout(resolve, STREAM_BATCH_DELAY_MS)
      )
    }
  }

  // ── Inject an AI message into the chat ──────────────────────────────────────
  async function injectAssistantMessage(text: string) {
    const id = createId()
    setMessages((prev) => [...prev, { id, role: "assistant", content: "" }])
    await appendAssistantContentFast(id, text)
    return id
  }

  // ── Start email flow ─────────────────────────────────────────────────────────
  async function startEmailFlow() {
    if (emailFlow.step !== "idle") return
    setEmailError(null)

    // Check per-browser rate limit before starting
    const rl = checkRateLimit()
    if (!rl.allowed) {
      setIsChatActive(true)
      await injectAssistantMessage(
        t.chat.sendingLimitReached(
          RATE_LIMIT_MAX,
          formatResetTime(rl.resetInMs)
        )
      )
      return
    }

    setIsChatActive(true)
    setEmailFlow((prev) => ({
      ...prev,
      step: "filling_form",
    }))
  }

  // ── Cancel email flow ────────────────────────────────────────────────────────
  async function cancelEmailFlow() {
    setEmailError(null)
    setEmailFlow((prev) => ({ ...prev, step: "idle" }))
  }

  // ── Listen for mailto-driven email flow triggers ────────────────────────────
  useEffect(() => {
    const handleStartEmailFlow = () => startEmailFlow()
    window.addEventListener("startEmailFlow", handleStartEmailFlow)
    return () =>
      window.removeEventListener("startEmailFlow", handleStartEmailFlow)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emailFlow.step])

  // ── Handle email flow step submission ───────────────────────────────────────
  async function handleEmailFormSubmit() {
    const { name, email, rawMessage } = emailFlow

    if (!name.trim() || !email.trim() || !rawMessage.trim()) {
      return
    }
    if (!isValidEmail(email)) {
      setEmailError(t.chat.invalidEmail)
      return
    }

    setEmailError(null)

    setEmailFlow((prev) => ({
      ...prev,
      step: "formatting",
    }))

    // Inject user request as a message
    const userMsgId = createId()
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        role: "user",
        content: `Send email:\n**Name:** ${name}\n**Email:** ${email}\n**Message:** ${rawMessage}`,
      },
    ])

    try {
      const [res] = await Promise.all([
        fetch("/api/format-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderName: name,
            senderEmail: email,
            rawMessage,
          }),
        }),
        new Promise((resolve) => setTimeout(resolve, 4000)),
      ])

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as {
          error?: string
        } | null
        throw new Error(payload?.error ?? "Failed to format email.")
      }

      const formatted = (await res.json()) as FormattedEmail

      setEmailFlow((prev) => ({
        ...prev,
        step: "confirming",
        formattedSubject: formatted.subject,
        formattedMessage: formatted.message,
      }))

      await injectAssistantMessage(t.chat.emailPreviewReady)
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to format message."
      setEmailFlow((prev) => ({ ...prev, step: "idle" }))
      setEmailError(msg)
    }
  }

  // ── Confirm & send email ─────────────────────────────────────────────────────
  async function handleEmailConfirm() {
    // Double-check rate limit right before sending (guards against tab duplication)
    const rl = checkRateLimit()
    if (!rl.allowed) {
      setEmailFlow((prev) => ({ ...prev, step: "idle" }))
      await injectAssistantMessage(
        t.chat.sendingLimitReached(
          RATE_LIMIT_MAX,
          formatResetTime(rl.resetInMs)
        )
      )
      return
    }

    setEmailFlow((prev) => ({ ...prev, step: "sending" }))
    setEmailError(null)

    try {
      const [res] = await Promise.all([
        fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            senderName: emailFlow.name,
            senderEmail: emailFlow.email,
            subject: emailFlow.formattedSubject,
            message: emailFlow.formattedMessage,
          }),
        }),
        new Promise((resolve) => setTimeout(resolve, 4000)),
      ])

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as {
          error?: string
        } | null
        throw new Error(payload?.error ?? "Failed to send email.")
      }

      // Record the send ONLY after confirmed success
      recordEmailSend()

      const remaining = checkRateLimit().remaining
      setEmailFlow((prev) => ({ ...prev, step: "done" }))
      await injectAssistantMessage(
        t.chat.emailSentSuccess(emailFlow.name, emailFlow.email, remaining)
      )

      // Reset flow after success
      setTimeout(() => {
        setEmailFlow((prev) => ({
          ...prev,
          step: "idle",
          name: "",
          email: "",
          rawMessage: "",
        }))
      }, 500)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to send email."
      setEmailFlow((prev) => ({ ...prev, step: "confirming" }))
      setEmailError(msg)
    }
  }

  // ── Terminal command execution ───────────────────────────────────────────────
  async function executeTerminalCommand(cmdKey: string, rawInput?: string) {
    if (cmdKey === "clear") {
      setMessages([])
      setIsChatActive(false)
      setInput("")
      return
    }

    setIsChatActive(true)
    const displayText = rawInput
      ? rawInput.replace(/^[>/]\s*/, "").trim()
      : cmdKey

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: displayText,
    }
    const assistantId = createId()
    const assistantMessage: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
    }

    setMessages((prev) => [...prev, userMessage, assistantMessage])
    setInput("")
    setError(null)
    setIsLoading(true)

    try {
      const responseText = getTerminalCommandResponse(cmdKey, language)
      await appendAssistantContentFast(assistantId, responseText)
    } finally {
      setIsLoading(false)
    }
  }

  // ── Main chat submit ─────────────────────────────────────────────────────────
  async function handleSubmit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault()

    const trimmedInput = input.trim()
    if (!trimmedInput || isLoading) return

    // Intercept terminal commands (about, projects, skills, experience, contact, help, etc.)
    const cmdKey = parseTerminalCommand(trimmedInput)
    if (cmdKey) {
      await executeTerminalCommand(cmdKey, trimmedInput)
      return
    }

    setIsChatActive(true)

    // If formatting/confirming/sending, disable normal input
    if (
      emailFlow.step === "formatting" ||
      emailFlow.step === "confirming" ||
      emailFlow.step === "sending" ||
      emailFlow.step === "filling_form"
    ) {
      return
    }

    // Normal chat
    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: trimmedInput.replace(/^[>]\s*/, ""),
    }
    const assistantMessage: ChatMessage = {
      id: createId(),
      role: "assistant",
      content: "",
    }
    const nextMessages = [...messages, userMessage, assistantMessage]

    setMessages(nextMessages)
    setInput("")
    setError(null)
    setIsLoading(true)
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    try {
      const recentMessages = nextMessages
        .filter((message) => message.content.trim())
        .slice(-RECENT_MESSAGE_LIMIT)
        .map(({ role, content }) => ({ role, content }))

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: recentMessages }),
        signal: abortController.signal,
      })

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string
        } | null
        throw new Error(payload?.error || "Chat is unavailable.")
      }

      if (!response.body) {
        throw new Error("The chat did not return a response stream.")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        await appendAssistantContentFast(assistantMessage.id, chunk)
      }

      await appendAssistantContentFast(assistantMessage.id, decoder.decode())
    } catch (submitError) {
      if (abortController.signal.aborted) return

      const message =
        submitError instanceof Error
          ? submitError.message
          : "I can't answer right now."

      setError(message)
      setMessages((currentMessages) =>
        currentMessages.filter((message) => message.id !== assistantMessage.id)
      )
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  // ── Derived state ────────────────────────────────────────────────────────
  const isInputDisabled =
    isLoading ||
    emailFlow.step === "formatting" ||
    emailFlow.step === "confirming" ||
    emailFlow.step === "sending"

  const composerValue =
    emailFlow.step === "filling_form" ? emailFlow.rawMessage : input
  const showCursor = composerValue === "" && !isInputDisabled

  // ── Form Element ─────────────────────────────────────────────────────────
  const FormElement = (
    <div className="bg-black/40 py-2">
      {emailFlow.step === "filling_form" && (
        <div className="mb-2 flex flex-col gap-1.5 border-b border-line/40 pb-2">
          <input
            type="text"
            placeholder={t.chat.yourName}
            value={emailFlow.name}
            onChange={(e) =>
              setEmailFlow((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          />
          <input
            type="email"
            placeholder={t.chat.yourEmail}
            value={emailFlow.email}
            onChange={(e) => {
              setEmailFlow((prev) => ({ ...prev, email: e.target.value }))
              setEmailError(null)
            }}
            className="w-full bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          />
          {emailError && emailFlow.step === "filling_form" && (
            <p className="font-mono text-[11px] text-destructive">[ERROR] {emailError}</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex items-start gap-1.5">
          <div className="flex shrink-0 items-center gap-1 pt-1 font-mono text-xs select-none">
            <span className="font-bold text-white">guest@alfakhrza</span>
            <span className="text-white/50">:</span>
            <span className="font-bold text-white">~</span>
            <span className="font-bold text-white">$</span>
            {showCursor && <BlinkCursor className="ml-1" />}
          </div>

          <textarea
            ref={textareaRef}
            name={emailFlow.step === "filling_form" ? "message" : "query"}
            value={
              emailFlow.step === "filling_form" ? emailFlow.rawMessage : input
            }
            disabled={isInputDisabled && emailFlow.step !== "filling_form"}
            onChange={(event) => {
              const val = event.target.value
              if (emailFlow.step === "filling_form") {
                setEmailFlow((prev) => ({ ...prev, rawMessage: val }))
                setEmailError(null)
              } else {
                setInput(val)
              }
              const target = event.target
              requestAnimationFrame(() => {
                target.style.height = "auto"
                target.style.height = `${target.scrollHeight}px`
              })
            }}
            placeholder={
              emailFlow.step === "filling_form"
                ? t.chat.writeMessageHere
                : ""
            }
            rows={emailFlow.step === "filling_form" ? 3 : 1}
            className={cn(
              "max-h-32 min-h-6 min-w-0 flex-1 resize-none [scrollbar-width:none] bg-transparent px-0 py-1 font-mono text-xs sm:text-[13px] leading-5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none disabled:opacity-50 [&::-webkit-scrollbar]:hidden",
              showCursor && "caret-transparent"
            )}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                const target = e.target as HTMLTextAreaElement
                if (emailFlow.step === "filling_form") {
                  handleEmailFormSubmit()
                } else if (input.trim() && !isInputDisabled) {
                  target.form?.requestSubmit()
                  target.style.height = "auto"
                }
              }
            }}
          />
        </div>

        <div className="mt-1 flex w-full min-w-0 items-center justify-between gap-2 pt-1">
          <span
            aria-hidden
            className="min-w-0 truncate font-mono text-[10px] text-white/30 select-none"
          >
            [Enter] Run · [Ctrl+J] Newline
          </span>

          {/* Submit Button — only shown in email filling mode */}
          {emailFlow.step === "filling_form" && (
            <Button
              type="button"
              onClick={handleEmailFormSubmit}
              size="sm"
              disabled={
                !emailFlow.name.trim() ||
                !emailFlow.email.trim() ||
                !emailFlow.rawMessage.trim()
              }
              className="h-7 cursor-pointer rounded border border-white/30 bg-white/10 px-3 font-mono text-xs font-semibold text-white hover:bg-white/20 active:scale-95 disabled:opacity-40"
            >
              [Next ↵]
            </Button>
          )}
        </div>
      </form>
    </div>
  )

  // ── Render ───────────────────────────────────────────────────────────────────
  const panelContent = (
    <>

      {/* Body */}
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col border-b border-line bg-black px-5 pt-8 pb-8 overflow-hidden font-mono sm:px-8 sm:pt-6 sm:pb-6">
        <div className="min-h-0 min-w-0 grow overflow-x-hidden overflow-y-auto pr-1">
          {messages.length === 0 && !isChatActive ? (
            <TerminalWelcome
              onSelectCommand={(cmd) => executeTerminalCommand(cmd)}
            />
          ) : null}
          {messages.map((m) => {
            if (m.role === "assistant" && !m.content) return null

            return (
              <div key={m.id} className="font-mono text-xs sm:text-[13px]">
                {m.role === "user" ? (
                  <div className="flex items-baseline gap-2 leading-6">
                    <span
                      aria-hidden
                      className="shrink-0 font-bold text-white select-none"
                    >
                      guest@alfakhrza:~$
                    </span>
                    <div className="text-wrap wrap-break-word whitespace-pre-wrap font-semibold text-foreground">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div className="my-1 w-full text-foreground/90 leading-relaxed">
                    <div className="w-full min-w-0">
                      <MarkdownRenderer content={m.content} />
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* Email confirmation card */}
          {(emailFlow.step === "confirming" ||
            emailFlow.step === "sending") && (
              <EmailConfirmCard
                data={emailFlow}
                onConfirm={handleEmailConfirm}
                onCancel={cancelEmailFlow}
                isSending={emailFlow.step === "sending"}
                onUpdate={(subject, message) =>
                  setEmailFlow((prev) => ({
                    ...prev,
                    formattedSubject: subject,
                    formattedMessage: message,
                  }))
                }
              />
            )}

          {/* Email error (non-form state) */}
          {emailError && emailFlow.step !== "filling_form" && (
            <p className="rounded border border-destructive/40 bg-destructive/10 px-3 py-2 font-mono text-xs text-destructive">
              [ERROR] {emailError}
            </p>
          )}

          {/* Loading spinner */}
          {showLoadingShimmer && (
            <div className="flex items-center py-1 text-sm leading-7 text-muted-foreground">
              <AsciiSpinner />
              <TextShimmer className="font-medium" duration={0.9}>
                {(() => {
                  if (emailFlow.step === "formatting")
                    return t.chat.formattingMessages[
                      loadingMessageIndex % t.chat.formattingMessages.length
                    ]
                  if (emailFlow.step === "sending")
                    return t.chat.sendingMessages[
                      loadingMessageIndex % t.chat.sendingMessages.length
                    ]

                  return loadingMessage
                })()}
              </TextShimmer>
            </div>
          )}

          {error ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="mt-auto pt-4 pb-[env(safe-area-inset-bottom,0px)]">
          {FormElement}
        </div>

        {/* Footer */}
        <div className="mt-2 flex shrink-0 items-center justify-between gap-3 text-[10px] leading-none text-muted-foreground select-none">
          <div className="flex items-center gap-2">
            <span className="bg-white px-2 py-1 text-black">
              portfolio-cli · interactive mode
            </span>
            <span>~/alfakhreza</span>
          </div>

          <span>v1.0.0</span>
        </div>
      </div>
    </>
  )

  if (mode === "inline") {
    return (
      <div
        ref={inlineRef}
        className="relative z-1 -mt-px flex max-h-[calc(100dvh-3.5rem)] min-w-0 flex-col overflow-hidden border-x border-line bg-card font-ibm-plex-mono max-md:border-x-0"
      >
        {panelContent}
      </div>
    )
  }

  if (typeof document === "undefined") return null

  return createPortal(
    <>
      {/* Seamless Full-height Background (hangs below 100dvh on mobile to cover translucent keyboard) */}
      <div
        data-open={isChatOpen}
        className={cn(
          "fixed inset-y-0 right-0 z-59 border-line bg-card shadow-2xl transition-transform duration-300 ease-out",
          "h-[150vh] w-full border-0 sm:h-screen sm:w-(--chat-panel-width) sm:border-l",
          "data-[open=false]:pointer-events-none data-[open=false]:translate-x-full"
        )}
      />
      {/* Content Layer (constrained to visual viewport height) */}
      <div
        ref={containerRef}
        data-open={isChatOpen}
        className={cn(
          "fixed right-0 z-60 flex min-w-0 flex-col overflow-hidden transition-transform duration-300 ease-out",
          "w-full border-0 font-ibm-plex-mono sm:h-screen sm:w-(--chat-panel-width)",
          "data-[open=false]:pointer-events-none data-[open=false]:translate-x-full"
        )}
        style={{
          height: "100dvh",
          top: 0,
        }}
      >
        {panelContent}
      </div>
    </>,
    document.body
  )
}

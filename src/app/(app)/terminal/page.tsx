import type { Metadata } from "next"

import { ChatPanelSection } from "@/components/chat-panel-section"
import { createPageMetadata } from "@/lib/seo"

const title = "Chat with Me"
const description =
  "Ask me about my AI projects, hackathons, skills, and experiences in a live conversation."
const keywords = [
  "Firdaus Khotibul Zickrian chat",
  "AI portfolio assistant",
  "ask me about machine learning projects",
]

export const metadata: Metadata = createPageMetadata({
  title,
  description,
  path: "/terminal",
  keywords,
})

export default function ChatPage() {
  return (
    <>
      <ChatPanelSection />
    </>
  )
}

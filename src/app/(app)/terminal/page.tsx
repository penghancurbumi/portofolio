import type { Metadata } from "next"

import { ChatPanelSection } from "@/components/chat-panel-section"
import { createPageMetadata } from "@/lib/seo"

const title = "Terminal"
const description =
  "Ask me about my projects, skills, and experiences in a live conversation."
const keywords = [
  "Muhammad Al Fakhreza Dwi Putra chat",
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

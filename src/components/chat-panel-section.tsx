"use client"

import dynamic from "next/dynamic"

const ChatWidgetPanel = dynamic(
  () => import("@/components/chat-widget-panel").then((m) => m.ChatWidgetPanel),
  {
    ssr: false,
    loading: () => (
      <div className="relative z-1 -mt-px min-h-[32rem] border-x border-line bg-card max-md:border-x-0" />
    ),
  }
)

export function ChatPanelSection() {
  return <ChatWidgetPanel mode="inline" />
}

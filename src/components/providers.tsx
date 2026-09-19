"use client"

import { ThemeProvider } from "next-themes"

import { TooltipProvider } from "@/components/base/ui/tooltip"
import { ChatProvider } from "@/components/chat-provider"
import { WebMCPInitializer } from "@/components/webmcp-initializer"
import { LanguagePreferenceProvider } from "@/hooks/use-language-preference"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      enableSystem
      disableTransitionOnChange
      enableColorScheme
      storageKey="theme"
      defaultTheme="dark"
      attribute="class"
    >
      <TooltipProvider delayDuration={150}>
        <LanguagePreferenceProvider>
          <ChatProvider>
            {children}
            <WebMCPInitializer />
          </ChatProvider>
        </LanguagePreferenceProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}

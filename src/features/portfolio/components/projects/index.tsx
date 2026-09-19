"use client"

import { ArrowUpRightIcon } from "lucide-react"
import Link from "next/link"

import { CollapsibleList } from "@/components/collapsible-list"
import { useIntentPrefetch } from "@/hooks/use-intent-prefetch"
import { useTranslation } from "@/lib/i18n/use-translation"

import { PROJECTS } from "../../data/projects"
import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "../panel"
import { ProjectItem } from "./project-item"

export function Projects() {
  const { t } = useTranslation()
  const intentPrefetch = useIntentPrefetch("/projects")

  return (
    <Panel id="projects">
      <PanelHeader>
        <div className="flex w-full items-end justify-between gap-3">
          <PanelTitle>
            {t.projects.title}
            <PanelTitleSup>({PROJECTS.length})</PanelTitleSup>
          </PanelTitle>

          <Link
            href="/projects"
            prefetch={false}
            {...intentPrefetch}
            className="group -mr-3 -mb-2 inline-flex items-center gap-1 font-mono text-xs font-medium text-foreground/70 transition-colors hover:text-foreground"
          >
            <span>{t.projects.viewAll}</span>
            <ArrowUpRightIcon className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </PanelHeader>

      <CollapsibleList
        items={PROJECTS}
        max={4}
        renderItem={(item) => <ProjectItem project={item} />}
      />
    </Panel>
  )
}

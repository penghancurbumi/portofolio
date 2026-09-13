"use client"

import React from "react"

import { useTranslation } from "@/lib/i18n/use-translation"

import { EXPERIENCES } from "../../data/experiences"
import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "../panel"
import { ExperienceItem } from "./experience-item"

export function Experiences() {
  const { t } = useTranslation()

  return (
    <Panel id="experience">
      <PanelHeader>
        <PanelTitle>
          {t.experiences.title}
          <PanelTitleSup>({EXPERIENCES.length})</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>

      <div>
        {EXPERIENCES.map((experience) => (
          <ExperienceItem key={experience.id} experience={experience} />
        ))}
      </div>
    </Panel>
  )
}

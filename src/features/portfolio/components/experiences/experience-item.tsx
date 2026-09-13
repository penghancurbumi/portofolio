import type { Experience } from "../../types/experiences"
import { ExperiencePositionItem } from "./experience-position-item"

export function ExperienceItem({ experience }: { experience: Experience }) {
  return (
    <div
      id={`experience-${experience.id}`}
      className="scroll-mt-14 border-b border-line px-4 py-4 transition-colors duration-200 ease-out hover:bg-accent-muted last:border-b-0"
    >
      <div className="flex flex-col">
        <h3 className="text-lg leading-snug font-semibold">
          {experience.companyName}
        </h3>

        <div className="relative space-y-4">
          {experience.positions.map((position) => (
            <ExperiencePositionItem key={position.id} position={position} />
          ))}
        </div>
      </div>
    </div>
  )
}

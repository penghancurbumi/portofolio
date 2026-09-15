import { describe, expect, it } from "vitest"

import { getPortfolioWebMCPTools, registerWebMCPTools } from "./register-tools"

describe("WebMCP Tool Registration & Execution", () => {
  const tools = getPortfolioWebMCPTools()

  it("registers all 5 core WebMCP tools with valid JSON schemas", () => {
    const toolNames = tools.map((t) => t.name)
    expect(toolNames).toContain("search_projects")
    expect(toolNames).toContain("get_project_details")
    expect(toolNames).toContain("get_profile_overview")
    expect(toolNames).toContain("get_experiences")
    expect(toolNames).toContain("send_contact_message")

    for (const tool of tools) {
      expect(tool.description).toBeTruthy()
      expect(tool.inputSchema).toBeDefined()
      expect(tool.inputSchema.type).toBe("object")
      expect(typeof tool.execute).toBe("function")
    }
  })

  it("executes search_projects correctly", async () => {
    const searchTool = tools.find((t) => t.name === "search_projects")!
    const resAll = (await searchTool.execute({})) as {
      totalCount: number
      projects: unknown[]
    }
    expect(resAll.totalCount).toBeGreaterThan(0)
    expect(resAll.projects.length).toBeLessThanOrEqual(10)

    const resQuery = (await searchTool.execute({ query: "tailwind" })) as {
      totalCount: number
      projects: unknown[]
    }
    expect(resQuery.projects.length).toBeGreaterThan(0)
  })

  it("executes get_project_details for valid and invalid slugs", async () => {
    const detailsTool = tools.find((t) => t.name === "get_project_details")!

    const resValid = (await detailsTool.execute({ slug: "jobfinder" })) as {
      id: string
      title: string
      role: string
    }
    expect(resValid.id).toBe("jobfinder")
    expect(resValid.title).toContain("JobFinder")

    const resInvalid = (await detailsTool.execute({ slug: "nonexistent-slug-123" })) as {
      error: string
      availableProjectIds: string[]
    }
    expect(resInvalid.error).toBeDefined()
    expect(resInvalid.availableProjectIds.length).toBeGreaterThan(0)
  })

  it("executes get_profile_overview with identity, education focus, and tech stack", async () => {
    const profileTool = tools.find((t) => t.name === "get_profile_overview")!
    const res = (await profileTool.execute({})) as {
      name: string
      education: { degree: string; focusAreas: string[] }
      techStackSummary: unknown[]
    }
    expect(res.name).toBe("Muhammad Al Fakhreza Dwi Putra")
    expect(res.education.degree).toContain("Informatics Engineering")
    expect(res.education.focusAreas).toContain("Artificial Intelligence")
    expect(res.techStackSummary.length).toBeGreaterThan(0)
  })

  it("executes get_experiences with correct structure", async () => {
    const expTool = tools.find((t) => t.name === "get_experiences")!
    const res = (await expTool.execute({})) as Array<{
      companyName: string
      positions: unknown[]
    }>
    expect(res.length).toBeGreaterThan(0)
    expect(res[0].companyName).toBeDefined()
  })

  it("gracefully runs registerWebMCPTools in environment without crashing", async () => {
    await expect(registerWebMCPTools()).resolves.not.toThrow()
  })
})

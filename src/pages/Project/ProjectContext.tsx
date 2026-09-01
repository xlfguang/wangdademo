import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Project } from '@/types'
import { projects as initialProjects } from '@/mock/project'

interface ProjectContextValue {
  projects: Project[]
  addProject: (project: Project) => void
  removeProject: (id: string) => void
  getProject: (id: string) => Project | undefined
}

const ProjectContext = createContext<ProjectContextValue | null>(null)

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)

  const addProject = useCallback((project: Project) => {
    setProjects((prev) => [project, ...prev])
  }, [])

  const removeProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const getProject = useCallback(
    (id: string) => projects.find((p) => p.id === id),
    [projects],
  )

  return (
    <ProjectContext.Provider value={{ projects, addProject, removeProject, getProject }}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjectContext(): ProjectContextValue {
  const ctx = useContext(ProjectContext)
  if (!ctx) throw new Error('useProjectContext must be used within ProjectProvider')
  return ctx
}

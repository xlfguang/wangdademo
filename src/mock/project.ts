import type { Project } from '@/types'
import { getLocalData } from './dataSource'

export interface ProjectData {
  projectPluginOptions: string[]
  projects: Project[]
  projectTasks: { id: string; name: string; assignee: string; status: string; deadline: string }[]
  projectPlugins: { name: string; status: string; usage: string }[]
  projectDocs: { name: string; size: string; updatedAt: string }[]
  projectLogs: { time: string; user: string; action: string }[]
  projectMilestones: { id: string; title: string; date: string; status: 'completed' | 'running' | 'waiting' }[]
  projectMembers: { id: string; name: string; role: string; department: string; email: string }[]
}

const data = getLocalData<ProjectData>('project')

export const projectPluginOptions = data.projectPluginOptions
export const projects: Project[] = data.projects
export const projectTasks = data.projectTasks
export const projectPlugins = data.projectPlugins
export const projectDocs = data.projectDocs
export const projectLogs = data.projectLogs
export const projectMilestones = data.projectMilestones
export const projectMembers = data.projectMembers

export const getProject = (id: string): Project | undefined =>
  projects.find((p) => p.id === id)

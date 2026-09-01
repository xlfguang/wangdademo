import type {
  CollabTask, TaskProgressLog, TaskDocument, TaskComment,
  TaskChatMessage, TaskNotification, TaskLedger, TaskOperationLog,
} from '@/types'
import { getLocalData } from './dataSource'

export interface TaskData {
  taskPluginMeta: { name: string; description: string; status: 'running'; version: string }
  taskOverviewStats: {
    totalTasks: number
    completedRate: number
    overdueCount: number
    pendingAcceptance: number
    activeMembers: number
  }
  taskScenarios: { title: string; description: string; items: string[] }[]
  collabTasks: CollabTask[]
  progressLogs: TaskProgressLog[]
  taskDocuments: TaskDocument[]
  taskComments: TaskComment[]
  chatMessages: TaskChatMessage[]
  taskNotifications: TaskNotification[]
  taskLedgers: TaskLedger[]
  operationLogs: TaskOperationLog[]
  teamStats: {
    total: number
    completed: number
    pendingAcceptance: number
    inProgress: number
    notStarted: number
    overdue: number
    completionRate: number
  }
}

const data = getLocalData<TaskData>('task')

export const taskPluginMeta = data.taskPluginMeta
export const taskOverviewStats = data.taskOverviewStats
export const taskScenarios = data.taskScenarios
export const collabTasks: CollabTask[] = data.collabTasks
export const progressLogs: TaskProgressLog[] = data.progressLogs
export const taskDocuments: TaskDocument[] = data.taskDocuments
export const taskComments: TaskComment[] = data.taskComments
export const chatMessages: TaskChatMessage[] = data.chatMessages
export const taskNotifications: TaskNotification[] = data.taskNotifications
export const taskLedgers: TaskLedger[] = data.taskLedgers
export const operationLogs: TaskOperationLog[] = data.operationLogs
export const teamStats = data.teamStats

export const getCollabTask = (id: string): CollabTask | undefined =>
  collabTasks.find((t) => t.id === id)

export const getChildTasks = (parentId: string): CollabTask[] =>
  collabTasks.filter((t) => t.parentId === parentId)

export const getRootTasks = (): CollabTask[] =>
  collabTasks.filter((t) => !t.parentId)

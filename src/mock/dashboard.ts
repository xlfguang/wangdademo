import type { DashboardTask } from '@/types'
import { getLocalData } from './dataSource'

export interface PendingTodo {
  id: string
  title: string
  category: string
  priority: 'high' | 'medium' | 'low'
  route: string
}

export interface QuickAction {
  label: string
  route: string
  icon: string
}

interface DashboardData {
  dashboardStats: {
    totalTasks: number
    totalTasksChange: number
    runningTasks: number
    dataProcessed: string
    serviceProjects: number
    aiCalls: number
    knowledgeDocs: number
  }
  taskTrendData: { dates: string[]; values: number[] }
  pluginUsageData: { name: string; value: number }[]
  taskStatusData: { name: string; value: number }[]
  recentTasks: DashboardTask[]
  pendingTodos: PendingTodo[]
  dashboardQuickActions: QuickAction[]
}

const data = getLocalData<DashboardData>('dashboard')

export const dashboardStats = data.dashboardStats
export const taskTrendData = data.taskTrendData
export const pluginUsageData = data.pluginUsageData
export const taskStatusData = data.taskStatusData
export const recentTasks: DashboardTask[] = data.recentTasks
export const pendingTodos: PendingTodo[] = data.pendingTodos
export const dashboardQuickActions: QuickAction[] = data.dashboardQuickActions

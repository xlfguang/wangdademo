import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { CollabTask, TaskProgressLog, TaskNotification } from '@/types'
import { useMenuData } from '@/mock/useMenuData'
import { persistMenuUpdate } from '@/mock/dataSource'
import type { TaskData } from '@/mock/task'

interface TaskContextValue {
  tasks: CollabTask[]
  addTask: (task: CollabTask) => void
  updateTask: (id: string, patch: Partial<CollabTask>) => void
  removeTask: (id: string) => void
  getTask: (id: string) => CollabTask | undefined
  progressLogs: TaskProgressLog[]
  addProgressLog: (log: TaskProgressLog) => void
  notifications: TaskNotification[]
  markNotificationRead: (id: string) => void
}

const TaskContext = createContext<TaskContextValue | null>(null)

export function TaskProvider({ children }: { children: ReactNode }) {
  const { data } = useMenuData<TaskData>('task')
  const [tasks, setTasks] = useState<CollabTask[]>(data.collabTasks)
  const [progressLogs, setProgressLogs] = useState<TaskProgressLog[]>(data.progressLogs)
  const [notifications, setNotifications] = useState<TaskNotification[]>(data.taskNotifications)

  useEffect(() => {
    setTasks(data.collabTasks)
    setProgressLogs(data.progressLogs)
    setNotifications(data.taskNotifications)
  }, [data])

  const addTask = useCallback((task: CollabTask) => {
    setTasks((p) => [...p, task])
    persistMenuUpdate<TaskData>('task', (d) => ({ ...d, collabTasks: [...d.collabTasks, task] }))
  }, [])
  const updateTask = useCallback((id: string, patch: Partial<CollabTask>) => {
    setTasks((p) => p.map((t) => (t.id === id ? { ...t, ...patch } : t)))
    persistMenuUpdate<TaskData>('task', (d) => ({ ...d, collabTasks: d.collabTasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }))
  }, [])
  const removeTask = useCallback((id: string) => {
    setTasks((p) => p.filter((t) => t.id !== id))
    persistMenuUpdate<TaskData>('task', (d) => ({ ...d, collabTasks: d.collabTasks.filter((t) => t.id !== id) }))
  }, [])
  const getTask = useCallback((id: string) => tasks.find((t) => t.id === id), [tasks])
  const addProgressLog = useCallback((log: TaskProgressLog) => {
    setProgressLogs((p) => [log, ...p])
    persistMenuUpdate<TaskData>('task', (d) => ({ ...d, progressLogs: [log, ...d.progressLogs] }))
  }, [])
  const markNotificationRead = useCallback((id: string) => {
    setNotifications((p) => p.map((n) => (n.id === id ? { ...n, read: true } : n)))
    persistMenuUpdate<TaskData>('task', (d) => ({ ...d, taskNotifications: d.taskNotifications.map((n) => (n.id === id ? { ...n, read: true } : n)) }))
  }, [])

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, removeTask, getTask, progressLogs, addProgressLog, notifications, markNotificationRead }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTaskContext() {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTaskContext must be used within TaskProvider')
  return ctx
}

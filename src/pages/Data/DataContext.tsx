import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import type { DataSourceItem, GovernanceTask, SyncTaskItem } from '@/types'
import { useMenuData } from '@/mock/useMenuData'
import { persistMenuUpdate } from '@/mock/dataSource'
import type { DataMenuData } from '@/mock/data'

interface DataContextValue {
  sources: DataSourceItem[]
  addSource: (item: DataSourceItem) => void
  removeSource: (id: string) => void
  governanceTasks: GovernanceTask[]
  addGovernanceTask: (task: GovernanceTask) => void
  updateGovernanceTask: (id: string, updates: Partial<GovernanceTask>) => void
  syncTasks: SyncTaskItem[]
  updateSyncTask: (id: string, updates: Partial<SyncTaskItem>) => void
  removeSyncTask: (id: string) => void
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: ReactNode }) {
  const { data } = useMenuData<DataMenuData>('data')
  const [sources, setSources] = useState<DataSourceItem[]>(data.dataSources)
  const [governanceTasks, setGovernanceTasks] = useState<GovernanceTask[]>(data.governanceTasks)
  const [syncTasks, setSyncTasks] = useState<SyncTaskItem[]>(data.syncTasks)
  const progressTimers = useRef<Map<string, ReturnType<typeof setInterval>>>(new Map())

  useEffect(() => {
    setSources(data.dataSources)
    setGovernanceTasks(data.governanceTasks)
    setSyncTasks(data.syncTasks)
  }, [data])

  useEffect(() => () => {
    progressTimers.current.forEach((t) => clearInterval(t))
  }, [])

  const startGovProgress = useCallback((taskId: string) => {
    if (progressTimers.current.has(taskId)) return
    const timer = setInterval(() => {
      setGovernanceTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId || t.status !== 'running') return t
          const np = Math.min(t.progress + Math.floor(Math.random() * 12) + 5, 100)
          if (np >= 100) {
            clearInterval(progressTimers.current.get(taskId)!)
            progressTimers.current.delete(taskId)
            return { ...t, progress: 100, status: 'completed' as const, qualityScore: 96.8 }
          }
          return { ...t, progress: np }
        }),
      )
    }, 1000)
    progressTimers.current.set(taskId, timer)
  }, [])

  const addSource = useCallback((item: DataSourceItem) => {
    setSources((prev) => [item, ...prev])
    persistMenuUpdate<DataMenuData>('data', (d) => ({ ...d, dataSources: [item, ...d.dataSources] }))
  }, [])

  const removeSource = useCallback((id: string) => {
    setSources((prev) => prev.filter((s) => s.id !== id))
    persistMenuUpdate<DataMenuData>('data', (d) => ({ ...d, dataSources: d.dataSources.filter((s) => s.id !== id) }))
  }, [])

  const addGovernanceTask = useCallback(
    (task: GovernanceTask) => {
      setGovernanceTasks((prev) => [task, ...prev])
      persistMenuUpdate<DataMenuData>('data', (d) => ({ ...d, governanceTasks: [task, ...d.governanceTasks] }))
      if (task.status === 'running') startGovProgress(task.id)
    },
    [startGovProgress],
  )

  const updateGovernanceTask = useCallback((id: string, updates: Partial<GovernanceTask>) => {
    setGovernanceTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))
    persistMenuUpdate<DataMenuData>('data', (d) => ({ ...d, governanceTasks: d.governanceTasks.map((t) => (t.id === id ? { ...t, ...updates } : t)) }))
  }, [])

  const updateSyncTask = useCallback((id: string, updates: Partial<SyncTaskItem>) => {
    setSyncTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))
    persistMenuUpdate<DataMenuData>('data', (d) => ({ ...d, syncTasks: d.syncTasks.map((t) => (t.id === id ? { ...t, ...updates } : t)) }))
  }, [])

  const removeSyncTask = useCallback((id: string) => {
    setSyncTasks((prev) => prev.filter((t) => t.id !== id))
    persistMenuUpdate<DataMenuData>('data', (d) => ({ ...d, syncTasks: d.syncTasks.filter((t) => t.id !== id) }))
  }, [])

  return (
    <DataContext.Provider value={{ sources, addSource, removeSource, governanceTasks, addGovernanceTask, updateGovernanceTask, syncTasks, updateSyncTask, removeSyncTask }}>
      {children}
    </DataContext.Provider>
  )
}

export function useDataContext(): DataContextValue {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useDataContext must be used within DataProvider')
  return ctx
}

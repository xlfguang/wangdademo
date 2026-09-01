import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { DataCleanTask, CleanBatch } from '@/types'
import { useMenuData } from '@/mock/useMenuData'
import { persistMenuUpdate } from '@/mock/dataSource'
import type { DataCleanData } from '@/mock/dataClean'

interface DataCleanContextValue {
  tasks: DataCleanTask[]
  batches: CleanBatch[]
  addTask: (task: DataCleanTask) => void
  addBatch: (batch: CleanBatch) => void
  removeTask: (id: string) => void
  getTask: (id: string) => DataCleanTask | undefined
  getBatch: (id: string) => CleanBatch | undefined
}

const DataCleanContext = createContext<DataCleanContextValue | null>(null)

export function DataCleanProvider({ children }: { children: ReactNode }) {
  const { data } = useMenuData<DataCleanData>('dataClean')
  const [tasks, setTasks] = useState<DataCleanTask[]>(data.dataCleanTasks)
  const [batches, setBatches] = useState<CleanBatch[]>(data.cleanBatches)

  useEffect(() => {
    setTasks(data.dataCleanTasks)
    setBatches(data.cleanBatches)
  }, [data])

  const addTask = useCallback((task: DataCleanTask) => {
    setTasks((prev) => [task, ...prev])
    persistMenuUpdate<DataCleanData>('dataClean', (d) => ({ ...d, dataCleanTasks: [task, ...d.dataCleanTasks] }))
  }, [])

  const addBatch = useCallback((batch: CleanBatch) => {
    setBatches((prev) => [batch, ...prev])
    persistMenuUpdate<DataCleanData>('dataClean', (d) => ({ ...d, cleanBatches: [batch, ...d.cleanBatches] }))
  }, [])

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    persistMenuUpdate<DataCleanData>('dataClean', (d) => ({ ...d, dataCleanTasks: d.dataCleanTasks.filter((t) => t.id !== id) }))
  }, [])

  const getTask = useCallback((id: string) => tasks.find((t) => t.id === id), [tasks])
  const getBatch = useCallback((id: string) => batches.find((b) => b.id === id), [batches])

  return (
    <DataCleanContext.Provider value={{ tasks, batches, addTask, addBatch, removeTask, getTask, getBatch }}>
      {children}
    </DataCleanContext.Provider>
  )
}

export function useDataCleanContext(): DataCleanContextValue {
  const ctx = useContext(DataCleanContext)
  if (!ctx) throw new Error('useDataCleanContext must be used within DataCleanProvider')
  return ctx
}

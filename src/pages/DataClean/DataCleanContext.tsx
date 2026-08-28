import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { DataCleanTask, CleanBatch } from '@/types'
import { dataCleanTasks as initialTasks, cleanBatches as initialBatches } from '@/mock/dataClean'

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
  const [tasks, setTasks] = useState<DataCleanTask[]>(initialTasks)
  const [batches, setBatches] = useState<CleanBatch[]>(initialBatches)

  const addTask = useCallback((task: DataCleanTask) => {
    setTasks((prev) => [task, ...prev])
  }, [])

  const addBatch = useCallback((batch: CleanBatch) => {
    setBatches((prev) => [batch, ...prev])
  }, [])

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
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

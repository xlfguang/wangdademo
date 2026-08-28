import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { CrawlerTask, CrawlerDataRecord } from '@/types'
import { crawlerTasks as initialTasks, searchResultsMock } from '@/mock/crawler'

interface CrawlerContextValue {
  tasks: CrawlerTask[]
  addTask: (task: CrawlerTask) => void
  removeTask: (id: string) => void
  getTask: (id: string) => CrawlerTask | undefined
  searchResults: CrawlerDataRecord[]
  setSearchResults: (records: CrawlerDataRecord[]) => void
}

const CrawlerContext = createContext<CrawlerContextValue | null>(null)

export function CrawlerProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<CrawlerTask[]>(initialTasks)
  const [searchResults, setSearchResults] = useState<CrawlerDataRecord[]>([])

  const addTask = useCallback((task: CrawlerTask) => {
    setTasks((prev) => [task, ...prev])
  }, [])

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const getTask = useCallback((id: string) => tasks.find((t) => t.id === id), [tasks])

  return (
    <CrawlerContext.Provider value={{ tasks, addTask, removeTask, getTask, searchResults, setSearchResults }}>
      {children}
    </CrawlerContext.Provider>
  )
}

export function useCrawlerContext(): CrawlerContextValue {
  const ctx = useContext(CrawlerContext)
  if (!ctx) throw new Error('useCrawlerContext must be used within CrawlerProvider')
  return ctx
}

export { searchResultsMock }

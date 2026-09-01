import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { CrawlerTask, CrawlerDataRecord } from '@/types'
import { useMenuData } from '@/mock/useMenuData'
import { persistMenuUpdate } from '@/mock/dataSource'
import type { CrawlerData } from '@/mock/crawler'

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
  const { data } = useMenuData<CrawlerData>('crawler')
  const [tasks, setTasks] = useState<CrawlerTask[]>(data.crawlerTasks)
  const [searchResults, setSearchResults] = useState<CrawlerDataRecord[]>([])

  useEffect(() => {
    setTasks(data.crawlerTasks)
  }, [data])

  const addTask = useCallback((task: CrawlerTask) => {
    setTasks((prev) => [task, ...prev])
    persistMenuUpdate<CrawlerData>('crawler', (d) => ({ ...d, crawlerTasks: [task, ...d.crawlerTasks] }))
  }, [])

  const removeTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    persistMenuUpdate<CrawlerData>('crawler', (d) => ({ ...d, crawlerTasks: d.crawlerTasks.filter((t) => t.id !== id) }))
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

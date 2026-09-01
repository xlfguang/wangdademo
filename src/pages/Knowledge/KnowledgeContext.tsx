import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { KnowledgeBase, KnowledgeDoc, SyncTask, ValidationRecord, SearchHit } from '@/types'
import { useMenuData } from '@/mock/useMenuData'
import { persistMenuUpdate } from '@/mock/dataSource'
import type { KnowledgeData } from '@/mock/knowledge'

interface KnowledgeContextValue {
  bases: KnowledgeBase[]
  addBase: (base: KnowledgeBase) => void
  removeBase: (id: string) => void
  getBase: (id: string) => KnowledgeBase | undefined
  docs: Record<string, KnowledgeDoc[]>
  addDoc: (kbId: string, doc: KnowledgeDoc) => void
  getDocs: (kbId: string) => KnowledgeDoc[]
  validationRecords: ValidationRecord[]
  updateValidation: (id: string, updates: Partial<ValidationRecord>) => void
  syncTasks: SyncTask[]
  addSyncTask: (task: SyncTask) => void
  updateSyncTask: (id: string, updates: Partial<SyncTask>) => void
  removeSyncTask: (id: string) => void
  searchHits: SearchHit[]
  setSearchHits: (hits: SearchHit[]) => void
}

const KnowledgeContext = createContext<KnowledgeContextValue | null>(null)

export function KnowledgeProvider({ children }: { children: ReactNode }) {
  const { data } = useMenuData<KnowledgeData>('knowledge')
  const [bases, setBases] = useState<KnowledgeBase[]>(data.knowledgeBases)
  const [docs, setDocs] = useState<Record<string, KnowledgeDoc[]>>(data.knowledgeDocs)
  const [validationRecords, setValidationRecords] = useState<ValidationRecord[]>(data.validationRecords)
  const [syncTasks, setSyncTasks] = useState<SyncTask[]>(data.syncTasks)
  const [searchHits, setSearchHits] = useState<SearchHit[]>([])

  useEffect(() => {
    setBases(data.knowledgeBases)
    setDocs(data.knowledgeDocs)
    setValidationRecords(data.validationRecords)
    setSyncTasks(data.syncTasks)
  }, [data])

  const addBase = useCallback((base: KnowledgeBase) => {
    setBases((prev) => [base, ...prev])
    persistMenuUpdate<KnowledgeData>('knowledge', (d) => ({ ...d, knowledgeBases: [base, ...d.knowledgeBases] }))
  }, [])

  const removeBase = useCallback((id: string) => {
    setBases((prev) => prev.filter((b) => b.id !== id))
    persistMenuUpdate<KnowledgeData>('knowledge', (d) => ({ ...d, knowledgeBases: d.knowledgeBases.filter((b) => b.id !== id) }))
  }, [])

  const getBase = useCallback((id: string) => bases.find((b) => b.id === id), [bases])

  const addDoc = useCallback((kbId: string, doc: KnowledgeDoc) => {
    setDocs((prev) => ({ ...prev, [kbId]: [doc, ...(prev[kbId] ?? [])] }))
    persistMenuUpdate<KnowledgeData>('knowledge', (d) => ({ ...d, knowledgeDocs: { ...d.knowledgeDocs, [kbId]: [doc, ...(d.knowledgeDocs[kbId] ?? [])] } }))
  }, [])

  const getDocs = useCallback((kbId: string) => docs[kbId] ?? [], [docs])

  const updateValidation = useCallback((id: string, updates: Partial<ValidationRecord>) => {
    setValidationRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)))
    persistMenuUpdate<KnowledgeData>('knowledge', (d) => ({ ...d, validationRecords: d.validationRecords.map((r) => (r.id === id ? { ...r, ...updates } : r)) }))
  }, [])

  const updateSyncTask = useCallback((id: string, updates: Partial<SyncTask>) => {
    setSyncTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))
    persistMenuUpdate<KnowledgeData>('knowledge', (d) => ({ ...d, syncTasks: d.syncTasks.map((t) => (t.id === id ? { ...t, ...updates } : t)) }))
  }, [])

  const addSyncTask = useCallback((task: SyncTask) => {
    setSyncTasks((prev) => [task, ...prev])
    persistMenuUpdate<KnowledgeData>('knowledge', (d) => ({ ...d, syncTasks: [task, ...d.syncTasks] }))
  }, [])

  const removeSyncTask = useCallback((id: string) => {
    setSyncTasks((prev) => prev.filter((t) => t.id !== id))
    persistMenuUpdate<KnowledgeData>('knowledge', (d) => ({ ...d, syncTasks: d.syncTasks.filter((t) => t.id !== id) }))
  }, [])

  return (
    <KnowledgeContext.Provider value={{
      bases, addBase, removeBase, getBase,
      docs, addDoc, getDocs,
      validationRecords, updateValidation,
      syncTasks, addSyncTask, updateSyncTask, removeSyncTask,
      searchHits, setSearchHits,
    }}>
      {children}
    </KnowledgeContext.Provider>
  )
}

export function useKnowledgeContext(): KnowledgeContextValue {
  const ctx = useContext(KnowledgeContext)
  if (!ctx) throw new Error('useKnowledgeContext must be used within KnowledgeProvider')
  return ctx
}

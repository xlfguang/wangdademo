import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { KnowledgeBase, KnowledgeDoc, SyncTask, ValidationRecord, SearchHit } from '@/types'
import {
  knowledgeBases as initialBases,
  knowledgeDocs as initialDocs,
  syncTasks as initialSyncTasks,
  validationRecords as initialValidation,
  searchHitsMock,
} from '@/mock/knowledge'

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
  const [bases, setBases] = useState<KnowledgeBase[]>(initialBases)
  const [docs, setDocs] = useState<Record<string, KnowledgeDoc[]>>(initialDocs)
  const [validationRecords, setValidationRecords] = useState<ValidationRecord[]>(initialValidation)
  const [syncTasks, setSyncTasks] = useState<SyncTask[]>(initialSyncTasks)
  const [searchHits, setSearchHits] = useState<SearchHit[]>([])

  const addBase = useCallback((base: KnowledgeBase) => {
    setBases((prev) => [base, ...prev])
  }, [])

  const removeBase = useCallback((id: string) => {
    setBases((prev) => prev.filter((b) => b.id !== id))
  }, [])

  const getBase = useCallback((id: string) => bases.find((b) => b.id === id), [bases])

  const addDoc = useCallback((kbId: string, doc: KnowledgeDoc) => {
    setDocs((prev) => ({ ...prev, [kbId]: [doc, ...(prev[kbId] ?? [])] }))
  }, [])

  const getDocs = useCallback((kbId: string) => docs[kbId] ?? [], [docs])

  const updateValidation = useCallback((id: string, updates: Partial<ValidationRecord>) => {
    setValidationRecords((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)))
  }, [])

  const updateSyncTask = useCallback((id: string, updates: Partial<SyncTask>) => {
    setSyncTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)))
  }, [])

  const addSyncTask = useCallback((task: SyncTask) => {
    setSyncTasks((prev) => [task, ...prev])
  }, [])

  const removeSyncTask = useCallback((id: string) => {
    setSyncTasks((prev) => prev.filter((t) => t.id !== id))
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

export { searchHitsMock }

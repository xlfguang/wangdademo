import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { AiModel } from '@/mock/model'
import { initialModels } from '@/mock/model'

interface ModelContextValue {
  models: AiModel[]
  addModel: (model: AiModel) => void
  updateModel: (id: string, patch: Partial<AiModel>) => void
  removeModel: (id: string) => void
  toggleModelStatus: (id: string) => void
  getModel: (id: string) => AiModel | undefined
}

const ModelContext = createContext<ModelContextValue | null>(null)

export function ModelProvider({ children }: { children: ReactNode }) {
  const [models, setModels] = useState<AiModel[]>(initialModels)

  const addModel = useCallback((model: AiModel) => {
    setModels((prev) => [model, ...prev])
  }, [])

  const updateModel = useCallback((id: string, patch: Partial<AiModel>) => {
    setModels((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)))
  }, [])

  const removeModel = useCallback((id: string) => {
    setModels((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const toggleModelStatus = useCallback((id: string) => {
    setModels((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: m.status === 'enabled' ? 'disabled' : 'enabled' } : m,
      ),
    )
  }, [])

  const getModel = useCallback((id: string) => models.find((m) => m.id === id), [models])

  return (
    <ModelContext.Provider value={{ models, addModel, updateModel, removeModel, toggleModelStatus, getModel }}>
      {children}
    </ModelContext.Provider>
  )
}

export function useModelContext(): ModelContextValue {
  const ctx = useContext(ModelContext)
  if (!ctx) throw new Error('useModelContext must be used within ModelProvider')
  return ctx
}

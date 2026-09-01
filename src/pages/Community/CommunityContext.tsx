import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { AggregatedMessage, IntentRecord } from '@/types'
import { useMenuData } from '@/mock/useMenuData'
import { persistMenuUpdate } from '@/mock/dataSource'
import type { CommunityData } from '@/mock/community'

interface CommunityContextValue {
  messages: AggregatedMessage[]
  updateMessageStatus: (id: string, status: AggregatedMessage['status']) => void
  selectedMessage: AggregatedMessage | null
  setSelectedMessage: (msg: AggregatedMessage | null) => void
  intents: IntentRecord[]
  setIntents: (intents: IntentRecord[]) => void
  autoReply: string
  setAutoReply: (text: string) => void
}

const CommunityContext = createContext<CommunityContextValue | null>(null)

export function CommunityProvider({ children }: { children: ReactNode }) {
  const { data } = useMenuData<CommunityData>('community')
  const [messages, setMessages] = useState<AggregatedMessage[]>(data.aggregatedMessages)
  const [selectedMessage, setSelectedMessage] = useState<AggregatedMessage | null>(null)
  const [intents, setIntents] = useState<IntentRecord[]>([])
  const [autoReply, setAutoReply] = useState('')

  useEffect(() => {
    setMessages(data.aggregatedMessages)
  }, [data])

  const updateMessageStatus = useCallback((id: string, status: AggregatedMessage['status']) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)))
    persistMenuUpdate<CommunityData>('community', (d) => ({ ...d, aggregatedMessages: d.aggregatedMessages.map((m) => (m.id === id ? { ...m, status } : m)) }))
  }, [])

  return (
    <CommunityContext.Provider value={{
      messages,
      updateMessageStatus,
      selectedMessage,
      setSelectedMessage,
      intents,
      setIntents,
      autoReply,
      setAutoReply,
    }}>
      {children}
    </CommunityContext.Provider>
  )
}

export function useCommunityContext(): CommunityContextValue {
  const ctx = useContext(CommunityContext)
  if (!ctx) throw new Error('useCommunityContext must be used within CommunityProvider')
  return ctx
}

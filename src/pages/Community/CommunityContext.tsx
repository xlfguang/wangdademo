import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { AggregatedMessage, IntentRecord } from '@/types'
import {
  aggregatedMessages as initialMessages,
  intentTop3Mock,
  autoReplyMock,
} from '@/mock/community'

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
  const [messages, setMessages] = useState<AggregatedMessage[]>(initialMessages)
  const [selectedMessage, setSelectedMessage] = useState<AggregatedMessage | null>(null)
  const [intents, setIntents] = useState<IntentRecord[]>([])
  const [autoReply, setAutoReply] = useState('')

  const updateMessageStatus = useCallback((id: string, status: AggregatedMessage['status']) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)))
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

export { intentTop3Mock, autoReplyMock }

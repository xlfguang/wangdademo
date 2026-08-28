import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { AudioClip, TranscriptSegment, ExtractedInfo, AudioFileMeta, AudioTask } from '@/types'
import { audioTasks as initialTasks, transcriptMock, extractionMock } from '@/mock/audio'

interface AudioContextValue {
  tasks: AudioTask[]
  clips: AudioClip[]
  addClip: (clip: AudioClip) => void
  removeClip: (id: string) => void
  clearClips: () => void
  fileMeta: AudioFileMeta | null
  setFileMeta: (meta: AudioFileMeta | null) => void
  transcript: TranscriptSegment[]
  setTranscript: (segments: TranscriptSegment[]) => void
  transcriptText: string
  setTranscriptText: (text: string) => void
  extraction: ExtractedInfo
  setExtraction: (info: ExtractedInfo) => void
  getTask: (id: string) => AudioTask | undefined
}

const AudioContext = createContext<AudioContextValue | null>(null)

export function AudioProvider({ children }: { children: ReactNode }) {
  const [tasks] = useState<AudioTask[]>(initialTasks)
  const [clips, setClips] = useState<AudioClip[]>([])
  const [fileMeta, setFileMeta] = useState<AudioFileMeta | null>(null)
  const [transcript, setTranscript] = useState<TranscriptSegment[]>([])
  const [transcriptText, setTranscriptText] = useState('')
  const [extraction, setExtraction] = useState<ExtractedInfo>(extractionMock)

  const addClip = useCallback((clip: AudioClip) => {
    setClips((prev) => [...prev, clip])
  }, [])

  const removeClip = useCallback((id: string) => {
    setClips((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const clearClips = useCallback(() => setClips([]), [])

  const getTask = useCallback((id: string) => tasks.find((t) => t.id === id), [tasks])

  return (
    <AudioContext.Provider value={{
      tasks, clips, addClip, removeClip, clearClips,
      fileMeta, setFileMeta,
      transcript, setTranscript, transcriptText, setTranscriptText,
      extraction, setExtraction, getTask,
    }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudioContext(): AudioContextValue {
  const ctx = useContext(AudioContext)
  if (!ctx) throw new Error('useAudioContext must be used within AudioProvider')
  return ctx
}

export { transcriptMock, extractionMock }

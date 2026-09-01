import type { AudioTask, TranscriptSegment, ExtractedInfo, AudioHistoryRecord } from '@/types'
import { getLocalData } from './dataSource'

export interface AudioData {
  audioPluginMeta: { name: string; description: string; status: 'running'; version: string }
  audioOverviewStats: {
    totalTasks: number
    todayProcessed: number
    totalTranscriptHours: string
    accuracyRate: number
    apiCalls: number
  }
  audioScenarios: { title: string; description: string; items: string[] }[]
  audioTasks: AudioTask[]
  transcriptMock: TranscriptSegment[]
  extractionMock: ExtractedInfo
  historyRecords: AudioHistoryRecord[]
  audioSettingsDefault: {
    exportFormat: string
    saveFormat: string
    language: string
    multiSpeaker: boolean
    extractCategories: string[]
    cacheLimit: number
  }
  voiceProfiles: { id: string; name: string; desc: string; tag: string }[]
  synthesisScenarios: Record<string, { title: string; template: string }>
  synthesisHistory: { id: string; text: string; voice: string; duration: string; createdAt: string }[]
}

const data = getLocalData<AudioData>('audio')

export const audioPluginMeta = data.audioPluginMeta
export const audioOverviewStats = data.audioOverviewStats
export const audioScenarios = data.audioScenarios
export const audioTasks: AudioTask[] = data.audioTasks
export const transcriptMock: TranscriptSegment[] = data.transcriptMock
export const extractionMock: ExtractedInfo = data.extractionMock
export const historyRecords: AudioHistoryRecord[] = data.historyRecords
export const audioSettingsDefault = data.audioSettingsDefault
export const voiceProfiles = data.voiceProfiles
export const synthesisScenarios = data.synthesisScenarios
export const synthesisHistory = data.synthesisHistory

export const getAudioTask = (id: string): AudioTask | undefined =>
  audioTasks.find((t) => t.id === id)

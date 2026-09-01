import type {
  KnowledgeBase, KnowledgeDoc, QAPair, SyncTask,
  ValidationRecord, SearchHit,
} from '@/types'
import { getLocalData } from './dataSource'

interface KnowledgeData {
  knowledgePluginMeta: { name: string; description: string; status: 'running'; version: string }
  knowledgeOverviewStats: {
    totalBases: number
    totalDocs: number
    totalVectors: number
    todaySearches: number
    syncTaskCount: number
  }
  knowledgeScenarios: { title: string; description: string; items: string[] }[]
  knowledgeBases: KnowledgeBase[]
  knowledgeDocs: Record<string, KnowledgeDoc[]>
  docProcessSteps: string[]
  validationRecords: ValidationRecord[]
  syncTasks: SyncTask[]
  searchHitsMock: SearchHit[]
  qaPairs: QAPair[]
  ragSources: { id: string; kbId: string; kbName: string; docName: string; snippet: string; score: number }[]
  knowledgeSettingsDefault: {
    embeddingModel: string
    chunkSize: number
    chunkOverlap: number
    topK: number
    scoreThreshold: number
    autoSync: boolean
    auditRequired: boolean
    agentEnabled: boolean
  }
}

const data = getLocalData<KnowledgeData>('knowledge')

export const knowledgePluginMeta = data.knowledgePluginMeta
export const knowledgeOverviewStats = data.knowledgeOverviewStats
export const knowledgeScenarios = data.knowledgeScenarios
export const knowledgeBases: KnowledgeBase[] = data.knowledgeBases
export const knowledgeDocs: Record<string, KnowledgeDoc[]> = data.knowledgeDocs
export const docProcessSteps = data.docProcessSteps
export const validationRecords: ValidationRecord[] = data.validationRecords
export const syncTasks: SyncTask[] = data.syncTasks
export const searchHitsMock: SearchHit[] = data.searchHitsMock
export const qaPairs: QAPair[] = data.qaPairs
export const ragSources = data.ragSources
export const knowledgeSettingsDefault = data.knowledgeSettingsDefault

export const getKnowledgeBase = (id: string): KnowledgeBase | undefined =>
  knowledgeBases.find((kb) => kb.id === id)

export const getKnowledgeDocs = (kbId: string): KnowledgeDoc[] =>
  knowledgeDocs[kbId] ?? []

export const getAllKnowledgeDocs = (): KnowledgeDoc[] =>
  Object.values(knowledgeDocs).flat()

import type {
  DataCleanTask, CleanBatch, CleanDocument, PipelineStep, QualityCheckItem,
} from '@/types'
import { getLocalData } from './dataSource'

export interface DataCleanData {
  dataCleanPluginMeta: { name: string; description: string; status: 'running'; version: string }
  dataCleanOverviewStats: {
    totalBatches: number
    todayProcessed: number
    runningBatches: number
    qualityPassRate: number
    apiCalls: number
  }
  dataCleanScenarios: { title: string; description: string; items: string[] }[]
  quotaLimits: {
    office: { maxFiles: number; maxPagesPerFile: number }
    multimodal: { maxEquivalentPages: number; minutesPerPage: number }
  }
  pipelineLayers: PipelineStep[]
  cleanSteps: string[]
  qualityReport: {
    dedupeScore: number
    formatScore: number
    structureScore: number
    overallScore: number
    original: number
    valid: number
    duplicate: number
    abnormal: number
    qualityRate: number
  }
  qualityCheckItems: QualityCheckItem[]
  cleanCompareSamples: {
    id: string
    document: string
    field: string
    before: string
    after: string
    category: string
  }[]
  cleanDocuments: CleanDocument[]
  cleanBatches: CleanBatch[]
  dataCleanTasks: DataCleanTask[]
  dataCleanSettingsDefault: {
    officeMaxFiles: number
    officeMaxPagesPerFile: number
    multimodalMaxPages: number
    minutesPerPage: number
    dedupeThreshold: number
    formatRules: string
    structureConfidenceThreshold: number
    enableNegotiation: boolean
    regularSlaHours: number
    urgentSlaHours: number
    autoRetry: boolean
    maxRetry: number
  }
  negotiationRecords: { id: string; batchNo: string; reason: string; status: string; result: string; time: string }[]
}

const data = getLocalData<DataCleanData>('dataClean')

export const dataCleanPluginMeta = data.dataCleanPluginMeta
export const dataCleanOverviewStats = data.dataCleanOverviewStats
export const dataCleanScenarios = data.dataCleanScenarios
export const quotaLimits = data.quotaLimits
export const pipelineLayers: PipelineStep[] = data.pipelineLayers
export const cleanSteps = data.cleanSteps
export const qualityReport = data.qualityReport
export const qualityCheckItems: QualityCheckItem[] = data.qualityCheckItems
export const cleanCompareSamples = data.cleanCompareSamples
export const cleanDocuments: CleanDocument[] = data.cleanDocuments
export const cleanBatches: CleanBatch[] = data.cleanBatches
export const dataCleanTasks: DataCleanTask[] = data.dataCleanTasks
export const dataCleanSettingsDefault = data.dataCleanSettingsDefault
export const negotiationRecords = data.negotiationRecords

export const getDataCleanTask = (id: string): DataCleanTask | undefined =>
  dataCleanTasks.find((t) => t.id === id)

export const getCleanBatch = (id: string): CleanBatch | undefined =>
  cleanBatches.find((b) => b.id === id)

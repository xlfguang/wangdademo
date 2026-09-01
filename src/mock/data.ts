import type {
  DataTask,
  DataSourceItem,
  GovernanceTask,
  SyncTaskItem,
  ReportItem,
  QualityAlert,
  SystemUser,
  AiAnalysisResult,
} from '@/types'
import { getLocalData } from './dataSource'

export interface DataMenuData {
  dataPluginMeta: { name: string; description: string; version: string }
  dataOverviewStats: {
    sourceCount: number
    todayVolume: string
    taskCount: number
    qualityScore: number
    abnormalCount: number
    apiCalls: number
  }
  dataTrend: { dates: string[]; ingest: number[]; process: number[] }
  dataSourceDistribution: { name: string; value: number }[]
  qualityOverview: { completeness: number; accuracy: number; consistency: number; uniqueness: number }
  dataSources: DataSourceItem[]
  governanceTasks: GovernanceTask[]
  governanceResult: {
    original: number
    valid: number
    cleaned: number
    duplicate: number
    abnormal: number
    missing: number
    qualityScore: number
    beforeAfter: { dimensions: string[]; before: number[]; after: number[] }
    issueDistribution: { name: string; value: number }[]
  }
  analysisStats: { total: number; avg: number; max: number; min: number; median: number; stdDev: number }
  salesTrend: { months: string[]; values: number[] }
  regionCompare: { name: string; value: number }[]
  correlationData: number[][]
  aiAnalysisPairs: AiAnalysisResult[]
  reports: ReportItem[]
  reportDashboard: { sales: number; users: number; orders: number; conversion: number }
  qualityMetrics: {
    overall: number
    completeness: number
    accuracy: number
    consistency: number
    uniqueness: number
    timeliness: number
  }
  qualityTrend: { dates: string[]; values: number[] }
  qualityAlerts: QualityAlert[]
  syncTasks: SyncTaskItem[]
  systemUsers: SystemUser[]
  permissionTree: { title: string; key: string; children: { title: string; key: string }[] }[]
  dataTasks: DataTask[]
}

const data = getLocalData<DataMenuData>('data')

export const dataPluginMeta = data.dataPluginMeta
export const dataOverviewStats = data.dataOverviewStats
export const dataTrend = data.dataTrend
export const dataSourceDistribution = data.dataSourceDistribution
export const qualityOverview = data.qualityOverview
export const dataSources: DataSourceItem[] = data.dataSources
export const governanceTasks: GovernanceTask[] = data.governanceTasks
export const governanceResult = data.governanceResult
export const analysisStats = data.analysisStats
export const salesTrend = data.salesTrend
export const regionCompare = data.regionCompare
export const correlationData = data.correlationData
export const aiAnalysisPairs: AiAnalysisResult[] = data.aiAnalysisPairs
export const reports: ReportItem[] = data.reports
export const reportDashboard = data.reportDashboard
export const qualityMetrics = data.qualityMetrics
export const qualityTrend = data.qualityTrend
export const qualityAlerts: QualityAlert[] = data.qualityAlerts
export const syncTasks: SyncTaskItem[] = data.syncTasks
export const systemUsers: SystemUser[] = data.systemUsers
export const permissionTree = data.permissionTree
export const dataTasks: DataTask[] = data.dataTasks

export const getDataTask = (id: string): DataTask | undefined =>
  dataTasks.find((t) => t.id === id)

export const getReport = (id: string): ReportItem | undefined =>
  reports.find((r) => r.id === id)

import type {
  CrawlerTask, CrawlerDataRecord, CrawlerDataSource, TrustedSource,
  OpinionHotspot, AlertRecord, CrawlerSearchLog,
} from '@/types'
import { getLocalData } from './dataSource'

export interface CrawlerSchedule {
  id: string
  name: string
  keyword: string
  cron: string
  frequency: string
  dataSource: string
  enabled: boolean
  lastRun: string
  nextRun: string
  status: 'completed' | 'running' | 'waiting' | 'failed'
}

export interface CrawlerData {
  crawlerPluginMeta: { name: string; description: string; status: 'running'; version: string }
  crawlerOverviewStats: {
    totalTasks: number
    todayCollected: number
    hotspotCount: number
    alertCount: number
    apiCalls: number
  }
  crawlerScenarios: { title: string; description: string; items: string[] }[]
  keywordGroups: { id: string; name: string; keywords: string; count: number }[]
  crawlerTasks: CrawlerTask[]
  dataSources: CrawlerDataSource[]
  trustedSources: TrustedSource[]
  searchResultsMock: CrawlerDataRecord[]
  searchLogsMock: CrawlerSearchLog[]
  opinionHotspots: OpinionHotspot[]
  alertRecords: AlertRecord[]
  storedDataRecords: CrawlerDataRecord[]
  crawlerSettingsDefault: {
    threads: number
    interval: number
    maxCollect: number
    dedupeLevel: string
    sourceFilter: string
    alertUrgentThreshold: number
    alertImportantThreshold: number
    alertChannel: string
    storagePath: string
    cloudSync: boolean
    backupFreq: string
    agentSync: boolean
  }
  storageStats: {
    localUsed: string
    localTotal: string
    cloudUsed: string
    cloudTotal: string
    categories: { name: string; size: string }[]
  }
  levelStrategy: Record<string, string>
  crawlerSchedules: CrawlerSchedule[]
}

const data = getLocalData<CrawlerData>('crawler')

export const crawlerPluginMeta = data.crawlerPluginMeta
export const crawlerOverviewStats = data.crawlerOverviewStats
export const crawlerScenarios = data.crawlerScenarios
export const keywordGroups = data.keywordGroups
export const crawlerTasks: CrawlerTask[] = data.crawlerTasks
export const dataSources: CrawlerDataSource[] = data.dataSources
export const trustedSources: TrustedSource[] = data.trustedSources
export const searchResultsMock: CrawlerDataRecord[] = data.searchResultsMock
export const searchLogsMock: CrawlerSearchLog[] = data.searchLogsMock
export const opinionHotspots: OpinionHotspot[] = data.opinionHotspots
export const alertRecords: AlertRecord[] = data.alertRecords
export const storedDataRecords: CrawlerDataRecord[] = data.storedDataRecords
export const crawlerSettingsDefault = data.crawlerSettingsDefault
export const storageStats = data.storageStats
export const levelStrategy = data.levelStrategy
export const crawlerSchedules: CrawlerSchedule[] = data.crawlerSchedules

export const getCrawlerTask = (id: string): CrawlerTask | undefined =>
  crawlerTasks.find((t) => t.id === id)

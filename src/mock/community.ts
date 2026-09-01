import type {
  Channel,
  CommunityGroup,
  AggregatedMessage,
  IntentRecord,
  PushTemplate,
  UserPortrait,
  CommunityAlert,
  TaskStatus,
} from '@/types'
import { getLocalData } from './dataSource'

export interface PushStrategyItem {
  id: string
  name: string
  channel: string
  trigger: string
  frequency: string
  status: TaskStatus
  lastRun: string
}

interface CommunityData {
  communityPluginMeta: { name: string; description: string; status: 'running'; version: string }
  communityOverviewStats: {
    totalGroups: number
    todayMessages: number
    aiReplyRate: number
    pushReachRate: number
    apiCalls: number
  }
  communityScenarios: { title: string; description: string; items: string[] }[]
  channels: Channel[]
  communityGroups: CommunityGroup[]
  aggregatedMessages: AggregatedMessage[]
  intentTop3Mock: IntentRecord[]
  autoReplyMock: string
  pushTemplates: PushTemplate[]
  pushStrategies: PushStrategyItem[]
  userPortraits: UserPortrait[]
  lifecycleStats: { stage: string; label: string; count: number; color: string }[]
  strategyEffectStats: {
    pushConversionRate: number
    retentionLift: number
    repurchaseRate: number
    avgResponseTime: string
  }
  communityAlerts: CommunityAlert[]
  communitySettingsDefault: {
    userDailyLimit: number
    channelDailyLimit: number
    channelHourlyLimit: number
    quietHoursEnabled: boolean
    quietStart: string
    quietEnd: string
    unsubscribeKeywords: string
    globalUnsubscribe: boolean
    unsubscribeConfirm: boolean
  }
  communityStats: { totalGroups: number; totalMembers: number; todayNew: number; activeMembers: number }
}

const data = getLocalData<CommunityData>('community')

export const communityPluginMeta = data.communityPluginMeta
export const communityOverviewStats = data.communityOverviewStats
export const communityScenarios = data.communityScenarios
export const channels: Channel[] = data.channels
export const communityGroups: CommunityGroup[] = data.communityGroups
export const aggregatedMessages: AggregatedMessage[] = data.aggregatedMessages
export const intentTop3Mock: IntentRecord[] = data.intentTop3Mock
export const autoReplyMock = data.autoReplyMock
export const pushTemplates: PushTemplate[] = data.pushTemplates
export const pushStrategies: PushStrategyItem[] = data.pushStrategies
export const userPortraits: UserPortrait[] = data.userPortraits
export const lifecycleStats = data.lifecycleStats
export const strategyEffectStats = data.strategyEffectStats
export const communityAlerts: CommunityAlert[] = data.communityAlerts
export const communitySettingsDefault = data.communitySettingsDefault
/** @deprecated use communityOverviewStats */
export const communityStats = data.communityStats

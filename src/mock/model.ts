import { getLocalData } from './dataSource'

export type ModelType = 'llm' | 'multimodal' | 'asr' | 'embedding' | 'vision' | 'ocr'
export type ModelStatus = 'enabled' | 'disabled'
export type DispatchStrategy = 'round_robin' | 'priority' | 'single'

export interface AiModel {
  id: string
  name: string
  type: ModelType
  url: string
  apiKey: string
  plugins: string[]
  status: ModelStatus
  createdAt: string
  lastCallAt: string
  callCount: number
  avgLatency: string
}

export interface PluginAssignment {
  id: string
  plugin: string
  icon: string
  models: string[]
  strategy: DispatchStrategy
}

export interface ModelOperationLog {
  id: string
  time: string
  operator: string
  action: string
  target: string
  detail: string
}

export interface ModelCallRankItem {
  rank: number
  modelId: string
  modelName: string
  callCount: number
  percentage: number
}

export interface ModelCallTop5Response {
  totalCalls: number
  items: ModelCallRankItem[]
}

export interface ModelData {
  modelTypeLabels: Record<ModelType, string>
  modelTypeColors: Record<ModelType, string>
  dispatchStrategyLabels: Record<DispatchStrategy, string>
  modelPluginMeta: { name: string; description: string; status: 'running'; version: string }
  modelOverviewStats: {
    total: number
    enabled: number
    disabled: number
    assignedPlugins: number
    totalCalls: number
    successRate: number
  }
  modelCallTrend: { dates: string[]; values: number[] }
  modelCallTop5: ModelCallTop5Response
  modelCallRankColors: string[]
  modelProcessSteps: string[]
  initialModels: AiModel[]
  pluginAssignments: PluginAssignment[]
  allocatablePlugins: string[]
  modelSettingsDefault: {
    defaultLlm: string
    defaultEmbedding: string
    timeout: number
    maxRetries: number
    qpsLimit: number
    monitoringEnabled: boolean
    logEnabled: boolean
    auditEnabled: boolean
  }
  modelOperationLogs: ModelOperationLog[]
  testScenarios: string[]
  testScenarioPrompts: Record<string, string>
  mockTestResponses: Record<string, string>
}

const data = getLocalData<ModelData>('model')

export const modelTypeLabels = data.modelTypeLabels
export const modelTypeColors = data.modelTypeColors
export const dispatchStrategyLabels = data.dispatchStrategyLabels
export const modelPluginMeta = data.modelPluginMeta
export const modelOverviewStats = data.modelOverviewStats
export const modelCallTrend = data.modelCallTrend
export const modelCallTop5: ModelCallTop5Response = data.modelCallTop5
export const modelCallRankColors = data.modelCallRankColors
export const modelProcessSteps = data.modelProcessSteps
export const initialModels: AiModel[] = data.initialModels
export const pluginAssignments: PluginAssignment[] = data.pluginAssignments
export const allocatablePlugins = data.allocatablePlugins
export const modelSettingsDefault = data.modelSettingsDefault
export const modelOperationLogs: ModelOperationLog[] = data.modelOperationLogs
export const testScenarios = data.testScenarios
export const testScenarioPrompts = data.testScenarioPrompts
export const mockTestResponses = data.mockTestResponses

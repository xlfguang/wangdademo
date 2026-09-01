import type {
  VideoTask,
  VideoAnalysisResult,
  VideoApiEndpoint,
  VideoPluginConfig,
} from '@/types'
import { getLocalData } from './dataSource'

interface VideoData {
  videoPluginMeta: { name: string; description: string; status: 'running'; version: string }
  videoOverviewStats: {
    totalTasks: number
    runningTasks: number
    processedVolume: string
    successRate: number
    apiCalls: number
  }
  videoCapabilities: { title: string; description: string; items: string[] }[]
  videoTasks: VideoTask[]
  videoAnalysis: VideoAnalysisResult
  videoApiEndpoints: VideoApiEndpoint[]
  videoPluginConfig: VideoPluginConfig
  workspaceAssets: { id: string; name: string; duration: string; size: string }[]
  workspaceTimelineClips: {
    id: string
    track: 'video' | 'audio'
    label: string
    start: number
    end: number
    color: string
  }[]
}

const data = getLocalData<VideoData>('video')

export const videoPluginMeta = data.videoPluginMeta
export const videoOverviewStats = data.videoOverviewStats
export const videoCapabilities = data.videoCapabilities
export const videoTasks: VideoTask[] = data.videoTasks
export const videoAnalysis: VideoAnalysisResult = data.videoAnalysis
export const videoApiEndpoints: VideoApiEndpoint[] = data.videoApiEndpoints
export const videoPluginConfig: VideoPluginConfig = data.videoPluginConfig

let taskStore = [...videoTasks]

export const getVideoTasks = (): VideoTask[] => taskStore

export const setVideoTasks = (tasks: VideoTask[]): void => {
  taskStore = tasks
}

export const getVideoTask = (id: string): VideoTask | undefined =>
  taskStore.find((t) => t.id === id)

export const generateTaskId = (): string => {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
  const seq = String(taskStore.length + 1).padStart(4, '0')
  return `VP${dateStr}${seq}`
}

export const workspaceAssets = data.workspaceAssets
export const workspaceTimelineClips = data.workspaceTimelineClips

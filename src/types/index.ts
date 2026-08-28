export type TaskStatus = 'queued' | 'running' | 'completed' | 'failed' | 'waiting'
export type ProjectStatus = 'planning' | 'implementing' | 'operating' | 'completed' | 'paused'
export type ChannelStatus = 'connected' | 'disconnected' | 'configuring'

export interface BaseTask {
  id: string
  name: string
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

export interface VideoTask extends BaseTask {
  taskId: string
  fileName: string
  processType: string
  progress: number
  originalSize?: string
  outputSize?: string
  duration?: string
  resolution?: string
  fps?: string
  outputFormat?: string
  outputUrl?: string
  localVideoUrl?: string
}

export interface KeyFrame {
  id: string
  timestamp: string
  clarity: number
  similarity: number
}

export interface OcrSegment {
  timestamp: string
  text: string
}

export interface SpeechSegment {
  timestamp: string
  text: string
}

export interface SceneSegment {
  timeRange: string
  label: string
}

export interface VideoAnalysisResult {
  summary: string
  keywords: string[]
  scenes: SceneSegment[]
  keyFrames: KeyFrame[]
  ocrSegments: OcrSegment[]
  speechSegments: SpeechSegment[]
}

export interface VideoApiEndpoint {
  id: string
  name: string
  method: string
  path: string
  requestBody: string
  responseBody: string
}

export interface VideoPluginConfig {
  name: string
  version: string
  status: TaskStatus
  appKey: string
  appSecret: string
  signMethod: string
  ipWhitelist: string
  rateLimit: number
  maxConcurrency: number
  callbackUrl: string
  successCallback: boolean
  failCallback: boolean
}

export const VIDEO_PROCESS_TYPES = [
  '视频剪辑',
  '视频转码',
  '视频压缩',
  '关键帧提取',
  'OCR识别',
  '语音转文字',
  'AI视频摘要',
  '全量分析',
] as const

export type VideoProcessType = (typeof VIDEO_PROCESS_TYPES)[number]

export interface DataTask extends BaseTask {
  dataSource: string
  dataVolume: string
  processType?: string
  progress: number
}

export type DataSourceStatus = 'normal' | 'abnormal' | 'disabled'

export interface DataSourceItem {
  id: string
  name: string
  type: string
  address: string
  dataVolume: string
  accessMethod: string
  status: DataSourceStatus
  lastSync: string
}

export interface GovernanceTask {
  id: string
  name: string
  dataSource: string
  dataVolume: string
  cleanRules: string
  abnormalCount: number
  qualityScore: number
  status: TaskStatus
  progress: number
  createdAt: string
}

export interface SyncTaskItem {
  id: string
  name: string
  source: string
  target: string
  syncMode: string
  dataVolume: string
  frequency: string
  status: TaskStatus
  lastSync: string
}

export interface ReportItem {
  id: string
  name: string
  dataSource: string
  reportType: string
  updatedAt: string
  creator: string
  autoGenerate: boolean
}

export interface QualityAlert {
  id: string
  time: string
  dataSource: string
  alertType: string
  count: number
  severity: 'hint' | 'moderate' | 'critical'
  status: TaskStatus
}

export interface SystemUser {
  id: string
  username: string
  role: string
  status: TaskStatus
  lastLogin: string
}

export interface AiAnalysisResult {
  question: string
  conclusion: string
  findings: string[]
  suggestion: string
}

export interface AudioTask extends BaseTask {
  taskId?: string
  audioFile: string
  processType: string
  duration: string
  format?: string
  fileSize?: string
  sampleRate?: string
  bitrate?: string
  clipCount?: number
  progress?: number
}

export interface AudioClip {
  id: string
  name: string
  startSec: number
  endSec: number
  duration: string
}

export interface TranscriptSegment {
  timestamp: string
  speaker: string
  text: string
}

export interface ExtractedInfo {
  keywords: { text: string; source: string }[]
  points: { text: string; source: string }[]
  entities: { text: string; type: string; source: string }[]
  tasks: { text: string; assignee?: string; deadline?: string; source: string }[]
}

export interface AudioHistoryRecord {
  id: string
  time: string
  type: string
  fileName: string
  status: TaskStatus
  starred?: boolean
}

export interface AudioFileMeta {
  fileName: string
  format: string
  fileSize: string
  duration: string
  durationSec: number
  sampleRate: string
  bitrate: string
}

export interface CrawlerTask extends BaseTask {
  taskId?: string
  keyword: string
  keywords?: string[]
  logic?: 'and' | 'or' | 'not'
  source: string
  dataSource?: string
  collectCount: number
  collectedCount: number
  progress?: number
  scheduleType?: 'instant' | 'scheduled'
  scheduleFreq?: string
  timeRange?: string
  dataTypes?: string[]
  dedupeRate?: number
}

export interface CrawlerDataRecord {
  id: string
  title: string
  content: string
  publishTime: string
  source: string
  author?: string
  url: string
  dataType: string
  sentiment?: 'positive' | 'neutral' | 'negative'
  sourceLevel?: '一级' | '二级' | '三级'
  readCount?: number
  isDuplicate?: boolean
}

export interface CrawlerDataSource {
  id: string
  name: string
  type: 'search' | 'database'
  status: 'connected' | 'disconnected' | 'error'
  priority: number
  timeout: number
  rateLimit: number
  maxRetry: number
  isDefault?: boolean
}

export interface TrustedSource {
  id: string
  name: string
  url: string
  level: '一级' | '二级' | '三级'
  industry: string
}

export type OpinionLevel = 'urgent' | 'important' | 'normal'

export interface OpinionHotspot {
  id: string
  title: string
  summary: string
  level: OpinionLevel
  monitorTarget: string
  platforms: string[]
  publishCount: number
  interactionCount: number
  negativeRatio: number
  sentiment: string
  firstSeen: string
  spreadSpeed: string
  status: '未处理' | '处理中' | '已处理'
}

export interface AlertRecord {
  id: string
  time: string
  level: OpinionLevel
  title: string
  channel: string
  receiver: string
  pushStatus: 'success' | 'failed'
  handleStatus: '未处理' | '处理中' | '已处理'
}

export interface CrawlerSearchLog {
  id: string
  title: string
  time: string
  status: 'success' | 'failed'
  reason?: string
}

export type DocumentCategory = 'office' | 'multimodal'
export type DocumentType = 'office' | 'image' | 'scan' | 'audio' | 'video' | 'mixed'

export interface CleanDocument {
  id: string
  name: string
  fileType: string
  category: DocumentCategory
  docType: DocumentType
  pages?: number
  duration?: string
  fileSize: string
  status: TaskStatus
  confidence?: number
  batchId?: string
}

export interface CleanBatch {
  id: string
  batchNo: string
  name: string
  category: DocumentCategory
  submitter: string
  businessLine: string
  fileCount: number
  totalPages: number
  status: TaskStatus
  progress: number
  qualityRate?: number
  createdAt: string
  updatedAt: string
  taskId?: string
}

export interface PipelineStep {
  id: string
  layer: string
  name: string
  description: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
}

export interface QualityCheckItem {
  id: string
  field: string
  document: string
  issue: string
  confidence: number
  category: 'dedupe' | 'format' | 'structure'
  severity: 'low' | 'medium' | 'high'
  status: 'pending' | 'reviewed' | 'passed'
}

export interface DataCleanTask extends BaseTask {
  taskId?: string
  batchId?: string
  batchNo?: string
  dataSource: string
  category?: DocumentCategory
  originalCount: number
  validCount: number
  qualityRate: number
  progress: number
  dedupeScore?: number
  formatScore?: number
  structureScore?: number
  duplicateCount?: number
  abnormalCount?: number
}

export interface KnowledgeBase {
  id: string
  name: string
  description?: string
  category?: string
  docCount: number
  vectorCount: number
  fragmentCount?: number
  storage: string
  embeddingModel?: string
  status: TaskStatus
  updatedAt: string
  createdAt?: string
}

export interface KnowledgeDoc {
  id: string
  kbId: string
  name: string
  fileType: string
  size: string
  sliceCount: number
  status: TaskStatus
  processStep?: number
  updatedAt: string
}

export interface SyncTask {
  id: string
  name: string
  kbId: string
  kbName: string
  source: string
  target: string
  cron: string
  frequency: string
  docCount: number
  status: TaskStatus
  lastSync: string
  nextSync?: string
}

export interface ValidationRecord {
  id: string
  docName: string
  kbId: string
  kbName: string
  submitter: string
  submitTime: string
  content: string
  status: 'pending' | 'approved' | 'rejected'
  reviewer?: string
  reviewTime?: string
  comment?: string
}

export interface SearchHit {
  id: string
  title: string
  snippet: string
  kbId: string
  kbName: string
  docName: string
  score: number
  searchType: 'keyword' | 'semantic'
}

export interface QAPair {
  question: string
  answer: string
}

export interface Project {
  id: string
  name: string
  industry: string
  manager: string
  status: ProjectStatus
  progress: number
  startDate: string
  endDate: string
  description: string
}

export type TaskPriority = 'high' | 'medium' | 'low'
export type CollabTaskStatus = 'not_started' | 'in_progress' | 'completed' | 'pending_acceptance' | 'overdue' | 'archived' | 'paused' | 'terminated'

export interface CollabTask {
  id: string
  parentId?: string
  name: string
  description?: string
  priority: TaskPriority
  status: CollabTaskStatus
  progress: number
  owner: string
  participants: string[]
  watchers: string[]
  startDate: string
  endDate: string
  createdAt: string
  createdBy: string
  upstreamIds?: string[]
}

export interface TaskProgressLog {
  id: string
  taskId: string
  progress: number
  note: string
  operator: string
  time: string
}

export interface TaskDocument {
  id: string
  taskId: string
  name: string
  size: string
  folder: string
  updatedAt: string
  updatedBy: string
}

export interface TaskComment {
  id: string
  docId: string
  content: string
  author: string
  time: string
}

export interface TaskChatMessage {
  id: string
  taskId: string
  sender: string
  content: string
  time: string
}

export interface TaskNotification {
  id: string
  taskId: string
  type: 'change' | 'warning'
  content: string
  operator: string
  time: string
  read: boolean
}

export interface TaskLedger {
  id: string
  taskId: string
  taskName: string
  owner: string
  participants: string[]
  plannedEnd: string
  actualEnd: string
  acceptResult: string
  archivedAt: string
}

export interface TaskOperationLog {
  id: string
  taskId: string
  action: string
  operator: string
  time: string
  detail?: string
}

export interface Channel {
  id: string
  name: string
  icon: string
  status: ChannelStatus
  todaySent: number
  totalSent: number
}

export interface CommunityGroup {
  id: string
  name: string
  memberCount: number
  activity: number
  lastActive: string
  status: TaskStatus
}

export type MessageChannel = 'wechat' | 'wework' | 'sms' | 'email' | 'telegram' | 'web'
export type MessageStatus = 'unread' | 'read' | 'replied' | 'transferred'
export type LifecycleStage = 'new' | 'active' | 'silent' | 'churned' | 'vip'

export interface AggregatedMessage {
  id: string
  channel: string
  channelType: MessageChannel
  sender: string
  content: string
  receivedAt: string
  status: MessageStatus
  groupName?: string
}

export interface IntentRecord {
  intent: string
  confidence: number
  description: string
}

export interface PushTemplate {
  id: string
  name: string
  channel: string
  title: string
  content: string
  variables: string[]
  updatedAt: string
}

export interface UserPortrait {
  id: string
  userId: string
  nickname: string
  tags: string[]
  lifecycle: LifecycleStage
  lastActive: string
  messageCount: number
  responseRate: number
  preferredChannel: string
  strategyEffect?: number
}

export interface CommunityAlert {
  id: string
  time: string
  type: string
  title: string
  level: 'info' | 'warning' | 'critical'
  status: 'pending' | 'handled'
}

export interface DashboardTask {
  id: string
  name: string
  type: string
  status: TaskStatus
  createdAt: string
  route: string
}

export interface SearchParams {
  keyword?: string
  status?: string
  dateRange?: [string, string] | null
}

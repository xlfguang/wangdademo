import type {
  VideoTask,
  VideoAnalysisResult,
  VideoApiEndpoint,
  VideoPluginConfig,
} from '@/types'
import { randomFloat, randomInt } from '@/utils/mockApi'

export const videoPluginMeta = {
  name: '视频处理插件',
  description: '面向 AI Agent 提供视频处理、内容提取及智能分析能力',
  status: 'running' as const,
  version: 'v2.6.1',
}

export const videoOverviewStats = {
  totalTasks: randomInt(2200, 3800),
  runningTasks: randomInt(6, 30),
  processedVolume: `${randomFloat(1.2, 3.2, 1)} TB`,
  successRate: randomFloat(96, 99.5, 1),
  apiCalls: randomInt(32000, 62000),
}

export const videoCapabilities = [
  {
    title: '视频剪辑',
    description: '灵活裁剪与拼接视频片段',
    items: ['时间范围裁剪', '多片段剪辑', '视频拼接'],
  },
  {
    title: '视频转码',
    description: '多格式视频转码与编码优化',
    items: ['MP4', 'MOV', 'WebM', 'AVI', 'H.264 / H.265'],
  },
  {
    title: '视频压缩',
    description: '智能压缩减小文件体积',
    items: ['质量压缩', '目标大小压缩', '自定义码率'],
  },
  {
    title: '关键帧提取',
    description: '智能提取视频关键画面',
    items: ['定时提取', '场景切换提取', '黑屏 / 模糊帧过滤'],
  },
  {
    title: 'OCR / 语音识别',
    description: '视频文字与语音内容提取',
    items: ['视频文字识别', '语音转文字', '时间戳定位'],
  },
  {
    title: 'AI 视频分析',
    description: '大模型驱动的视频内容理解',
    items: ['视频摘要', '关键词提取', '场景分析'],
  },
]

/** 进度与任务状态保持一致：已完成固定 100，进行中随机 30-98，排队/失败按实际情况取值 */
const taskProgress = (status: VideoTask['status']): number => {
  switch (status) {
    case 'completed':
      return 100
    case 'running':
      return randomInt(30, 98)
    case 'queued':
      return 0
    case 'failed':
      return randomInt(5, 70)
    default:
      return randomInt(20, 80)
  }
}

/** 随机生成 mm:ss 或 hh:mm:ss 格式的时长 */
const randomDuration = (): string => {
  const total = randomInt(120, 7800) // 2 分钟 ~ 2 小时 10 分钟
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n: number): string => String(n).padStart(2, '0')
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}

/** 随机生成 MB / GB 格式的文件大小 */
const randomSize = (): string => {
  const mb = randomInt(80, 3800)
  return mb >= 1024 ? `${(mb / 1024).toFixed(1)} GB` : `${mb} MB`
}

export const videoTasks: VideoTask[] = [
  {
    id: 'v1',
    taskId: 'VP202608280001',
    name: '企业宣传视频 AI 全量分析',
    fileName: 'enterprise_promo_2026.mp4',
    processType: '全量分析',
    progress: taskProgress('running'),
    status: 'running',
    createdAt: '2026-08-28 10:32',
    updatedAt: '2026-08-28 10:45',
    originalSize: randomSize(),
    duration: randomDuration(),
    resolution: '1920x1080',
    fps: '30',
  },
  {
    id: 'v2',
    taskId: 'VP202608280002',
    name: '培训视频转码 H.265',
    fileName: 'training_session_08.mov',
    processType: '视频转码',
    progress: 100,
    status: 'completed',
    createdAt: '2026-08-28 09:20',
    updatedAt: '2026-08-28 09:35',
    originalSize: randomSize(),
    outputSize: '680 MB',
    duration: randomDuration(),
    resolution: '1920x1080',
    fps: '30',
    outputFormat: 'MP4',
    outputUrl: 'https://cdn.example.com/videos/training_session_08_h265.mp4',
  },
  {
    id: 'v3',
    taskId: 'VP202608280003',
    name: '发布会录像智能摘要',
    fileName: 'launch_event_full.mp4',
    processType: 'AI视频摘要',
    progress: taskProgress('running'),
    status: 'running',
    createdAt: '2026-08-28 08:50',
    updatedAt: '2026-08-28 09:10',
    originalSize: randomSize(),
    duration: randomDuration(),
    resolution: '3840x2160',
    fps: '60',
  },
  {
    id: 'v4',
    taskId: 'VP202608280004',
    name: '产品演示视频剪辑',
    fileName: 'product_intro_raw.mp4',
    processType: '视频剪辑',
    progress: 0,
    status: 'queued',
    createdAt: '2026-08-28 08:15',
    updatedAt: '2026-08-28 08:15',
    originalSize: randomSize(),
    duration: randomDuration(),
    resolution: '1920x1080',
    fps: '30',
  },
  {
    id: 'v5',
    taskId: 'VP202608270005',
    name: '品牌宣传片 OCR 识别',
    fileName: 'brand_video_final.webm',
    processType: 'OCR识别',
    progress: 100,
    status: 'completed',
    createdAt: '2026-08-27 16:40',
    updatedAt: '2026-08-27 17:20',
    originalSize: randomSize(),
    outputSize: '12 MB',
    duration: randomDuration(),
    resolution: '1920x1080',
    fps: '30',
    outputFormat: 'JSON',
    outputUrl: 'https://cdn.example.com/analysis/brand_video_ocr.json',
  },
  {
    id: 'v6',
    taskId: 'VP202608270006',
    name: '会议录像语音转写',
    fileName: 'weekly_meeting.m4a',
    processType: '语音转文字',
    progress: 100,
    status: 'completed',
    createdAt: '2026-08-27 14:00',
    updatedAt: '2026-08-27 14:30',
    originalSize: randomSize(),
    outputSize: '256 KB',
    duration: randomDuration(),
    outputFormat: 'SRT',
    outputUrl: 'https://cdn.example.com/transcripts/weekly_meeting.srt',
  },
  {
    id: 'v7',
    taskId: 'VP202608270007',
    name: '峰会录像关键帧提取',
    fileName: 'summit_recording.avi',
    processType: '关键帧提取',
    progress: taskProgress('failed'),
    status: 'failed',
    createdAt: '2026-08-27 11:00',
    updatedAt: '2026-08-27 11:15',
    originalSize: randomSize(),
    duration: randomDuration(),
    resolution: '1920x1080',
    fps: '25',
  },
]

export const videoAnalysis: VideoAnalysisResult = {
  summary:
    '本视频主要介绍企业级 AI 解决方案，围绕大模型、智能体和数据治理能力展开介绍。视频展示了平台的核心 AI 能力插件、知识库管理系统以及多个行业落地案例，重点强调了 AI Agent 如何通过 API 调用视频处理插件实现自动化内容分析。',
  keywords: ['AI', '大模型', '智能体', '数据治理', '知识库', '数字化'],
  scenes: [
    { timeRange: '00:00 - 00:15', label: '产品介绍' },
    { timeRange: '00:15 - 00:42', label: 'AI 能力展示' },
    { timeRange: '00:42 - 01:10', label: '知识库演示' },
    { timeRange: '01:10 - 01:45', label: '应用场景' },
  ],
  keyFrames: [
    { id: 'kf1', timestamp: '00:00:08', clarity: randomInt(84, 97), similarity: randomInt(80, 98) },
    { id: 'kf2', timestamp: '00:00:22', clarity: randomInt(80, 95), similarity: randomInt(75, 94) },
    { id: 'kf3', timestamp: '00:00:55', clarity: randomInt(86, 98), similarity: randomInt(82, 97) },
    { id: 'kf4', timestamp: '00:01:28', clarity: randomInt(82, 96), similarity: randomInt(78, 95) },
  ],
  ocrSegments: [
    { timestamp: '00:00:05', text: '网达智能体调度平台' },
    { timestamp: '00:00:18', text: '基于大模型的垂直行业智能化服务' },
    { timestamp: '00:00:35', text: '视频处理 · 数据分析 · 知识库管理' },
    { timestamp: '00:01:02', text: 'AI Agent 能力调用接口' },
    { timestamp: '00:01:22', text: '制造业 · 政务 · 金融 · 零售' },
  ],
  speechSegments: [
    { timestamp: '00:00:03', text: '大家好，欢迎来到我们的 AI 解决方案发布会。' },
    { timestamp: '00:00:20', text: '今天我将为大家展示企业级 AI 平台的核心能力。' },
    { timestamp: '00:00:48', text: '平台支持模块化 AI 插件，包括视频处理、数据分析等。' },
    { timestamp: '00:01:15', text: '通过知识库管理，企业可以快速构建 RAG 智能问答系统。' },
    { timestamp: '00:01:38', text: '目前我们已在制造、政务、金融等多个行业成功落地。' },
  ],
}

export const videoApiEndpoints: VideoApiEndpoint[] = [
  {
    id: 'process',
    name: '视频处理',
    method: 'POST',
    path: '/video/process',
    requestBody: JSON.stringify({
      video_url: 'https://example.com/video.mp4',
      process_type: 'transcode',
      params: { format: 'mp4', resolution: '1920x1080' },
    }, null, 2),
    responseBody: JSON.stringify({
      code: 200,
      message: 'success',
      task_id: 'VP202608280001',
      status: 'processing',
    }, null, 2),
  },
  {
    id: 'transcode',
    name: '视频转码',
    method: 'POST',
    path: '/video/transcode',
    requestBody: JSON.stringify({
      video_url: 'https://example.com/video.mov',
      target_format: 'mp4',
      codec: 'h265',
      resolution: '1920x1080',
      fps: 30,
    }, null, 2),
    responseBody: JSON.stringify({
      code: 200,
      message: 'success',
      task_id: 'VP202608280002',
      status: 'processing',
    }, null, 2),
  },
  {
    id: 'compress',
    name: '视频压缩',
    method: 'POST',
    path: '/video/compress',
    requestBody: JSON.stringify({
      video_url: 'https://example.com/video.mp4',
      quality: 80,
      target_size_mb: 100,
    }, null, 2),
    responseBody: JSON.stringify({
      code: 200,
      message: 'success',
      task_id: 'VP202608280003',
      status: 'processing',
    }, null, 2),
  },
  {
    id: 'keyframes',
    name: '关键帧提取',
    method: 'POST',
    path: '/video/keyframes',
    requestBody: JSON.stringify({
      video_url: 'https://example.com/video.mp4',
      mode: 'scene_change',
      filter_blur: true,
    }, null, 2),
    responseBody: JSON.stringify({
      code: 200,
      message: 'success',
      task_id: 'VP202608280004',
      status: 'processing',
    }, null, 2),
  },
  {
    id: 'ocr',
    name: 'OCR 识别',
    method: 'POST',
    path: '/video/ocr',
    requestBody: JSON.stringify({
      video_url: 'https://example.com/video.mp4',
      language: 'zh-CN',
    }, null, 2),
    responseBody: JSON.stringify({
      code: 200,
      message: 'success',
      task_id: 'VP202608280005',
      status: 'processing',
    }, null, 2),
  },
  {
    id: 'summary',
    name: 'AI 摘要',
    method: 'POST',
    path: '/video/summary',
    requestBody: JSON.stringify({
      video_url: 'https://example.com/video.mp4',
      options: { keywords: true, scenes: true },
    }, null, 2),
    responseBody: JSON.stringify({
      code: 200,
      message: 'success',
      task_id: 'VP202608280006',
      status: 'processing',
    }, null, 2),
  },
  {
    id: 'query',
    name: '任务查询',
    method: 'GET',
    path: '/video/task/{task_id}',
    requestBody: JSON.stringify({ task_id: 'VP202608280001' }, null, 2),
    responseBody: JSON.stringify({
      code: 200,
      message: 'success',
      data: {
        task_id: 'VP202608280001',
        status: 'completed',
        progress: 100,
        output_url: 'https://cdn.example.com/output.mp4',
      },
    }, null, 2),
  },
  {
    id: 'cancel',
    name: '任务取消',
    method: 'POST',
    path: '/video/task/{task_id}/cancel',
    requestBody: JSON.stringify({ task_id: 'VP202608280001' }, null, 2),
    responseBody: JSON.stringify({
      code: 200,
      message: 'success',
      task_id: 'VP202608280001',
      status: 'cancelled',
    }, null, 2),
  },
]

export const videoPluginConfig: VideoPluginConfig = {
  name: '视频处理插件',
  version: 'v2.6.1',
  status: 'running',
  appKey: 'vp_app_key_20260828',
  appSecret: 'vp_secret_************************',
  signMethod: 'HMAC-SHA256',
  ipWhitelist: '192.168.1.0/24, 10.0.0.0/8',
  rateLimit: 1000,
  maxConcurrency: 50,
  callbackUrl: 'https://agent.example.com/callback/video',
  successCallback: true,
  failCallback: true,
}

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

export const workspaceAssets = [
  { id: 'wa1', name: 'enterprise_promo.mp4', duration: '05:32', size: '856 MB' },
  { id: 'wa2', name: 'product_launch_clip.mov', duration: '02:18', size: '412 MB' },
  { id: 'wa3', name: 'training_recording.mp4', duration: '12:45', size: '1.2 GB' },
  { id: 'wa4', name: 'customer_testimonial.webm', duration: '01:52', size: '186 MB' },
]

export const workspaceTimelineClips = [
  { id: 'c1', track: 'video' as const, label: '片头', start: 0, end: 8, color: '#1677ff' },
  { id: 'c2', track: 'video' as const, label: '主内容', start: 8, end: 72, color: '#4096ff' },
  { id: 'c3', track: 'video' as const, label: '片尾', start: 72, end: 85, color: '#69b1ff' },
  { id: 'c4', track: 'audio' as const, label: '旁白', start: 0, end: 85, color: '#7c5cfc' },
  { id: 'c5', track: 'audio' as const, label: 'BGM', start: 5, end: 80, color: '#9254de' },
]


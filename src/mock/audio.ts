import type { AudioTask, TranscriptSegment, ExtractedInfo, AudioHistoryRecord } from '@/types'
import { randomInt } from '@/utils/mockApi'

export const audioPluginMeta = {
  name: '音频交互处理插件',
  description: '面向 AI Agent 提供轻量化音频处理与智能内容提取能力',
  status: 'running' as const,
  version: 'v1.8.0',
}

export const audioOverviewStats = {
  totalTasks: randomInt(1400, 2600),
  todayProcessed: randomInt(20, 90),
  totalTranscriptHours: `${randomInt(240, 480)}h`,
  accuracyRate: randomInt(94, 99),
  apiCalls: randomInt(8000, 20000),
}

export const audioScenarios = [
  { title: '会议纪要', description: '会议录音转写，自动提取议题、决议与责任人', items: ['语音转文字', '要点提取', '任务识别', '时间戳定位'] },
  { title: '访谈提炼', description: '访谈音频转写，提取核心观点与关键表述', items: ['多说话人', '观点摘要', '实体识别'] },
  { title: '课程讲座', description: '课程录音转写，梳理知识点与核心结论', items: ['章节裁剪', '知识提取', '笔记导出'] },
  { title: '客服录音', description: '通话录音分析，识别客户需求与投诉要点', items: ['需求提取', '投诉分类', '质量评估'] },
  { title: '个人笔记', description: '个人录音转写，整理关键信息便于归档', items: ['快速转写', '关键词', 'TXT 导出'] },
]

/** 进度与任务状态保持一致：已完成固定 100，进行中随机 30-98，排队中固定 0 */
const taskProgress = (status: AudioTask['status']): number => {
  switch (status) {
    case 'completed':
      return 100
    case 'running':
      return randomInt(30, 98)
    case 'queued':
      return 0
    default:
      return randomInt(5, 90)
  }
}

/** 随机生成 mm:ss 格式的时长 */
const randomDuration = (): string =>
  `${String(randomInt(3, 150)).padStart(2, '0')}:${String(randomInt(0, 59)).padStart(2, '0')}`

export const audioTasks: AudioTask[] = [
  { id: 'a1', taskId: 'AU202608280001', name: '产品发布会会议纪要', audioFile: 'launch_meeting_2026.wav', processType: '语音转文字+提取', duration: randomDuration(), format: 'WAV', fileSize: `${randomInt(20, 160)} MB`, status: 'completed', progress: 100, clipCount: randomInt(2, 8), createdAt: '2026-08-28 09:15', updatedAt: '2026-08-28 09:45' },
  { id: 'a2', taskId: 'AU202608280002', name: '客服通话录音分析', audioFile: 'call_batch_08.mp3', processType: '语音转文字', duration: randomDuration(), format: 'MP3', fileSize: `${randomInt(20, 90)} MB`, status: 'running', progress: taskProgress('running'), clipCount: randomInt(4, 20), createdAt: '2026-08-28 08:30', updatedAt: '2026-08-28 10:00' },
  { id: 'a3', taskId: 'AU202608280003', name: '科研人员访谈提炼', audioFile: 'research_interview.mp3', processType: '关键信息提取', duration: randomDuration(), format: 'MP3', fileSize: `${randomInt(15, 70)} MB`, status: 'completed', progress: 100, clipCount: randomInt(2, 8), createdAt: '2026-08-27 17:00', updatedAt: '2026-08-27 17:30' },
  { id: 'a4', taskId: 'AU202608270004', name: '培训课程重点提取', audioFile: 'training_course_03.wav', processType: '语音转文字', duration: randomDuration(), format: 'WAV', fileSize: `${randomInt(60, 180)} MB`, status: 'running', progress: taskProgress('running'), clipCount: randomInt(3, 12), createdAt: '2026-08-27 14:00', updatedAt: '2026-08-28 08:00' },
  { id: 'a5', taskId: 'AU202608270005', name: '个人学习笔记整理', audioFile: 'study_notes.mp3', processType: '语音转文字', duration: randomDuration(), format: 'MP3', fileSize: `${randomInt(3, 20)} MB`, status: 'queued', progress: 0, clipCount: 1, createdAt: '2026-08-27 11:00', updatedAt: '2026-08-27 11:00' },
]

export const transcriptMock: TranscriptSegment[] = [
  { timestamp: '00:00:05', speaker: '说话人1', text: '各位同事大家好，今天我们主要讨论 Q3 产品路线图和 AI 能力插件的交付计划。' },
  { timestamp: '00:00:32', speaker: '说话人2', text: '我先汇报一下音频交互插件的进展，目前已完成上传、裁剪和语音转文字的核心流程。' },
  { timestamp: '00:01:15', speaker: '说话人1', text: '会议纪要需要在本周五前完成，责任人张三，时间节点 2026-08-30。' },
  { timestamp: '00:02:08', speaker: '说话人3', text: '客服团队反馈，通话录音分析功能对质量评估很有帮助，建议优先上线。' },
  { timestamp: '00:03:22', speaker: '说话人2', text: '关键信息提取准确率目标是不低于 90%，目前系统已满足业务需求。' },
  { timestamp: '00:04:10', speaker: '说话人1', text: '会议决议：下周完成音频插件验收，并同步至智能体平台。' },
]

export const extractionMock: ExtractedInfo = {
  keywords: [
    { text: '产品路线图', source: '00:00:05' },
    { text: 'AI 能力插件', source: '00:00:05' },
    { text: '语音转文字', source: '00:00:32' },
    { text: '关键信息提取', source: '00:03:22' },
    { text: '客服录音分析', source: '00:02:08' },
  ],
  points: [
    { text: '音频交互插件已完成上传、裁剪、转写核心流程', source: '00:00:32' },
    { text: '客服团队希望优先上线通话录音分析功能', source: '00:02:08' },
    { text: '会议决议：下周完成插件验收并同步至智能体平台', source: '00:04:10' },
  ],
  entities: [
    { text: '张三', type: '人名', source: '00:01:15' },
    { text: '2026-08-30', type: '日期', source: '00:01:15' },
    { text: '90%', type: '数字', source: '00:03:22' },
    { text: '智能体平台', type: '组织机构', source: '00:04:10' },
  ],
  tasks: [
    { text: '完成会议纪要', assignee: '张三', deadline: '2026-08-30', source: '00:01:15' },
    { text: '完成音频插件验收', assignee: '项目组', deadline: '下周', source: '00:04:10' },
  ],
}

export const historyRecords: AudioHistoryRecord[] = [
  { id: 'h1', time: '2026-08-28 09:45', type: '关键信息提取', fileName: 'launch_meeting_2026.wav', status: 'completed', starred: true },
  { id: 'h2', time: '2026-08-28 09:30', type: '语音转文字', fileName: 'launch_meeting_2026.wav', status: 'completed', starred: true },
  { id: 'h3', time: '2026-08-28 09:15', type: '音频裁剪', fileName: 'launch_meeting_2026.wav', status: 'completed' },
  { id: 'h4', time: '2026-08-28 09:10', type: '音频上传', fileName: 'launch_meeting_2026.wav', status: 'completed' },
  { id: 'h5', time: '2026-08-28 08:30', type: '语音转文字', fileName: 'call_batch_08.mp3', status: 'running' },
  { id: 'h6', time: '2026-08-27 17:30', type: '关键信息提取', fileName: 'research_interview.mp3', status: 'completed' },
  { id: 'h7', time: '2026-08-27 14:00', type: '音频上传', fileName: 'training_course_03.wav', status: 'failed' },
]

export const audioSettingsDefault = {
  exportFormat: 'txt',
  saveFormat: 'mp3',
  language: 'zh-CN',
  multiSpeaker: true,
  extractCategories: ['keywords', 'points', 'entities', 'tasks'],
  cacheLimit: 500,
}

export const getAudioTask = (id: string): AudioTask | undefined =>
  audioTasks.find((t) => t.id === id)

export const voiceProfiles = [
  { id: 'v1', name: '标准女声', desc: '清晰自然，适合通用场景', tag: '推荐' },
  { id: 'v2', name: '标准男声', desc: '沉稳专业，适合播报场景', tag: '' },
  { id: 'v3', name: '商务女声', desc: '亲和力强，适合客服与会议', tag: '热门' },
  { id: 'v4', name: '专属定制音色', desc: '上传 10s 样本克隆专属音色', tag: '定制' },
]

export const synthesisScenarios: Record<string, { title: string; template: string }> = {
  meeting: {
    title: '会议纪要生成',
    template: '各位同事大家好，本次会议主要讨论了 Q3 产品路线图与 AI 能力插件交付计划。会议决议：下周完成音频插件验收，责任人张三，截止 2026-08-30。',
  },
  reply: {
    title: '语音交互回复',
    template: '您好，已收到您的咨询。根据知识库内容，平台目前支持视频处理、数据处理、音频交互等模块化 AI 能力。如需进一步帮助，请随时联系在线客服。',
  },
}

export const synthesisHistory = [
  { id: 'sh1', text: '会议纪要 — Q3 产品路线图讨论', voice: '商务女声', duration: '00:28', createdAt: '2026-08-28 10:15' },
  { id: 'sh2', text: '客服话术 — 账号重置指引', voice: '标准女声', duration: '00:15', createdAt: '2026-08-28 09:40' },
  { id: 'sh3', text: '产品发布旁白', voice: '标准男声', duration: '00:42', createdAt: '2026-08-27 16:20' },
]


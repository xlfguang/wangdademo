import type { DeepLinkParams } from '@/utils/deepLink'

export interface CapabilityLink {
  path: string
  params?: DeepLinkParams
}

export const videoCapabilityLinks: Record<string, CapabilityLink> = {
  '视频剪辑': { path: '/video/workspace' },
  '视频转码': { path: '/video/tasks', params: { action: 'create', processType: '视频转码' } },
  '视频压缩': { path: '/video/tasks', params: { action: 'create', processType: '视频压缩' } },
  '关键帧提取': { path: '/video/tasks', params: { action: 'create', processType: '关键帧提取' } },
  'OCR / 语音识别': { path: '/video/tasks', params: { action: 'create', processType: '全量分析' } },
  'AI 视频分析': { path: '/video/analysis' },
}

export const audioScenarioLinks: Record<string, CapabilityLink> = {
  '会议纪要': { path: '/audio/synthesis', params: { scenario: 'meeting' } },
  '访谈提炼': { path: '/audio/workspace', params: { action: 'upload', next: 'extraction' } },
  '课程讲座': { path: '/audio/transcription' },
  '客服录音': { path: '/audio/extraction' },
  '个人笔记': { path: '/audio/transcription' },
}

export const crawlerScenarioLinks: Record<string, CapabilityLink> = {
  '行业趋势调研': { path: '/crawler/search', params: { action: 'focus', keyword: '人工智能 政策动态' } },
  '品牌舆情监控': { path: '/crawler/opinion', params: { action: 'detail' } },
  '竞品动态追踪': { path: '/crawler/schedules' },
  '政策法规采集': { path: '/crawler/sources', params: { action: 'test' } },
  '学术情报收集': { path: '/crawler/sources' },
}

export const communityScenarioLinks: Record<string, CapabilityLink> = {
  '多平台消息聚合': { path: '/community/inbox' },
  'AI 智能回复': { path: '/community/ai-reply' },
  '多渠道精准推送': { path: '/community/push' },
  '用户画像运营': { path: '/community/portrait' },
  '社群运营监控': { path: '/community/settings' },
}

export const dataCleanScenarioLinks: Record<string, CapabilityLink> = {
  '产品资料库清洗': { path: '/data-clean/upload', params: { category: 'office', batchName: '产品资料库清洗批次' } },
  '政策文件结构化': { path: '/data-clean/upload', params: { category: 'office', batchName: '政策文件结构化批次' } },
  '多模态客服资料': { path: '/data-clean/upload', params: { category: 'multimodal', batchName: '多模态客服资料批次' } },
  '影像档案数字化': { path: '/data-clean/pipeline' },
  '跨版本文档治理': { path: '/data-clean/batches' },
  '超量应急清洗': { path: '/data-clean/upload', params: { action: 'negotiate' } },
}

export const knowledgeScenarioLinks: Record<string, CapabilityLink> = {
  '企业知识库构建': { path: '/knowledge/bases', params: { action: 'create' } },
  '产品文档管理': { path: '/knowledge/base/kb1' },
  '客服知识赋能': { path: '/knowledge/validation', params: { action: 'review' } },
  '行业情报沉淀': { path: '/knowledge/sync' },
  '政务知识服务': { path: '/knowledge/validation', params: { action: 'review' } },
}

export const taskScenarioLinks: Record<string, CapabilityLink> = {
  '项目拆解分工': { path: '/task/tasks', params: { action: 'create' } },
  '进度透明管控': { path: '/task/tracking', params: { action: 'update' } },
  '资料在线协作': { path: '/task/docs' },
  '跨岗实时联动': { path: '/task/collab' },
  '成果闭环归档': { path: '/task/closure', params: { action: 'accept' } },
}

export const dataStatLinks: Record<string, CapabilityLink> = {
  '数据源数量': { path: '/data/sources', params: { action: 'create' } },
  '今日接入数据量': { path: '/data/sources' },
  '数据处理任务': { path: '/data/governance', params: { action: 'create' } },
  '数据质量评分': { path: '/data/quality' },
  '异常数据量': { path: '/data/quality' },
  'API 调用次数': { path: '/data/system' },
}

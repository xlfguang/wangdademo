import type {
  DataCleanTask, CleanBatch, CleanDocument, PipelineStep, QualityCheckItem,
} from '@/types'

export const dataCleanPluginMeta = {
  name: '数据清洗服务',
  description: '面向 AI Agent 提供文档去重、格式统一与结构化清洗能力，支撑知识资产治理',
  status: 'running' as const,
  version: 'v1.8.0',
}

export const dataCleanOverviewStats = {
  totalBatches: 1860,
  todayProcessed: 428,
  runningBatches: 12,
  qualityPassRate: 96.8,
  apiCalls: 28500,
}

export const dataCleanScenarios = [
  { title: '产品资料库清洗', description: 'Word/PDF 混合存储的产品说明书批量去重，统一为结构化参数表', items: ['复杂表格', '版本去重', '字段抽取', '知识库对接'] },
  { title: '政策文件结构化', description: 'PDF 与扫描件 OCR 后抽取发文机关、生效日期等关键字段', items: ['扫描 OCR', '字段抽取', '低置信复核', '政策检索'] },
  { title: '多模态客服资料', description: '培训录音与演示视频转写，抽取 FAQ 与标准话术', items: ['语音转写', '关键帧 OCR', '时间戳', '知识条目'] },
  { title: '影像档案数字化', description: '历史合同、票据扫描件 OCR 结构化并去重，支撑法务检索', items: ['图片预处理', '表格还原', '语义去重', '溯源追踪'] },
  { title: '跨版本文档治理', description: '识别同一制度的不同版本，保留最新并标注演进关系', items: ['语义去重', '版本标注', '保留策略', '审计留痕'] },
  { title: '超量应急清洗', description: '合规核查等超配额场景，协商扩容与加急排期', items: ['配额协商', '分批处理', '加急通道', 'SLA 区分'] },
]

export const quotaLimits = {
  office: { maxFiles: 50, maxPagesPerFile: 50 },
  multimodal: { maxEquivalentPages: 20, minutesPerPage: 1 },
}

export const pipelineLayers: PipelineStep[] = [
  { id: 'p1', layer: '接入层', name: '文件上传与配额校验', description: '拖拽上传、元数据登记、份数/页数预校验', status: 'completed', progress: 100 },
  { id: 'p2', layer: '识别层', name: '文档类型识别', description: '判别办公/多模态及细分模态，下发路由指令', status: 'completed', progress: 100 },
  { id: 'p3', layer: '清洗层', name: '解析与转化', description: '文本/表格解析、OCR/转写/关键帧提取、去重与格式统一', status: 'running', progress: 72 },
  { id: 'p4', layer: '结构化层', name: '字段抽取与映射', description: '表格数据集映射、关键字段 schema 抽取与置信度标注', status: 'pending', progress: 0 },
  { id: 'p5', layer: '质检层', name: '自动质检与复核', description: '去重/格式/结构化三维评分，标记低置信项', status: 'pending', progress: 0 },
  { id: 'p6', layer: '输出层', name: '结果导出与对接', description: '生成 JSON/CSV/Excel 与可读报告，保留溯源信息', status: 'pending', progress: 0 },
]

export const cleanSteps = [
  '数据导入',
  '类型识别',
  '清洗转化',
  '结构化',
  '质量校验',
  '清洗完成',
]

export const qualityReport = {
  dedupeScore: 97.2,
  formatScore: 95.8,
  structureScore: 94.5,
  overallScore: 96.8,
  original: 100000,
  valid: 96820,
  duplicate: 2180,
  abnormal: 1000,
  qualityRate: 96.8,
}

export const qualityCheckItems: QualityCheckItem[] = [
  { id: 'q1', field: '生效日期', document: '行业监管政策汇编.pdf', issue: 'OCR 识别置信度偏低，日期格式待确认', confidence: 68, category: 'structure', severity: 'medium', status: 'pending' },
  { id: 'q2', field: '产品型号', document: '产品规格书_v2.docx', issue: '表格跨页合并单元格还原不完整', confidence: 72, category: 'structure', severity: 'medium', status: 'pending' },
  { id: 'q3', field: '—', document: '培训录音_202603.mp3', issue: '背景噪声较大，转写文本部分段落低置信', confidence: 65, category: 'format', severity: 'high', status: 'pending' },
  { id: 'q4', field: '—', document: '制度文件_v1.pdf', issue: '与 v3 版本语义相似度 0.94，已标注同源历史', confidence: 94, category: 'dedupe', severity: 'low', status: 'reviewed' },
  { id: 'q5', field: '计量单位', document: '供应链参数表.xlsx', issue: '「千克」「公斤」混用，已统一为 kg', confidence: 88, category: 'format', severity: 'low', status: 'passed' },
  { id: 'q6', field: '责任主体', document: '合同扫描件_008.jpg', issue: '印章遮挡导致字段抽取失败', confidence: 55, category: 'structure', severity: 'high', status: 'pending' },
]

export const cleanDocuments: CleanDocument[] = [
  { id: 'doc1', name: '产品说明书_v3.docx', fileType: 'Word', category: 'office', docType: 'office', pages: 32, fileSize: '2.4 MB', status: 'completed', confidence: 96, batchId: 'b1' },
  { id: 'doc2', name: '行业监管政策汇编.pdf', fileType: 'PDF', category: 'office', docType: 'office', pages: 48, fileSize: '8.1 MB', status: 'running', confidence: 82, batchId: 'b1' },
  { id: 'doc3', name: '产品规格书_v2.docx', fileType: 'Word', category: 'office', docType: 'office', pages: 18, fileSize: '1.2 MB', status: 'completed', confidence: 91, batchId: 'b1' },
  { id: 'doc4', name: '合同扫描件_008.jpg', fileType: '图片', category: 'multimodal', docType: 'scan', pages: 2, fileSize: '3.5 MB', status: 'running', confidence: 71, batchId: 'b2' },
  { id: 'doc5', name: '培训录音_202603.mp3', fileType: '音频', category: 'multimodal', docType: 'audio', duration: '12:35', fileSize: '18 MB', status: 'running', confidence: 78, batchId: 'b2' },
  { id: 'doc6', name: '客服演示录屏.mp4', fileType: '视频', category: 'multimodal', docType: 'video', duration: '08:20', pages: 8, fileSize: '156 MB', status: 'queued', confidence: 0, batchId: 'b2' },
]

export const cleanBatches: CleanBatch[] = [
  { id: 'b1', batchNo: 'DC202608280001', name: '产品资料库清洗批次', category: 'office', submitter: '张产品', businessLine: '产品中心', fileCount: 28, totalPages: 620, status: 'running', progress: 72, qualityRate: 96.2, createdAt: '2026-08-28 08:50', updatedAt: '2026-08-28 10:20', taskId: 'dc1' },
  { id: 'b2', batchNo: 'DC202608280002', name: '多模态客服资料批次', category: 'multimodal', submitter: '李运营', businessLine: '客服中心', fileCount: 8, totalPages: 16, status: 'running', progress: 45, createdAt: '2026-08-28 09:15', updatedAt: '2026-08-28 10:05', taskId: 'dc4' },
  { id: 'b3', batchNo: 'DC202608270003', name: '政策文件结构化批次', category: 'office', submitter: '王合规', businessLine: '合规部', fileCount: 35, totalPages: 890, status: 'completed', progress: 100, qualityRate: 97.9, createdAt: '2026-08-27 14:00', updatedAt: '2026-08-27 16:30', taskId: 'dc2' },
  { id: 'b4', batchNo: 'DC202608260004', name: '供应链文档治理批次', category: 'office', submitter: '赵采购', businessLine: '供应链', fileCount: 42, totalPages: 1250, status: 'completed', progress: 100, qualityRate: 95.4, createdAt: '2026-08-26 10:00', updatedAt: '2026-08-26 18:00', taskId: 'dc3' },
  { id: 'b5', batchNo: 'DC202608280005', name: '影像档案数字化批次', category: 'multimodal', submitter: '陈法务', businessLine: '法务部', fileCount: 15, totalPages: 18, status: 'queued', progress: 0, createdAt: '2026-08-28 10:30', updatedAt: '2026-08-28 10:30' },
]

export const dataCleanTasks: DataCleanTask[] = [
  {
    id: 'dc1', taskId: 'DC202608280001', batchId: 'b1', batchNo: 'DC202608280001',
    name: '产品资料库清洗', dataSource: '产品中心', category: 'office',
    originalCount: 28, validCount: 26, duplicateCount: 2, abnormalCount: 0,
    qualityRate: 96.2, dedupeScore: 97.5, formatScore: 96.0, structureScore: 95.1,
    progress: 72, status: 'running', createdAt: '2026-08-28 08:50', updatedAt: '2026-08-28 10:20',
  },
  {
    id: 'dc2', taskId: 'DC202608270003', batchId: 'b3', batchNo: 'DC202608270003',
    name: '政策文件结构化', dataSource: '合规部', category: 'office',
    originalCount: 35, validCount: 34, duplicateCount: 1, abnormalCount: 0,
    qualityRate: 97.9, dedupeScore: 98.2, formatScore: 97.5, structureScore: 97.8,
    progress: 100, status: 'completed', createdAt: '2026-08-27 14:00', updatedAt: '2026-08-27 16:30',
  },
  {
    id: 'dc3', taskId: 'DC202608260004', batchId: 'b4', batchNo: 'DC202608260004',
    name: '供应链文档治理', dataSource: '供应链', category: 'office',
    originalCount: 42, validCount: 40, duplicateCount: 2, abnormalCount: 0,
    qualityRate: 95.4, dedupeScore: 96.8, formatScore: 95.2, structureScore: 94.0,
    progress: 100, status: 'completed', createdAt: '2026-08-26 10:00', updatedAt: '2026-08-26 18:00',
  },
  {
    id: 'dc4', taskId: 'DC202608280002', batchId: 'b2', batchNo: 'DC202608280002',
    name: '多模态客服资料清洗', dataSource: '客服中心', category: 'multimodal',
    originalCount: 8, validCount: 6, duplicateCount: 0, abnormalCount: 2,
    qualityRate: 88.5, dedupeScore: 92.0, formatScore: 87.5, structureScore: 86.0,
    progress: 45, status: 'running', createdAt: '2026-08-28 09:15', updatedAt: '2026-08-28 10:05',
  },
]

export const dataCleanSettingsDefault = {
  officeMaxFiles: 50,
  officeMaxPagesPerFile: 50,
  multimodalMaxPages: 20,
  minutesPerPage: 1,
  dedupeThreshold: 0.92,
  formatRules: 'standard',
  structureConfidenceThreshold: 85,
  enableNegotiation: true,
  regularSlaHours: 24,
  urgentSlaHours: 4,
  autoRetry: true,
  maxRetry: 3,
}

export const negotiationRecords = [
  { id: 'n1', batchNo: 'DC202608150001', reason: '合规核查超量（68 份办公文档）', status: '已确认', result: '分两批处理，加急 SLA 4 小时', time: '2026-08-15 14:30' },
  { id: 'n2', batchNo: 'DC202608200002', reason: '多模态批次等效页数 25 页超限', status: '协商中', result: '—', time: '2026-08-20 09:00' },
]

export const getDataCleanTask = (id: string): DataCleanTask | undefined =>
  dataCleanTasks.find((t) => t.id === id)

export const getCleanBatch = (id: string): CleanBatch | undefined =>
  cleanBatches.find((b) => b.id === id)

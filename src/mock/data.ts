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

export const dataPluginMeta = {
  name: '数据处理插件',
  description: '多源数据接入、数据治理、数据分析与 AI 智能洞察的企业级数据中台',
  version: 'v3.2.0',
}

export const dataOverviewStats = {
  sourceCount: 28,
  todayVolume: '2.4 TB',
  taskCount: 156,
  qualityScore: 96.8,
  abnormalCount: 842,
  apiCalls: 32400,
}

export const dataTrend = {
  dates: ['08-22', '08-23', '08-24', '08-25', '08-26', '08-27', '08-28'],
  ingest: [820, 960, 880, 1120, 1050, 1180, 1240],
  process: [780, 920, 850, 1080, 1020, 1150, 1200],
}

export const dataSourceDistribution = [
  { name: 'MySQL', value: 8200 },
  { name: 'PostgreSQL', value: 5600 },
  { name: 'Excel', value: 3200 },
  { name: 'CSV', value: 2800 },
  { name: 'API', value: 4500 },
  { name: 'MQTT', value: 1200 },
  { name: '文件', value: 2100 },
]

export const qualityOverview = {
  completeness: 96.8,
  accuracy: 94.2,
  consistency: 97.5,
  uniqueness: 98.1,
}

export const dataSources: DataSourceItem[] = [
  { id: 'ds1', name: 'CRM 客户数据库', type: 'MySQL', address: '192.168.1.101:3306/crm', dataVolume: '128,500 条', accessMethod: 'JDBC', status: 'normal', lastSync: '2026-08-28 10:30' },
  { id: 'ds2', name: 'ERP 销售系统', type: 'PostgreSQL', address: '192.168.1.102:5432/erp', dataVolume: '56,200 条', accessMethod: 'JDBC', status: 'normal', lastSync: '2026-08-28 10:15' },
  { id: 'ds3', name: '用户行为日志', type: 'API', address: 'https://api.example.com/logs', dataVolume: '2,340,000 条', accessMethod: 'REST API', status: 'normal', lastSync: '2026-08-28 10:00' },
  { id: 'ds4', name: '供应链 Excel 导入', type: 'Excel', address: '/data/import/supply_chain.xlsx', dataVolume: '12,800 条', accessMethod: '文件上传', status: 'normal', lastSync: '2026-08-27 18:00' },
  { id: 'ds5', name: 'IoT 设备数据', type: 'MQTT', address: 'mqtt://broker.example.com:1883', dataVolume: '890,000 条', accessMethod: '消息订阅', status: 'abnormal', lastSync: '2026-08-27 14:30' },
  { id: 'ds6', name: '历史归档库', type: 'Oracle', address: '192.168.1.105:1521/archive', dataVolume: '5,600,000 条', accessMethod: 'JDBC', status: 'disabled', lastSync: '2026-08-20 09:00' },
  { id: 'ds7', name: '外部行业 API', type: 'JSON', address: 'https://api.industry.com/v2/data', dataVolume: '89,600 条', accessMethod: 'REST API', status: 'normal', lastSync: '2026-08-28 08:45' },
  { id: 'ds8', name: '对象存储备份', type: 'OSS', address: 'oss://data-backup/example', dataVolume: '1.2 TB', accessMethod: 'OSS SDK', status: 'normal', lastSync: '2026-08-28 06:00' },
]

export const governanceTasks: GovernanceTask[] = [
  { id: 'g1', name: 'CRM 客户数据治理', dataSource: 'CRM 客户数据库', dataVolume: '128,420 条', cleanRules: '缺失值+去重+异常检测', abnormalCount: 842, qualityScore: 96.8, status: 'completed', progress: 100, createdAt: '2026-08-28 10:18' },
  { id: 'g2', name: '销售数据标准化', dataSource: 'ERP 销售系统', dataVolume: '56,200 条', cleanRules: '格式标准化+类型转换', abnormalCount: 320, qualityScore: 94.5, status: 'running', progress: 72, createdAt: '2026-08-28 09:30' },
  { id: 'g3', name: '用户行为数据清洗', dataSource: '用户行为日志', dataVolume: '2,340,000 条', cleanRules: '异常值检测+去重', abnormalCount: 12500, qualityScore: 92.1, status: 'running', progress: 35, createdAt: '2026-08-28 08:00' },
  { id: 'g4', name: '供应链数据整合', dataSource: '供应链 Excel 导入', dataVolume: '12,800 条', cleanRules: '缺失值+格式标准化', abnormalCount: 156, qualityScore: 97.2, status: 'completed', createdAt: '2026-08-27 16:00', progress: 100 },
  { id: 'g5', name: 'IoT 数据质量校验', dataSource: 'IoT 设备数据', dataVolume: '890,000 条', cleanRules: '异常检测+时间戳校验', abnormalCount: 8900, qualityScore: 88.5, status: 'failed', progress: 45, createdAt: '2026-08-27 14:00' },
]

export const governanceResult = {
  original: 128420,
  valid: 124861,
  cleaned: 3559,
  duplicate: 1203,
  abnormal: 842,
  missing: 1514,
  qualityScore: 96.8,
  beforeAfter: {
    dimensions: ['完整性', '准确性', '一致性', '唯一性'],
    before: [92.1, 89.5, 91.2, 94.8],
    after: [96.8, 94.2, 97.5, 98.1],
  },
  issueDistribution: [
    { name: '缺失值', value: 1514 },
    { name: '重复数据', value: 1203 },
    { name: '异常值', value: 842 },
    { name: '格式错误', value: 520 },
  ],
}

export const analysisStats = {
  total: 128420,
  avg: 8562.5,
  max: 98200,
  min: 120,
  median: 4200,
  stdDev: 1256.8,
}

export const salesTrend = {
  months: ['3月', '4月', '5月', '6月', '7月', '8月'],
  values: [8200, 9100, 8800, 7600, 7200, 6800],
}

export const regionCompare = [
  { name: '华东', value: 3200 },
  { name: '华南', value: 2800 },
  { name: '华北', value: 2100 },
  { name: '西南', value: 1600 },
]

export const correlationData = Array.from({ length: 30 }, (_, i) => [6000 + i * 120 + Math.random() * 800, 400 + i * 8 + Math.random() * 100])

export const aiAnalysisPairs: AiAnalysisResult[] = [
  {
    question: '分析近6个月销售额下降的原因',
    conclusion: '近三个月销售额整体呈下降趋势，主要下降区域为华东地区。',
    findings: ['销售额下降 12.4%', '华东地区贡献 68% 的下降量', '用户活跃度下降 8.7%', '复购率下降 5.2%'],
    suggestion: '建议重点关注华东地区用户活跃度，并通过营销活动提升老用户复购率。',
  },
  {
    question: '分析最近销售趋势',
    conclusion: '近 30 天销售数据波动明显，周末峰值显著高于工作日。',
    findings: ['周末日均订单量高出 34%', '移动端占比提升至 62%', '新客转化率稳定', '客单价略有下滑'],
    suggestion: '建议在周末加大促销力度，同时优化移动端购物体验。',
  },
  {
    question: '查看异常数据',
    conclusion: '当前共检测到 842 条异常数据，集中在 IoT 设备数据与用户行为日志。',
    findings: ['IoT 数据异常占比 52%', '时间戳缺失 328 条', '数值超范围 214 条', '格式错误 156 条'],
    suggestion: '建议优先修复 IoT 数据源连接，并启用自动异常标记规则。',
  },
  {
    question: '预测下月销售情况',
    conclusion: '基于历史趋势预测，下月销售额约为 6,500 万，较本月略有回升。',
    findings: ['预测增长 3.2%', '华东区域仍为主要贡献', '季节性因素利好', '库存周转率改善'],
    suggestion: '建议提前备货华东区域热销 SKU，并关注供应链协同。',
  },
]

export const reports: ReportItem[] = [
  { id: 'r1', name: '销售日报', dataSource: 'ERP 销售系统', reportType: '日报', updatedAt: '2026-08-28 08:00', creator: '张明', autoGenerate: true },
  { id: 'r2', name: '库存分析', dataSource: 'ERP 销售系统', reportType: '分析报表', updatedAt: '2026-08-27 18:00', creator: '李华', autoGenerate: true },
  { id: 'r3', name: '运营周报', dataSource: '用户行为日志', reportType: '周报', updatedAt: '2026-08-27 09:00', creator: '王芳', autoGenerate: true },
  { id: 'r4', name: '用户分析', dataSource: 'CRM 客户数据库', reportType: '专题分析', updatedAt: '2026-08-26 16:30', creator: '赵强', autoGenerate: false },
  { id: 'r5', name: '数据质量月报', dataSource: '多源数据', reportType: '月报', updatedAt: '2026-08-25 10:00', creator: '陈伟', autoGenerate: true },
]

export const reportDashboard = {
  sales: 6800000,
  users: 128600,
  orders: 45600,
  conversion: 3.54,
}

export const qualityMetrics = {
  overall: 96.8,
  completeness: 97.2,
  accuracy: 95.6,
  consistency: 98.1,
  uniqueness: 99.2,
  timeliness: 96.5,
}

export const qualityTrend = {
  dates: Array.from({ length: 30 }, (_, i) => `08-${String(i + 1).padStart(2, '0')}`),
  values: Array.from({ length: 30 }, () => 94 + Math.random() * 4),
}

export const qualityAlerts: QualityAlert[] = [
  { id: 'qa1', time: '2026-08-28 10:15', dataSource: 'IoT 设备数据', alertType: '连接超时', count: 128, severity: 'critical', status: 'running' },
  { id: 'qa2', time: '2026-08-28 09:30', dataSource: '用户行为日志', alertType: '缺失值超标', count: 520, severity: 'moderate', status: 'running' },
  { id: 'qa3', time: '2026-08-28 08:00', dataSource: 'CRM 客户数据库', alertType: '重复数据', count: 86, severity: 'hint', status: 'completed' },
  { id: 'qa4', time: '2026-08-27 16:45', dataSource: '外部行业 API', alertType: '格式错误', count: 42, severity: 'moderate', status: 'completed' },
  { id: 'qa5', time: '2026-08-27 14:00', dataSource: 'ERP 销售系统', alertType: '数据延迟', count: 15, severity: 'hint', status: 'completed' },
]

export const syncTasks: SyncTaskItem[] = [
  { id: 's1', name: '销售数据同步', source: 'MySQL', target: '灵悉智能体平台', syncMode: '增量同步', dataVolume: '56,200 条/次', frequency: '每小时', status: 'running', lastSync: '2026-08-28 10:00' },
  { id: 's2', name: 'CRM 客户同步', source: 'PostgreSQL', target: '灵悉智能体平台', syncMode: '全量同步', dataVolume: '128,500 条', frequency: '每天', status: 'completed', lastSync: '2026-08-28 06:00' },
  { id: 's3', name: '行为日志同步', source: 'API', target: '数据仓库', syncMode: '增量同步', dataVolume: '2,340,000 条/天', frequency: '实时', status: 'running', lastSync: '2026-08-28 10:30' },
  { id: 's4', name: 'IoT 数据同步', source: 'MQTT', target: '时序数据库', syncMode: '增量同步', dataVolume: '890,000 条/天', frequency: '每15分钟', status: 'failed', lastSync: '2026-08-27 14:30' },
  { id: 's5', name: '报表数据同步', source: 'Excel', target: 'BI 平台', syncMode: '手动同步', dataVolume: '12,800 条', frequency: '每周', status: 'queued', lastSync: '2026-08-25 10:00' },
]

export const systemUsers: SystemUser[] = [
  { id: 'u1', username: 'admin', role: '管理员', status: 'completed', lastLogin: '2026-08-28 10:00' },
  { id: 'u2', username: 'zhangming', role: '数据工程师', status: 'completed', lastLogin: '2026-08-28 09:30' },
  { id: 'u3', username: 'lihua', role: '分析师', status: 'completed', lastLogin: '2026-08-27 18:00' },
  { id: 'u4', username: 'wangfang', role: '分析师', status: 'running', lastLogin: '2026-08-28 08:15' },
  { id: 'u5', username: 'tester', role: '测试人员', status: 'waiting', lastLogin: '2026-08-26 14:00' },
]

export const permissionTree = [
  { title: '数据处理插件', key: 'root', children: [
    { title: '数据源管理', key: 'sources' },
    { title: '数据治理', key: 'governance' },
    { title: '数据分析', key: 'analysis' },
    { title: '报表管理', key: 'reports' },
    { title: '数据质量', key: 'quality' },
    { title: '系统管理', key: 'system' },
  ]},
]

export const dataTasks: DataTask[] = [
  { id: 'd1', name: 'CRM 客户数据治理', dataSource: 'CRM 客户数据库', dataVolume: '128,500 条', processType: '数据治理', progress: 100, status: 'completed', createdAt: '2026-08-28 10:18', updatedAt: '2026-08-28 10:45' },
  { id: 'd2', name: '销售数据分析', dataSource: 'ERP 销售系统', dataVolume: '56,200 条', processType: '数据分析', progress: 72, status: 'running', createdAt: '2026-08-28 09:30', updatedAt: '2026-08-28 10:20' },
  { id: 'd3', name: '用户行为数据处理', dataSource: '用户行为日志', dataVolume: '2,340,000 条', processType: '数据同步', progress: 35, status: 'running', createdAt: '2026-08-28 08:00', updatedAt: '2026-08-28 09:50' },
  { id: 'd4', name: '行业数据标准化', dataSource: '外部行业 API', dataVolume: '89,600 条', processType: '数据治理', progress: 100, status: 'completed', createdAt: '2026-08-27 14:20', updatedAt: '2026-08-27 16:00' },
  { id: 'd5', name: '供应链数据整合', dataSource: '供应链 Excel 导入', dataVolume: '456,800 条', processType: '数据接入', progress: 0, status: 'queued', createdAt: '2026-08-27 11:00', updatedAt: '2026-08-27 11:00' },
]

export const getDataTask = (id: string): DataTask | undefined =>
  dataTasks.find((t) => t.id === id)

export const getReport = (id: string): ReportItem | undefined =>
  reports.find((r) => r.id === id)

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

export const communityPluginMeta = {
  name: '社群管理及多渠道消息推送插件',
  description: '面向 AI Agent 提供多平台消息聚合、智能回复与精准触达能力',
  status: 'running' as const,
  version: 'v2.1.0',
}

export const communityOverviewStats = {
  totalGroups: 36,
  todayMessages: 4280,
  aiReplyRate: 78.5,
  pushReachRate: 92.3,
  apiCalls: 28600,
}

export const communityScenarios = [
  { title: '多平台消息聚合', description: '微信/企微/短信/邮件/Web 统一收件箱，一键查看全渠道消息', items: ['统一收件箱', '渠道 Tag', '状态筛选', '快速跳转'] },
  { title: 'AI 智能回复', description: '意图识别 Top-3，自动回复常见问题，复杂问题转人工', items: ['意图识别', '置信度展示', '自动回复', '转人工'] },
  { title: '多渠道精准推送', description: '模板化管理，按策略定时/触发推送，支持测试发送', items: ['模板编辑', '推送策略', '变量替换', '测试发送'] },
  { title: '用户画像运营', description: '标签体系 + 生命周期分析，驱动个性化运营策略', items: ['用户标签', '生命周期', '偏好渠道', '策略效果'] },
  { title: '社群运营监控', description: '社群活跃度监控，异常预警，运营数据一目了然', items: ['社群列表', '活跃度', '成员统计', '预警记录'] },
]

export const channels: Channel[] = [
  { id: 'ch1', name: '微信公众号', icon: 'wechat', status: 'connected', todaySent: 1280, totalSent: 45680 },
  { id: 'ch2', name: '企业微信', icon: 'wework', status: 'connected', todaySent: 2340, totalSent: 89200 },
  { id: 'ch3', name: '短信', icon: 'sms', status: 'connected', todaySent: 560, totalSent: 23400 },
  { id: 'ch4', name: '邮件', icon: 'email', status: 'connected', todaySent: 890, totalSent: 56700 },
  { id: 'ch5', name: 'Telegram', icon: 'telegram', status: 'configuring', todaySent: 0, totalSent: 0 },
  { id: 'ch6', name: 'Web', icon: 'web', status: 'connected', todaySent: 3200, totalSent: 128000 },
]

export const communityGroups: CommunityGroup[] = [
  { id: 'g1', name: 'AI 技术交流社群', memberCount: 12580, activity: 85, lastActive: '2026-08-28 10:30', status: 'running' },
  { id: 'g2', name: '企业数字化转型社群', memberCount: 8920, activity: 72, lastActive: '2026-08-28 10:15', status: 'running' },
  { id: 'g3', name: '新能源行业资讯群', memberCount: 15600, activity: 68, lastActive: '2026-08-28 09:50', status: 'running' },
  { id: 'g4', name: '智能制造解决方案群', memberCount: 6780, activity: 45, lastActive: '2026-08-28 08:30', status: 'completed' },
  { id: 'g5', name: '金融科技创新社群', memberCount: 9340, activity: 58, lastActive: '2026-08-27 18:00', status: 'running' },
  { id: 'g6', name: '政务数字化交流群', memberCount: 4520, activity: 32, lastActive: '2026-08-27 16:00', status: 'waiting' },
]

export const aggregatedMessages: AggregatedMessage[] = [
  { id: 'm1', channel: '企业微信', channelType: 'wework', sender: '张经理', content: '请问 AI 插件的最新版本什么时候发布？我们需要提前做集成测试。', receivedAt: '2026-08-28 10:28', status: 'unread', groupName: 'AI 技术交流社群' },
  { id: 'm2', channel: '微信公众号', channelType: 'wechat', sender: '李用户', content: '订阅的周报还没收到，能帮我查一下吗？', receivedAt: '2026-08-28 10:15', status: 'unread' },
  { id: 'm3', channel: '短信', channelType: 'sms', sender: '138****8821', content: '【验证码】您的验证码是 826491，5分钟内有效。', receivedAt: '2026-08-28 10:02', status: 'read' },
  { id: 'm4', channel: '邮件', channelType: 'email', sender: 'wang@company.com', content: '关于下周产品演示的安排，请确认参会人员名单。', receivedAt: '2026-08-28 09:45', status: 'replied' },
  { id: 'm5', channel: 'Web', channelType: 'web', sender: '访客_1024', content: '平台支持私有化部署吗？有没有相关文档？', receivedAt: '2026-08-28 09:30', status: 'unread' },
  { id: 'm6', channel: '企业微信', channelType: 'wework', sender: '陈总监', content: '社群推送频率太高了，能否调整一下？', receivedAt: '2026-08-28 09:12', status: 'transferred', groupName: '企业数字化转型社群' },
  { id: 'm7', channel: '微信公众号', channelType: 'wechat', sender: '赵同学', content: '有没有 AI 智能体的入门教程推荐？', receivedAt: '2026-08-28 08:50', status: 'replied' },
  { id: 'm8', channel: 'Web', channelType: 'web', sender: '访客_2048', content: '申请试用账号，企业规模约 200 人。', receivedAt: '2026-08-28 08:30', status: 'unread' },
]

export const intentTop3Mock: IntentRecord[] = [
  { intent: '产品咨询', confidence: 0.92, description: '用户询问产品版本、功能或发布时间' },
  { intent: '技术支持', confidence: 0.68, description: '用户需要技术集成或使用帮助' },
  { intent: '账号问题', confidence: 0.35, description: '用户遇到账号、权限或登录相关问题' },
]

export const autoReplyMock = '您好！AI 插件最新版本 v2.1.0 已于本周发布，支持多平台消息聚合与智能回复。集成文档可在「帮助中心 → 开发者指南」查看。如需进一步协助，请随时告知。'

export const pushTemplates: PushTemplate[] = [
  { id: 't1', name: '新功能上线通知', channel: '企业微信', title: '【产品更新】{{功能名称}} 已上线', content: '尊敬的 {{用户名}}，{{功能名称}} 已于 {{日期}} 正式上线，欢迎体验！详情：{{链接}}', variables: ['用户名', '功能名称', '日期', '链接'], updatedAt: '2026-08-27 14:00' },
  { id: 't2', name: '社群活动邀请', channel: '微信公众号', title: '{{活动名称}} 诚邀参与', content: 'Hi {{用户名}}，{{活动名称}} 将于 {{时间}} 开始，名额有限，点击报名：{{链接}}', variables: ['用户名', '活动名称', '时间', '链接'], updatedAt: '2026-08-26 10:30' },
  { id: 't3', name: '订单状态提醒', channel: '短信', title: '', content: '【{{品牌名}}】您的订单 {{订单号}} 已{{状态}}，详情请登录查看。', variables: ['品牌名', '订单号', '状态'], updatedAt: '2026-08-25 16:00' },
  { id: 't4', name: '周报订阅推送', channel: '邮件', title: '【周报】{{主题}} - {{日期}}', content: '您好 {{用户名}}，本周 {{主题}} 要点摘要如下：\n\n{{摘要内容}}\n\n完整报告请查看附件。', variables: ['用户名', '主题', '日期', '摘要内容'], updatedAt: '2026-08-24 09:00' },
]

export interface PushStrategyItem {
  id: string
  name: string
  channel: string
  trigger: string
  frequency: string
  status: TaskStatus
  lastRun: string
}

export const pushStrategies: PushStrategyItem[] = [
  { id: 'ps1', name: '新用户欢迎推送', channel: '企业微信', trigger: '用户首次加入社群', frequency: '即时', status: 'running', lastRun: '2026-08-28 10:20' },
  { id: 'ps2', name: '每周行业资讯', channel: '微信公众号', trigger: '定时任务', frequency: '每周一 09:00', status: 'running', lastRun: '2026-08-26 09:00' },
  { id: 'ps3', name: '沉默用户唤醒', channel: '短信', trigger: '7 天未活跃', frequency: '每天 10:00', status: 'running', lastRun: '2026-08-28 10:00' },
  { id: 'ps4', name: 'VIP 专属活动', channel: '邮件', trigger: '生命周期 = VIP', frequency: '每月 1 日', status: 'completed', lastRun: '2026-08-01 09:00' },
  { id: 'ps5', name: '产品更新通知', channel: 'Web', trigger: '版本发布事件', frequency: '即时', status: 'waiting', lastRun: '2026-08-20 15:00' },
]

export const userPortraits: UserPortrait[] = [
  { id: 'p1', userId: 'U10001', nickname: '张经理', tags: ['企业客户', '技术决策', '高活跃'], lifecycle: 'vip', lastActive: '2026-08-28 10:28', messageCount: 156, responseRate: 95, preferredChannel: '企业微信', strategyEffect: 88 },
  { id: 'p2', userId: 'U10002', nickname: '李用户', tags: ['个人用户', '内容消费'], lifecycle: 'active', lastActive: '2026-08-28 10:15', messageCount: 42, responseRate: 72, preferredChannel: '微信公众号', strategyEffect: 65 },
  { id: 'p3', userId: 'U10003', nickname: '王工程师', tags: ['开发者', 'API 集成'], lifecycle: 'active', lastActive: '2026-08-27 18:00', messageCount: 89, responseRate: 88, preferredChannel: '邮件', strategyEffect: 76 },
  { id: 'p4', userId: 'U10004', nickname: '陈总监', tags: ['企业客户', '投诉反馈'], lifecycle: 'silent', lastActive: '2026-08-20 14:00', messageCount: 23, responseRate: 45, preferredChannel: '企业微信', strategyEffect: 32 },
  { id: 'p5', userId: 'U10005', nickname: '赵同学', tags: ['学生', '新手'], lifecycle: 'new', lastActive: '2026-08-28 08:50', messageCount: 8, responseRate: 100, preferredChannel: 'Web', strategyEffect: 90 },
  { id: 'p6', userId: 'U10006', nickname: '刘总', tags: ['企业客户', '已流失'], lifecycle: 'churned', lastActive: '2026-07-15 10:00', messageCount: 12, responseRate: 20, preferredChannel: '短信', strategyEffect: 15 },
]

export const lifecycleStats = [
  { stage: 'new', label: '新用户', count: 1280, color: '#1677ff' },
  { stage: 'active', label: '活跃', count: 28600, color: '#52c41a' },
  { stage: 'silent', label: '沉默', count: 8900, color: '#faad14' },
  { stage: 'churned', label: '流失', count: 3200, color: '#ff4d4f' },
  { stage: 'vip', label: 'VIP', count: 1560, color: '#7c5cfc' },
]

export const strategyEffectStats = {
  pushConversionRate: 18.6,
  retentionLift: 12.3,
  repurchaseRate: 8.5,
  avgResponseTime: '2.3min',
}

export const communityAlerts: CommunityAlert[] = [
  { id: 'ca1', time: '2026-08-28 09:12', type: '频率投诉', title: '用户反馈推送频率过高', level: 'warning', status: 'pending' },
  { id: 'ca2', time: '2026-08-28 08:00', type: '活跃度下降', title: '智能制造解决方案群活跃度低于阈值', level: 'info', status: 'handled' },
  { id: 'ca3', time: '2026-08-27 16:30', type: '渠道异常', title: 'Telegram 渠道连接超时', level: 'critical', status: 'pending' },
  { id: 'ca4', time: '2026-08-27 10:00', type: '成员激增', title: 'AI 技术交流社群今日新增超 200 人', level: 'info', status: 'handled' },
]

export const communitySettingsDefault = {
  userDailyLimit: 5,
  channelDailyLimit: 10000,
  channelHourlyLimit: 500,
  quietHoursEnabled: true,
  quietStart: '22:00',
  quietEnd: '08:00',
  unsubscribeKeywords: '退订,取消订阅,STOP',
  globalUnsubscribe: true,
  unsubscribeConfirm: true,
}

/** @deprecated use communityOverviewStats */
export const communityStats = {
  totalGroups: communityOverviewStats.totalGroups,
  totalMembers: 128600,
  todayNew: 1280,
  activeMembers: 45600,
}

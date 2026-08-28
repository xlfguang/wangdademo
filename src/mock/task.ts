import type {
  CollabTask, TaskProgressLog, TaskDocument, TaskComment,
  TaskChatMessage, TaskNotification, TaskLedger, TaskOperationLog,
} from '@/types'

export const taskPluginMeta = {
  name: '任务协作助手插件',
  description: '面向团队提供任务全链路、标准化、可视化协同管理能力',
  status: 'running' as const,
  version: 'v1.5.0',
}

export const taskOverviewStats = {
  totalTasks: 186,
  completedRate: 72,
  overdueCount: 8,
  pendingAcceptance: 12,
  activeMembers: 48,
}

export const taskScenarios = [
  { title: '项目拆解分工', description: '总任务多级拆解，明确负责人与截止时间', items: ['树形拆解', '人员指派', '优先级', '时间预警'] },
  { title: '进度透明管控', description: '看板/列表双视图，管理者全局掌握推进状态', items: ['看板视图', '进度更新', '超时预警', '团队统计'] },
  { title: '资料在线协作', description: '任务专属资料夹，多人编辑批注', items: ['集中存储', '在线编辑', '批注评论', '版本留痕'] },
  { title: '跨岗实时联动', description: '任务会话 + 变更通知 + 上下游链动', items: ['任务会话', '变更推送', '任务链动', '@提醒'] },
  { title: '成果闭环归档', description: '验收审核通过后自动归档生成台账', items: ['验收提交', '审核流程', '自动归档', '台账导出'] },
]

export const collabTasks: CollabTask[] = [
  { id: 't1', name: 'AI 平台 Q3 交付项目', description: 'Q3 插件交付与验收总任务', priority: 'high', status: 'in_progress', progress: 68, owner: '张明', participants: ['李华', '王芳', '赵强'], watchers: ['刘总'], startDate: '2026-07-01', endDate: '2026-09-30', createdAt: '2026-07-01 09:00', createdBy: '张明' },
  { id: 't1-1', parentId: 't1', name: '音频插件验收', priority: 'high', status: 'completed', progress: 100, owner: '李华', participants: ['王芳'], watchers: [], startDate: '2026-08-01', endDate: '2026-08-28', createdAt: '2026-08-01 10:00', createdBy: '张明', upstreamIds: [] },
  { id: 't1-2', parentId: 't1', name: '爬虫插件验收', priority: 'high', status: 'in_progress', progress: 85, owner: '王芳', participants: ['赵强'], watchers: [], startDate: '2026-08-15', endDate: '2026-08-30', createdAt: '2026-08-15 10:00', createdBy: '张明', upstreamIds: ['t1-1'] },
  { id: 't1-3', parentId: 't1', name: '社群/清洗/知识库模块联调', priority: 'medium', status: 'in_progress', progress: 55, owner: '赵强', participants: ['李华'], watchers: [], startDate: '2026-08-20', endDate: '2026-09-05', createdAt: '2026-08-20 10:00', createdBy: '张明', upstreamIds: ['t1-2'] },
  { id: 't2', name: '政务知识库二期', description: '知识库升级与检索优化', priority: 'medium', status: 'pending_acceptance', progress: 100, owner: '陈伟', participants: ['刘洋'], watchers: ['李总'], startDate: '2026-06-01', endDate: '2026-08-25', createdAt: '2026-06-01 09:00', createdBy: '陈伟' },
  { id: 't3', name: '金融客服话术整理', priority: 'low', status: 'not_started', progress: 0, owner: '刘洋', participants: [], watchers: [], startDate: '2026-09-01', endDate: '2026-09-30', createdAt: '2026-08-28 14:00', createdBy: '刘洋', upstreamIds: ['t2'] },
  { id: 't4', name: '数据清洗流程优化', priority: 'medium', status: 'overdue', progress: 40, owner: '王芳', participants: ['张明'], watchers: [], startDate: '2026-08-01', endDate: '2026-08-20', createdAt: '2026-08-01 09:00', createdBy: '王芳' },
]

export const progressLogs: TaskProgressLog[] = [
  { id: 'pl1', taskId: 't1-2', progress: 85, note: '舆情监控与检索页已完成，待联调', operator: '王芳', time: '2026-08-28 10:00' },
  { id: 'pl2', taskId: 't1-2', progress: 60, note: 'Overview 与 Search 页开发完成', operator: '王芳', time: '2026-08-27 16:30' },
  { id: 'pl3', taskId: 't1-1', progress: 100, note: 'build 通过，已提交验收', operator: '李华', time: '2026-08-28 09:00' },
  { id: 'pl4', taskId: 't1', progress: 68, note: '整体进度同步更新', operator: '张明', time: '2026-08-28 10:30' },
]

export const taskDocuments: TaskDocument[] = [
  { id: 'd1', taskId: 't1', name: 'Q3交付计划_v2.docx', size: '2.4 MB', folder: '原始素材', updatedAt: '2026-08-28 09:00', updatedBy: '张明' },
  { id: 'd2', taskId: 't1-2', name: '爬虫插件规格说明.md', size: '48 KB', folder: '阶段性成果', updatedAt: '2026-08-27 18:00', updatedBy: '王芳' },
  { id: 'd3', taskId: 't1-1', name: '音频插件验收报告.pdf', size: '1.2 MB', folder: '最终成果', updatedAt: '2026-08-28 08:30', updatedBy: '李华' },
  { id: 'd4', taskId: 't2', name: '知识库二期方案.docx', size: '3.8 MB', folder: '原始素材', updatedAt: '2026-08-26 14:00', updatedBy: '陈伟' },
]

export const taskComments: TaskComment[] = [
  { id: 'c1', docId: 'd2', content: '第 3 节路由表需补充 legacy redirect 说明', author: '赵强', time: '2026-08-27 19:00' },
  { id: 'c2', docId: 'd2', content: '已补充，请复核 @王芳', author: '王芳', time: '2026-08-27 19:30' },
]

export const chatMessages: TaskChatMessage[] = [
  { id: 'm1', taskId: 't1-2', sender: '王芳', content: '爬虫模块 build 已通过，可以开始联调了', time: '2026-08-28 10:15' },
  { id: 'm2', taskId: 't1-2', sender: '赵强', content: '收到，我这边下午开始对接 MainLayout breadcrumb', time: '2026-08-28 10:20' },
  { id: 'm3', taskId: 't1', sender: '张明', content: '@李华 @王芳 本周五前完成全部插件验收', time: '2026-08-28 09:00' },
]

export const taskNotifications: TaskNotification[] = [
  { id: 'n1', taskId: 't1-2', type: 'change', content: '截止时间由 2026-08-25 调整为 2026-08-30', operator: '张明', time: '2026-08-26 11:00', read: false },
  { id: 'n2', taskId: 't4', type: 'warning', content: '任务已超时，请尽快更新进度', operator: '系统', time: '2026-08-21 09:00', read: false },
  { id: 'n3', taskId: 't1-1', type: 'change', content: '李华 更新进度至 100%', operator: '李华', time: '2026-08-28 09:00', read: true },
  { id: 'n4', taskId: 't2', type: 'change', content: '陈伟 提交验收申请', operator: '陈伟', time: '2026-08-27 17:00', read: true },
]

export const taskLedgers: TaskLedger[] = [
  { id: 'l1', taskId: 't-old1', taskName: '视频插件 v2.6 交付', owner: '李华', participants: ['王芳', '赵强'], plannedEnd: '2026-08-15', actualEnd: '2026-08-14', acceptResult: '通过', archivedAt: '2026-08-15 16:00' },
  { id: 'l2', taskId: 't-old2', taskName: '数据处理插件重构', owner: '赵强', participants: ['张明'], plannedEnd: '2026-08-10', actualEnd: '2026-08-12', acceptResult: '通过', archivedAt: '2026-08-12 18:00' },
]

export const operationLogs: TaskOperationLog[] = [
  { id: 'o1', taskId: 't1', action: '创建总任务', operator: '张明', time: '2026-07-01 09:00' },
  { id: 'o2', taskId: 't1-1', action: '拆解子任务', operator: '张明', time: '2026-08-01 10:00', detail: '从 t1 拆解' },
  { id: 'o3', taskId: 't1-1', action: '提交验收', operator: '李华', time: '2026-08-28 09:00' },
  { id: 'o4', taskId: 't4', action: '任务超时预警', operator: '系统', time: '2026-08-21 09:00' },
]

export const teamStats = {
  total: 186,
  completed: 134,
  pendingAcceptance: 12,
  inProgress: 32,
  notStarted: 8,
  overdue: 8,
  completionRate: 72,
}

export const getCollabTask = (id: string): CollabTask | undefined =>
  collabTasks.find((t) => t.id === id)

export const getChildTasks = (parentId: string): CollabTask[] =>
  collabTasks.filter((t) => t.parentId === parentId)

export const getRootTasks = (): CollabTask[] =>
  collabTasks.filter((t) => !t.parentId)

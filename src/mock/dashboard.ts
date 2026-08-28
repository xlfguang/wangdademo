import type { DashboardTask } from '@/types'

export const dashboardStats = {
  totalTasks: 12680,
  totalTasksChange: 12.6,
  runningTasks: 28,
  dataProcessed: '2.8 TB',
  serviceProjects: 36,
  aiCalls: 12680,
  knowledgeDocs: 15823,
}

export const taskTrendData = {
  dates: ['08-22', '08-23', '08-24', '08-25', '08-26', '08-27', '08-28'],
  values: [1420, 1680, 1520, 1890, 2100, 1980, 2340],
}

export const pluginUsageData = [
  { name: '视频处理', value: 2860 },
  { name: '数据处理', value: 3420 },
  { name: '音频处理', value: 1580 },
  { name: '搜索爬虫', value: 2240 },
  { name: '消息推送', value: 2580 },
]

export const taskStatusData = [
  { name: '运行中', value: 28 },
  { name: '已完成', value: 12450 },
  { name: '等待中', value: 156 },
  { name: '失败', value: 46 },
]

export const recentTasks: DashboardTask[] = [
  {
    id: '1',
    name: '企业宣传视频生成',
    type: '视频处理',
    status: 'running',
    createdAt: '2026-08-28 10:32',
    route: '/video/task/v1',
  },
  {
    id: '2',
    name: '客户数据清洗',
    type: '数据处理',
    status: 'completed',
    createdAt: '2026-08-28 10:18',
    route: '/data/task/d1',
  },
  {
    id: '3',
    name: '行业资料采集',
    type: '搜索爬虫',
    status: 'completed',
    createdAt: '2026-08-28 09:52',
    route: '/crawler/task/c1',
  },
  {
    id: '4',
    name: '企业知识库构建',
    type: '知识库',
    status: 'running',
    createdAt: '2026-08-28 09:41',
    route: '/knowledge/base/kb1',
  },
  {
    id: '5',
    name: '产品发布会语音转写',
    type: '音频处理',
    status: 'completed',
    createdAt: '2026-08-28 09:15',
    route: '/audio/task/a1',
  },
  {
    id: '6',
    name: '制造业数据标准化',
    type: '数据清洗',
    status: 'running',
    createdAt: '2026-08-28 08:50',
    route: '/data-clean/task/dc1',
  },
  {
    id: '7',
    name: '新能源汽车舆情推送',
    type: '消息推送',
    status: 'completed',
    createdAt: '2026-08-28 08:30',
    route: '/community/messages',
  },
  {
    id: '8',
    name: '智能客服知识库更新',
    type: '知识库',
    status: 'waiting',
    createdAt: '2026-08-28 08:00',
    route: '/knowledge/base/kb3',
  },
]

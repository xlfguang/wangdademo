import type { DashboardTask } from '@/types'
import { jitter, randomFloat, randomInt, shuffle } from '@/utils/mockApi'

// 任务状态数量相互关联：总量由各状态求和得出，避免统计卡片与图表对不上
const running = randomInt(18, 45)
const waiting = randomInt(80, 280)
const failed = randomInt(15, 90)
const completed = randomInt(11500, 13800)
const totalTasks = running + waiting + failed + completed

export const dashboardStats = {
  totalTasks,
  totalTasksChange: randomFloat(4, 24, 1),
  runningTasks: running,
  dataProcessed: `${randomFloat(1.6, 4.5, 1)} TB`,
  serviceProjects: randomInt(26, 48),
  aiCalls: totalTasks,
  knowledgeDocs: randomInt(11000, 22000),
}

export const taskTrendData = {
  dates: ['08-22', '08-23', '08-24', '08-25', '08-26', '08-27', '08-28'],
  values: [1420, 1680, 1520, 1890, 2100, 1980, 2340].map((v) => jitter(v, 0.22)),
}

export const pluginUsageData = [
  { name: '视频处理', value: jitter(2860, 0.2) },
  { name: '数据处理', value: jitter(3420, 0.2) },
  { name: '音频处理', value: jitter(1580, 0.25) },
  { name: '搜索爬虫', value: jitter(2240, 0.2) },
  { name: '消息推送', value: jitter(2580, 0.2) },
]

export const taskStatusData = [
  { name: '运行中', value: running },
  { name: '已完成', value: completed },
  { name: '等待中', value: waiting },
  { name: '失败', value: failed },
]

export const recentTasks: DashboardTask[] = shuffle([
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
])

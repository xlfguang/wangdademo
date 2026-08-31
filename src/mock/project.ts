import type { Project } from '@/types'
import { formatCount, randomFloat, randomInt } from '@/utils/mockApi'

/** 进度与项目阶段保持一致：规划中/实施中/运营中在各自合理区间随机，已完成固定 100 */
const projectProgress = (status: Project['status']): number => {
  switch (status) {
    case 'planning':
      return randomInt(8, 40)
    case 'implementing':
      return randomInt(45, 88)
    case 'operating':
      return randomInt(80, 99)
    case 'completed':
      return 100
    case 'paused':
      return randomInt(20, 70)
  }
}

export const projects: Project[] = [
  { id: 'p1', name: '某大型制造企业 AI 智能化项目', industry: '制造业', manager: '张明', status: 'implementing', progress: projectProgress('implementing'), startDate: '2026-03-01', endDate: '2026-12-31', description: '为大型制造企业提供 AI 驱动的生产优化、质量检测和知识管理解决方案。' },
  { id: 'p2', name: '某政务知识库项目', industry: '政务', manager: '李华', status: 'operating', progress: projectProgress('operating'), startDate: '2025-09-01', endDate: '2026-08-31', description: '构建政务领域智能知识库，支持政策查询、办事指南和智能问答。' },
  { id: 'p3', name: '某金融行业智能客服项目', industry: '金融', manager: '王芳', status: 'operating', progress: projectProgress('operating'), startDate: '2025-11-01', endDate: '2026-10-31', description: '基于大模型的智能客服系统，支持多渠道接入和知识库驱动的精准应答。' },
  { id: 'p4', name: '某零售企业数据治理项目', industry: '零售', manager: '赵强', status: 'planning', progress: projectProgress('planning'), startDate: '2026-06-01', endDate: '2027-03-31', description: '零售企业全链路数据治理，包括数据采集、清洗、标准化和智能分析。' },
  { id: 'p5', name: '新能源汽车行业舆情监测项目', industry: '新能源', manager: '陈伟', status: 'implementing', progress: projectProgress('implementing'), startDate: '2026-01-15', endDate: '2026-09-30', description: '基于搜索爬虫和 AI 分析的舆情监测与预警系统。' },
  { id: 'p6', name: '教育行业 AI 助教项目', industry: '教育', manager: '刘洋', status: 'completed', progress: 100, startDate: '2025-06-01', endDate: '2026-05-31', description: 'AI 驱动的智能助教系统，支持个性化学习和知识问答。' },
]

export const getProject = (id: string): Project | undefined =>
  projects.find((p) => p.id === id)

export const projectTasks = [
  { id: 'pt1', name: '知识库文档导入', assignee: '张明', status: 'completed', deadline: '2026-08-15' },
  { id: 'pt2', name: '视频处理插件部署', assignee: '李华', status: 'running', deadline: '2026-08-30' },
  { id: 'pt3', name: '数据清洗流程配置', assignee: '王芳', status: 'running', deadline: '2026-09-05' },
  { id: 'pt4', name: '智能客服模型微调', assignee: '赵强', status: 'waiting', deadline: '2026-09-15' },
  { id: 'pt5', name: '系统联调测试', assignee: '陈伟', status: 'waiting', deadline: '2026-09-30' },
]

export const projectPlugins = [
  { name: '视频处理插件', status: '已部署', usage: `${formatCount(randomInt(900, 1800))} 次` },
  { name: '数据处理插件', status: '已部署', usage: `${formatCount(randomInt(2600, 4500))} 次` },
  { name: '知识库管理', status: '已部署', usage: `${formatCount(randomInt(600, 1200))} 次` },
  { name: '搜索爬虫插件', status: '配置中', usage: '0 次' },
  { name: '消息推送插件', status: '已部署', usage: `${formatCount(randomInt(1800, 3400))} 次` },
]

export const projectDocs = [
  { name: '项目需求规格说明书.pdf', size: `${randomFloat(3, 9, 1)} MB`, updatedAt: '2026-03-15' },
  { name: '技术方案设计文档.docx', size: `${randomFloat(5, 14, 1)} MB`, updatedAt: '2026-04-01' },
  { name: '测试报告_v2.0.pdf', size: `${randomFloat(1.5, 6, 1)} MB`, updatedAt: '2026-08-10' },
  { name: '用户操作手册.pdf', size: `${randomFloat(8, 18, 1)} MB`, updatedAt: '2026-08-20' },
]

export const projectLogs = [
  { time: '2026-08-28 10:30', user: '张明', action: '更新了项目进度至 78%' },
  { time: '2026-08-28 09:15', user: '李华', action: '完成了视频处理插件部署' },
  { time: '2026-08-27 16:40', user: '王芳', action: '提交了数据清洗流程配置' },
  { time: '2026-08-27 14:00', user: '赵强', action: '创建了智能客服模型微调任务' },
  { time: '2026-08-26 11:30', user: '陈伟', action: '上传了测试报告 v2.0' },
]

export const projectMilestones = [
  { id: 'm1', title: '需求调研与方案设计', date: '2026-03-15', status: 'completed' as const },
  { id: 'm2', title: '知识库文档导入', date: '2026-05-20', status: 'completed' as const },
  { id: 'm3', title: '视频处理插件部署', date: '2026-08-30', status: 'running' as const },
  { id: 'm4', title: '数据清洗流程配置', date: '2026-09-05', status: 'waiting' as const },
  { id: 'm5', title: '系统联调与验收', date: '2026-09-30', status: 'waiting' as const },
]

export const projectMembers = [
  { id: 'pm1', name: '张明', role: '项目经理', department: '交付部', email: 'zhangming@example.com' },
  { id: 'pm2', name: '李华', role: '技术负责人', department: '研发部', email: 'lihua@example.com' },
  { id: 'pm3', name: '王芳', role: '数据工程师', department: '数据部', email: 'wangfang@example.com' },
  { id: 'pm4', name: '赵强', role: 'AI 算法工程师', department: '算法部', email: 'zhaoqiang@example.com' },
  { id: 'pm5', name: '陈伟', role: '测试工程师', department: '质量部', email: 'chenwei@example.com' },
]


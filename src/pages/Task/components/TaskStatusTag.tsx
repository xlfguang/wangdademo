import { Tag } from 'antd'
import type { CollabTaskStatus } from '@/types'

const map: Record<CollabTaskStatus, { color: string; label: string }> = {
  not_started: { color: 'default', label: '未开始' },
  in_progress: { color: 'processing', label: '进行中' },
  completed: { color: 'success', label: '已完成' },
  pending_acceptance: { color: 'warning', label: '待验收' },
  overdue: { color: 'error', label: '已超时' },
  archived: { color: 'default', label: '已归档' },
  paused: { color: 'warning', label: '已暂停' },
  terminated: { color: 'error', label: '已终止' },
}

export default function TaskStatusTag({ status }: { status: CollabTaskStatus }) {
  const cfg = map[status] ?? { color: 'default', label: status }
  return <Tag color={cfg.color}>{cfg.label}</Tag>
}

export function PriorityTag({ priority }: { priority: string }) {
  const colors: Record<string, string> = { high: 'red', medium: 'orange', low: 'blue' }
  const labels: Record<string, string> = { high: '高', medium: '中', low: '低' }
  return <Tag color={colors[priority] ?? 'default'}>{labels[priority] ?? priority}</Tag>
}

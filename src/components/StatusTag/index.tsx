import { Tag } from 'antd'

const statusConfig: Record<string, { color: string; label: string; pulse?: boolean }> = {
  running: { color: 'processing', label: '运行中', pulse: true },
  completed: { color: 'success', label: '已完成' },
  queued: { color: 'default', label: '排队中' },
  waiting: { color: 'warning', label: '等待中' },
  failed: { color: 'error', label: '失败' },
  planning: { color: 'default', label: '规划中' },
  implementing: { color: 'processing', label: '实施中', pulse: true },
  operating: { color: 'success', label: '运营中' },
  paused: { color: 'warning', label: '已暂停' },
  connected: { color: 'success', label: '已连接' },
  disconnected: { color: 'default', label: '未连接' },
  configuring: { color: 'processing', label: '配置中', pulse: true },
  normal: { color: 'success', label: '正常' },
  abnormal: { color: 'error', label: '异常' },
  disabled: { color: 'default', label: '已停用' },
  enabled: { color: 'success', label: '启用中' },
  hint: { color: 'default', label: '提示' },
  moderate: { color: 'warning', label: '一般' },
  critical: { color: 'error', label: '严重' },
}

interface StatusTagProps {
  status: string
}

export default function StatusTag({ status }: StatusTagProps) {
  const config = statusConfig[status] ?? { color: 'default', label: status }
  return (
    <Tag color={config.color}>
      {config.pulse && <span className="pulse-dot" />}
      {config.label}
    </Tag>
  )
}

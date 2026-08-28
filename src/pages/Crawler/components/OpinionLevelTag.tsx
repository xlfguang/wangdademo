import { Tag } from 'antd'
import type { OpinionLevel } from '@/types'

const levelConfig: Record<OpinionLevel, { label: string; color: string }> = {
  urgent: { label: '紧急', color: '#ff4d4f' },
  important: { label: '重要', color: '#fa8c16' },
  normal: { label: '一般', color: '#1677ff' },
}

export default function OpinionLevelTag({ level }: { level: OpinionLevel }) {
  const cfg = levelConfig[level]
  return <Tag color={cfg.color}>{cfg.label}</Tag>
}

export function getOpinionLevelLabel(level: OpinionLevel): string {
  return levelConfig[level].label
}

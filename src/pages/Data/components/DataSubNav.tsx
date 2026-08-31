import { Tabs } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'

const tabItems = [
  { key: '/data/overview', label: '数据概览' },
  { key: '/data/sources', label: '数据源管理' },
  { key: '/data/governance', label: '数据治理' },
  { key: '/data/analysis', label: '数据分析' },
  { key: '/data/reports', label: '可视化报表' },
  { key: '/data/quality', label: '数据质量' },
  { key: '/data/ai-analysis', label: 'AI智能分析' },
  { key: '/data/sync', label: '同步任务' },
]

export default function DataSubNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const activeKey = tabItems.find((t) => location.pathname.startsWith(t.key))?.key ?? '/data/overview'

  return (
    <Tabs
      activeKey={activeKey}
      items={tabItems}
      onChange={(key) => navigate(key)}
      style={{ marginBottom: 24 }}
      size="small"
    />
  )
}

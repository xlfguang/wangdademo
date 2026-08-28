import { Tabs } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'

const tabItems = [
  { key: '/knowledge/overview', label: '能力概览' },
  { key: '/knowledge/bases', label: '知识库管理' },
  { key: '/knowledge/structure', label: '文档结构化' },
  { key: '/knowledge/validation', label: '内容审核' },
  { key: '/knowledge/search', label: '知识检索' },
  { key: '/knowledge/sync', label: '同步任务' },
]

export default function KnowledgeSubNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const activeKey = tabItems.find((t) => location.pathname.startsWith(t.key))?.key ?? '/knowledge/overview'

  return (
    <Tabs activeKey={activeKey} items={tabItems} onChange={(key) => navigate(key)} style={{ marginBottom: 24 }} size="small" />
  )
}

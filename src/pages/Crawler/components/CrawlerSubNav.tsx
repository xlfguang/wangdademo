import { Tabs } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'

const tabItems = [
  { key: '/crawler/overview', label: '能力概览' },
  { key: '/crawler/search', label: '检索工作台' },
  { key: '/crawler/sources', label: '数据源与信源' },
  { key: '/crawler/opinion', label: '舆情监控' },
  { key: '/crawler/data', label: '数据管理' },
  { key: '/crawler/settings', label: '插件设置' },
]

export default function CrawlerSubNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const activeKey = tabItems.find((t) => location.pathname.startsWith(t.key))?.key ?? '/crawler/overview'

  return (
    <Tabs activeKey={activeKey} items={tabItems} onChange={(key) => navigate(key)} style={{ marginBottom: 24 }} size="small" />
  )
}

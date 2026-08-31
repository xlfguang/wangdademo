import { Tabs } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'

const tabItems = [
  { key: '/model/overview', label: '能力概览' },
  { key: '/model/manage', label: '模型管理' },
  { key: '/model/assignment', label: '插件分配' },
  { key: '/model/test', label: '模型测试' },
  { key: '/model/settings', label: '系统设置' },
]

export default function ModelSubNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const activeKey = tabItems.find((t) => location.pathname.startsWith(t.key))?.key ?? '/model/overview'

  return (
    <Tabs
      activeKey={activeKey}
      items={tabItems}
      onChange={(key) => navigate(key)}
      style={{ marginBottom: 24 }}
    />
  )
}

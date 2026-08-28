import { Tabs } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'

const tabItems = [
  { key: '/task/overview', label: '能力概览' },
  { key: '/task/tasks', label: '任务拆解' },
  { key: '/task/tracking', label: '进度跟踪' },
  { key: '/task/docs', label: '文档协作' },
  { key: '/task/collab', label: '跨岗联动' },
  { key: '/task/closure', label: '成果闭环' },
]

export default function TaskSubNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const activeKey = tabItems.find((t) => location.pathname.startsWith(t.key))?.key ?? '/task/overview'

  return (
    <Tabs activeKey={activeKey} items={tabItems} onChange={(key) => navigate(key)} style={{ marginBottom: 24 }} size="small" />
  )
}

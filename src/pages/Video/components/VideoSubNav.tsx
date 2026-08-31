import { Tabs } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'

const tabItems = [
  { key: '/video/overview', label: '能力概览' },
  { key: '/video/tasks', label: '视频处理任务' },
  { key: '/video/analysis', label: '视频分析' },
  { key: '/video/api-debug', label: '接口调试' },
  { key: '/video/config', label: '插件配置' },
]

export default function VideoSubNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const activeKey = tabItems.find((t) => location.pathname.startsWith(t.key))?.key ?? '/video/overview'

  return (
    <Tabs
      activeKey={activeKey}
      items={tabItems}
      onChange={(key) => navigate(key)}
      style={{ marginBottom: 24 }}
    />
  )
}

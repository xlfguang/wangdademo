import { Tabs } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'

const tabItems = [
  { key: '/community/overview', label: '能力概览' },
  { key: '/community/inbox', label: '消息收件箱' },
  { key: '/community/ai-reply', label: 'AI 智能回复' },
  { key: '/community/push', label: '多渠道推送' },
  { key: '/community/portrait', label: '用户画像' },
  { key: '/community/settings', label: '插件设置' },
]

export default function CommunitySubNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const activeKey = tabItems.find((t) => location.pathname.startsWith(t.key))?.key ?? '/community/overview'

  return (
    <Tabs activeKey={activeKey} items={tabItems} onChange={(key) => navigate(key)} style={{ marginBottom: 24 }} size="small" />
  )
}

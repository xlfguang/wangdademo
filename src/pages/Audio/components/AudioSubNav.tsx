import { Tabs } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'

const tabItems = [
  { key: '/audio/overview', label: '能力概览' },
  { key: '/audio/workspace', label: '音频工作台' },
  { key: '/audio/transcription', label: '语音转文字' },
  { key: '/audio/extraction', label: '关键信息提取' },
  { key: '/audio/history', label: '历史记录' },
  { key: '/audio/settings', label: '插件设置' },
]

export default function AudioSubNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const activeKey = tabItems.find((t) => location.pathname.startsWith(t.key))?.key ?? '/audio/overview'

  return (
    <Tabs activeKey={activeKey} items={tabItems} onChange={(key) => navigate(key)} style={{ marginBottom: 24 }} size="small" />
  )
}

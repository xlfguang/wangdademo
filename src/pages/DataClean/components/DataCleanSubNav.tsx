import { Tabs } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'

const tabItems = [
  { key: '/data-clean/overview', label: '能力概览' },
  { key: '/data-clean/upload', label: '文档上传' },
  { key: '/data-clean/batches', label: '批次管理' },
  { key: '/data-clean/pipeline', label: '清洗流水线' },
  { key: '/data-clean/quality', label: '质量校验' },
  { key: '/data-clean/settings', label: '服务设置' },
]

export default function DataCleanSubNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const activeKey = tabItems.find((t) => location.pathname.startsWith(t.key))?.key ?? '/data-clean/overview'

  return (
    <Tabs activeKey={activeKey} items={tabItems} onChange={(key) => navigate(key)} style={{ marginBottom: 24 }} size="small" />
  )
}

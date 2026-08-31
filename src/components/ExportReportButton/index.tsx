import { Dropdown, Button, message } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { exportReport } from '@/utils/exportReport'

interface ExportReportButtonProps {
  filename: string
  data: Record<string, unknown>[] | object
}

export default function ExportReportButton({ filename, data }: ExportReportButtonProps) {
  const handleExport = async (format: 'csv' | 'json' | 'pdf') => {
    try {
      await exportReport(format, filename, data)
      message.success(`报表已导出（${format.toUpperCase()}）`)
    } catch {
      message.error('导出失败')
    }
  }

  const items: MenuProps['items'] = [
    { key: 'excel', label: '导出 Excel (CSV)', onClick: () => handleExport('csv') },
    { key: 'csv', label: '导出 CSV', onClick: () => handleExport('csv') },
    { key: 'pdf', label: '导出 PDF', onClick: () => handleExport('pdf') },
  ]

  return (
    <Dropdown menu={{ items }}>
      <Button icon={<DownloadOutlined />}>导出报表</Button>
    </Dropdown>
  )
}

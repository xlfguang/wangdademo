import { Table, Button, Tag, Popconfirm, message, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import ExportReportButton from '@/components/ExportReportButton'
import DataSubNav from './components/DataSubNav'
import { reports } from '@/mock/data'
import { delay } from '@/utils/mockApi'
import type { ReportItem } from '@/types'

export default function Reports() {
  const navigate = useNavigate()

  const columns = [
    { title: '报表名称', dataIndex: 'name', key: 'name' },
    { title: '数据源', dataIndex: 'dataSource', key: 'dataSource' },
    { title: '报表类型', dataIndex: 'reportType', key: 'reportType' },
    { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt' },
    { title: '创建人', dataIndex: 'creator', key: 'creator' },
    { title: '自动生成', dataIndex: 'autoGenerate', key: 'autoGenerate', render: (v: boolean) => <Tag color={v ? 'blue' : 'default'}>{v ? '是' : '否'}</Tag> },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: ReportItem) => (
        <>
          <Button type="link" size="small" onClick={() => navigate(`/data/reports/${record.id}`)}>查看</Button>
          <Button type="link" size="small">编辑</Button>
          <Button type="link" size="small">复制</Button>
          <Popconfirm title="确定删除该报表吗？" onConfirm={async () => { await delay(300); message.success('删除成功') }}>
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </>
      ),
    },
  ]

  return (
    <div>
      <DataSubNav />
      <PageHeader
        title="报表中心"
        description="企业数据可视化报表"
        extra={
          <Space>
            <ExportReportButton filename="data-reports" data={reports as unknown as Record<string, unknown>[]} />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => message.info('创建报表')}>创建报表</Button>
          </Space>
        }
      />
      <div style={{ marginBottom: 16 }}>
        {['销售日报', '库存分析', '运营周报', '用户分析'].map((t) => (
          <Tag key={t} style={{ cursor: 'pointer', marginRight: 8, padding: '4px 12px' }} onClick={() => navigate('/data/reports/r1')}>{t}</Tag>
        ))}
      </div>
      <Table columns={columns} dataSource={reports} rowKey="id" pagination={{ pageSize: 10 }} />
    </div>
  )
}

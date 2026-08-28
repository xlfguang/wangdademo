import { Table, Button, Space, Popconfirm, message } from 'antd'
import PageHeader from '@/components/PageHeader'
import StatusTag from '@/components/StatusTag'
import DataSubNav from './components/DataSubNav'
import { useDataContext } from './DataContext'
import { delay } from '@/utils/mockApi'
import type { SyncTaskItem } from '@/types'

export default function Sync() {
  const { syncTasks, updateSyncTask, removeSyncTask } = useDataContext()

  const columns = [
    { title: '任务名称', dataIndex: 'name', key: 'name' },
    { title: '源数据', dataIndex: 'source', key: 'source' },
    { title: '目标平台', dataIndex: 'target', key: 'target' },
    { title: '同步方式', dataIndex: 'syncMode', key: 'syncMode' },
    { title: '数据量', dataIndex: 'dataVolume', key: 'dataVolume' },
    { title: '同步频率', dataIndex: 'frequency', key: 'frequency' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <StatusTag status={s} /> },
    { title: '最近同步', dataIndex: 'lastSync', key: 'lastSync' },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: SyncTaskItem) => (
        <Space size={0}>
          {record.status !== 'running' && (
            <Button type="link" size="small" onClick={() => { updateSyncTask(record.id, { status: 'running' }); message.success('任务已启动') }}>启动</Button>
          )}
          {record.status === 'running' && (
            <Button type="link" size="small" onClick={() => { updateSyncTask(record.id, { status: 'waiting' }); message.success('任务已暂停') }}>暂停</Button>
          )}
          <Button type="link" size="small">编辑</Button>
          <Popconfirm title="确定删除吗？" onConfirm={async () => { await delay(300); removeSyncTask(record.id); message.success('删除成功') }}>
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
          <Button type="link" size="small" onClick={() => message.info('同步日志')}>查看日志</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <DataSubNav />
      <PageHeader title="同步任务" description="数据同步至灵悉智能体平台及数据仓库" />
      <Table columns={columns} dataSource={syncTasks} rowKey="id" pagination={{ pageSize: 10 }} />
    </div>
  )
}

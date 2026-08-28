import { Table, Button, Space, Popconfirm, message } from 'antd'
import PageHeader from '@/components/PageHeader'
import StatusTag from '@/components/StatusTag'
import KnowledgeSubNav from './components/KnowledgeSubNav'
import { useKnowledgeContext } from './KnowledgeContext'
import { delay } from '@/utils/mockApi'
import type { SyncTask } from '@/types'

export default function Sync() {
  const { syncTasks, updateSyncTask, removeSyncTask } = useKnowledgeContext()

  const columns = [
    { title: '任务名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '知识库', dataIndex: 'kbName', key: 'kbName' },
    { title: '数据源', dataIndex: 'source', key: 'source', ellipsis: true },
    { title: '目标', dataIndex: 'target', key: 'target' },
    { title: 'Cron', dataIndex: 'cron', key: 'cron', render: (c: string) => <code>{c}</code> },
    { title: '同步频率', dataIndex: 'frequency', key: 'frequency' },
    { title: '文档数', dataIndex: 'docCount', key: 'docCount' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <StatusTag status={s} /> },
    { title: '最近同步', dataIndex: 'lastSync', key: 'lastSync' },
    { title: '下次同步', dataIndex: 'nextSync', key: 'nextSync', render: (v: string) => v ?? '—' },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: SyncTask) => (
        <Space size={0}>
          {record.status !== 'running' && (
            <Button type="link" size="small" onClick={() => { updateSyncTask(record.id, { status: 'running' }); message.success('任务已启动') }}>启动</Button>
          )}
          {record.status === 'running' && (
            <Button type="link" size="small" onClick={() => { updateSyncTask(record.id, { status: 'waiting' }); message.success('任务已暂停') }}>暂停</Button>
          )}
          <Button type="link" size="small" onClick={async () => { await delay(500); updateSyncTask(record.id, { lastSync: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'), status: 'completed' }); message.success('同步完成') }}>立即同步</Button>
          <Popconfirm title="确定删除吗？" onConfirm={async () => { await delay(300); removeSyncTask(record.id); message.success('删除成功') }}>
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <KnowledgeSubNav />
      <PageHeader title="同步任务" description="Cron 定时同步任务，保持知识库内容持续更新" />
      <Table columns={columns} dataSource={syncTasks} rowKey="id" pagination={{ pageSize: 10 }} scroll={{ x: 1200 }} />
    </div>
  )
}

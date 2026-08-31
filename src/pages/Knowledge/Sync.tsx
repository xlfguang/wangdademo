import { useState } from 'react'
import { Table, Button, Space, Popconfirm, message, Modal, Form, Input, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import StatusTag from '@/components/StatusTag'
import KnowledgeSubNav from './components/KnowledgeSubNav'
import { useKnowledgeContext } from './KnowledgeContext'
import { delay, generateId } from '@/utils/mockApi'
import type { SyncTask } from '@/types'

export default function Sync() {
  const { syncTasks, addSyncTask, updateSyncTask, removeSyncTask, bases } = useKnowledgeContext()
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()

  const handleCreate = async () => {
    const values = await form.validateFields()
    const kb = bases.find((b) => b.id === values.kbId)
    const task: SyncTask = {
      id: generateId(),
      name: values.name,
      kbId: values.kbId,
      kbName: kb?.name ?? '',
      source: values.source,
      target: '向量库',
      cron: values.cron,
      frequency: values.frequency,
      docCount: 0,
      status: 'waiting',
      lastSync: '—',
      nextSync: '待计算',
    }
    addSyncTask(task)
    setModalOpen(false)
    form.resetFields()
    message.success('同步任务已创建')
  }

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
      <PageHeader
        title="同步任务"
        description="Cron 定时同步任务，保持知识库内容持续更新"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            新建同步任务
          </Button>
        }
      />
      <Table columns={columns} dataSource={syncTasks} rowKey="id" pagination={{ pageSize: 10 }} scroll={{ x: 1200 }} />
      <Modal
        title="新建同步任务"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={
          <Space>
            <Button onClick={() => setModalOpen(false)}>取消</Button>
            <Button type="primary" onClick={handleCreate}>创建</Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="任务名称" rules={[{ required: true }]}>
            <Input placeholder="如：行业报告每日同步" />
          </Form.Item>
          <Form.Item name="kbId" label="目标知识库" rules={[{ required: true }]}>
            <Select options={bases.map((b) => ({ label: b.name, value: b.id }))} placeholder="选择知识库" />
          </Form.Item>
          <Form.Item name="source" label="数据源" rules={[{ required: true }]}>
            <Select options={['OA 文档库', 'CRM 系统', 'Git 文档仓库', '行业数据库 API', '搜索爬虫插件'].map((v) => ({ label: v, value: v }))} />
          </Form.Item>
          <Form.Item name="cron" label="Cron 表达式" rules={[{ required: true }]} initialValue="0 2 * * *">
            <Input />
          </Form.Item>
          <Form.Item name="frequency" label="同步频率" rules={[{ required: true }]} initialValue="每天 02:00">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

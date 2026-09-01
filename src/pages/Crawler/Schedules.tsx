import { useState, useEffect } from 'react'
import { Table, Button, Switch, Modal, Form, Input, Select, message, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import StatusTag from '@/components/StatusTag'
import CrawlerSubNav from './components/CrawlerSubNav'
import { useMenuData } from '@/mock/useMenuData'
import { persistMenuUpdate } from '@/mock/dataSource'
import type { CrawlerData, CrawlerSchedule } from '@/mock/crawler'
import { generateId } from '@/utils/mockApi'

export default function Schedules() {
  const { data } = useMenuData<CrawlerData>('crawler')
  const [schedules, setSchedules] = useState<CrawlerSchedule[]>(data.crawlerSchedules.map((s) => ({ ...s })))

  useEffect(() => {
    setSchedules(data.crawlerSchedules.map((s) => ({ ...s })))
  }, [data])
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()

  const toggleEnabled = (id: string, enabled: boolean) => {
    setSchedules((prev) => prev.map((s) => (s.id === id ? { ...s, enabled, status: enabled ? 'waiting' : s.status } : s)))
    persistMenuUpdate<CrawlerData>('crawler', (d) => ({ ...d, crawlerSchedules: d.crawlerSchedules.map((s) => (s.id === id ? { ...s, enabled, status: enabled ? 'waiting' : s.status } : s)) }))
    message.success(enabled ? '定时任务已启用' : '定时任务已停用')
  }

  const handleCreate = async () => {
    const values = await form.validateFields()
    const newTask: CrawlerSchedule = {
      id: generateId(),
      name: values.name,
      keyword: values.keyword,
      cron: values.cron,
      frequency: values.frequency,
      dataSource: values.dataSource,
      enabled: true,
      lastRun: '—',
      nextRun: '待计算',
      status: 'waiting',
    }
    setSchedules((prev) => [newTask, ...prev])
    persistMenuUpdate<CrawlerData>('crawler', (d) => ({ ...d, crawlerSchedules: [newTask, ...d.crawlerSchedules] }))
    setModalOpen(false)
    form.resetFields()
    message.success('定时任务已创建')
  }

  const columns = [
    { title: '任务名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '关键词', dataIndex: 'keyword', key: 'keyword', ellipsis: true },
    { title: 'Cron', dataIndex: 'cron', key: 'cron', render: (c: string) => <code>{c}</code> },
    { title: '频率', dataIndex: 'frequency', key: 'frequency' },
    { title: '数据源', dataIndex: 'dataSource', key: 'dataSource' },
    { title: '上次执行', dataIndex: 'lastRun', key: 'lastRun' },
    { title: '下次执行', dataIndex: 'nextRun', key: 'nextRun' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <StatusTag status={s} /> },
    {
      title: '启停',
      key: 'enabled',
      render: (_: unknown, record: CrawlerSchedule) => (
        <Switch checked={record.enabled} onChange={(v) => toggleEnabled(record.id, v)} />
      ),
    },
  ]

  return (
    <div>
      <CrawlerSubNav />
      <PageHeader
        title="定时任务"
        description="Cron 定时采集任务，支持启停与新建"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            新建定时任务
          </Button>
        }
      />
      <Table columns={columns} dataSource={schedules} rowKey="id" pagination={{ pageSize: 10 }} scroll={{ x: 1100 }} />
      <Modal
        title="新建定时任务"
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
            <Input placeholder="如：行业资讯每日采集" />
          </Form.Item>
          <Form.Item name="keyword" label="检索关键词" rules={[{ required: true }]}>
            <Input placeholder="如：人工智能 政策" />
          </Form.Item>
          <Form.Item name="cron" label="Cron 表达式" rules={[{ required: true }]} initialValue="0 2 * * *">
            <Input placeholder="0 2 * * *" />
          </Form.Item>
          <Form.Item name="frequency" label="执行频率" rules={[{ required: true }]} initialValue="每天 02:00">
            <Input />
          </Form.Item>
          <Form.Item name="dataSource" label="数据源" rules={[{ required: true }]}>
            <Select options={['百度', '搜狗', '微博+知乎', '学术数据库', '竞品官网'].map((v) => ({ label: v, value: v }))} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

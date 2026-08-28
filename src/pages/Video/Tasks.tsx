import { useState, useMemo, useCallback } from 'react'
import { Table, Button, Progress, Select, Input, Form, Space, message } from 'antd'
import { PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import StatusTag from '@/components/StatusTag'
import VideoSubNav from './components/VideoSubNav'
import CreateTaskDrawer from './components/CreateTaskDrawer'
import { useVideoTasks } from './VideoTaskContext'
import { useDeepLinkAction } from '@/utils/deepLink'
import { filterBySearch, filterByStatus, paginate } from '@/utils/mockApi'
import { VIDEO_PROCESS_TYPES } from '@/types'
import type { VideoTask } from '@/types'

const statusOptions = [
  { label: '待处理', value: 'queued' },
  { label: '处理中', value: 'running' },
  { label: '已完成', value: 'completed' },
  { label: '失败', value: 'failed' },
]

export default function Tasks() {
  const navigate = useNavigate()
  const { tasks, cancelTask, retryTask } = useVideoTasks()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [initialProcessType, setInitialProcessType] = useState<string>()
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState<string | undefined>()
  const [typeFilter, setTypeFilter] = useState<string | undefined>()
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    let result = filterBySearch(tasks, keyword, ['name', 'fileName', 'processType', 'taskId'])
    result = filterByStatus(result, status)
    if (typeFilter) result = result.filter((t) => t.processType === typeFilter)
    return result
  }, [tasks, keyword, status, typeFilter])

  const paged = paginate(filtered, page, 10)

  const openCreateDrawer = useCallback((processType?: string) => {
    setInitialProcessType(processType)
    setDrawerOpen(true)
  }, [])

  useDeepLinkAction('create', useCallback((params) => {
    openCreateDrawer(params.get('processType') ?? undefined)
  }, [openCreateDrawer]))

  const handleCancel = (record: VideoTask) => {
    cancelTask(record.id)
    message.success('任务已取消')
  }

  const handleRetry = (record: VideoTask) => {
    retryTask(record.id)
    message.success('任务已重新提交')
  }

  const columns = [
    { title: '任务名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '视频名称', dataIndex: 'fileName', key: 'fileName', ellipsis: true },
    { title: '处理类型', dataIndex: 'processType', key: 'processType' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <StatusTag status={s} /> },
    { title: '进度', dataIndex: 'progress', key: 'progress', render: (p: number) => <Progress percent={p} size="small" style={{ width: 80 }} /> },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: VideoTask) => (
        <Space size={0}>
          <Button type="link" size="small" onClick={() => navigate(`/video/task/${record.id}`)}>查看</Button>
          {(record.status === 'running' || record.status === 'queued') && (
            <Button type="link" size="small" danger onClick={() => handleCancel(record)}>取消</Button>
          )}
          {record.status === 'failed' && (
            <Button type="link" size="small" onClick={() => handleRetry(record)}>重试</Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <VideoSubNav />
      <PageHeader
        title="视频处理任务"
        description="管理视频处理任务，支持剪辑、转码、压缩及 AI 分析"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => openCreateDrawer()}>创建任务</Button>}
      />
      <Form layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item>
          <Input
            placeholder="关键词搜索"
            prefix={<SearchOutlined />}
            allowClear
            style={{ width: 220 }}
            value={keyword}
            onChange={(e) => { setKeyword(e.target.value); setPage(1) }}
          />
        </Form.Item>
        <Form.Item>
          <Select
            placeholder="类型筛选"
            allowClear
            style={{ width: 140 }}
            value={typeFilter}
            onChange={(v) => { setTypeFilter(v); setPage(1) }}
            options={VIDEO_PROCESS_TYPES.map((v) => ({ label: v, value: v }))}
          />
        </Form.Item>
        <Form.Item>
          <Select
            placeholder="状态筛选"
            allowClear
            style={{ width: 120 }}
            value={status}
            onChange={(v) => { setStatus(v); setPage(1) }}
            options={statusOptions}
          />
        </Form.Item>
        <Form.Item>
          <Button icon={<ReloadOutlined />} onClick={() => { setKeyword(''); setStatus(undefined); setTypeFilter(undefined); setPage(1) }}>重置</Button>
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        dataSource={paged}
        rowKey="id"
        pagination={{ current: page, pageSize: 10, total: filtered.length, onChange: setPage }}
      />
      <CreateTaskDrawer
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setInitialProcessType(undefined) }}
        initialProcessType={initialProcessType}
      />
    </div>
  )
}

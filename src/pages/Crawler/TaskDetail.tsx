import { Card, Descriptions, Progress, Button, Result, Table, Tag } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import StatusTag from '@/components/StatusTag'
import { useCrawlerContext } from './CrawlerContext'
import { searchLogsMock } from '@/mock/crawler'

export default function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTask } = useCrawlerContext()
  const task = getTask(id ?? '')

  if (!task) {
    return <Result status="404" title="任务不存在" extra={<Button type="primary" onClick={() => navigate('/crawler/overview')}>返回概览</Button>} />
  }

  const progress = task.progress ?? Math.round((task.collectedCount / task.collectCount) * 100)

  const logColumns = [
    { title: '数据标题', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: '抓取时间', dataIndex: 'time', key: 'time' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => s === 'success' ? <Tag color="success">成功</Tag> : <Tag color="error">失败</Tag> },
    { title: '失败原因', dataIndex: 'reason', key: 'reason', render: (r: string) => r ?? '—' },
  ]

  return (
    <div>
      <Button type="link" onClick={() => navigate('/crawler/overview')} style={{ padding: 0, marginBottom: 16 }}>← 返回概览</Button>
      <Card title={task.name} bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
        <Descriptions column={3}>
          <Descriptions.Item label="Task ID">{task.taskId}</Descriptions.Item>
          <Descriptions.Item label="关键词">{task.keyword}</Descriptions.Item>
          <Descriptions.Item label="数据源">{task.dataSource ?? task.source}</Descriptions.Item>
          <Descriptions.Item label="检索方式">{task.scheduleType === 'scheduled' ? `定时（${task.scheduleFreq ?? '—'}）` : '即时检索'}</Descriptions.Item>
          <Descriptions.Item label="时间范围">{task.timeRange ?? '—'}</Descriptions.Item>
          <Descriptions.Item label="去重率">{task.dedupeRate != null ? `${task.dedupeRate}%` : '—'}</Descriptions.Item>
          <Descriptions.Item label="采集进度"><Progress percent={progress} style={{ width: 120 }} /></Descriptions.Item>
          <Descriptions.Item label="已采集">{task.collectedCount} / {task.collectCount}</Descriptions.Item>
          <Descriptions.Item label="状态"><StatusTag status={task.status} /></Descriptions.Item>
          <Descriptions.Item label="创建时间">{task.createdAt}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{task.updatedAt}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Card title="抓取日志" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }} extra={
        <Button type="link" onClick={() => navigate('/crawler/search')}>查看完整结果</Button>
      }>
        <Table columns={logColumns} dataSource={searchLogsMock} rowKey="id" size="small" pagination={false} />
      </Card>
      <Button type="primary" onClick={() => navigate('/crawler/opinion')}>查看关联舆情</Button>
    </div>
  )
}

import { Card, Descriptions, Progress, Button, Result, Table, Tabs, Timeline, Tag } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import TaskStatusTag, { PriorityTag } from './components/TaskStatusTag'
import { useTaskContext } from './TaskContext'
import { useMenuData } from '@/mock/useMenuData'
import type { TaskData } from '@/mock/task'

export default function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTask } = useTaskContext()
  const { data } = useMenuData<TaskData>('task')
  const { collabTasks, progressLogs, operationLogs, taskDocuments, chatMessages } = data
  const task = getTask(id ?? '')

  if (!task) {
    return <Result status="404" title="任务不存在" extra={<Button type="primary" onClick={() => navigate('/task/overview')}>返回概览</Button>} />
  }

  const children = collabTasks.filter((t) => t.parentId === task.id)
  const logs = progressLogs.filter((l) => l.taskId === task.id)
  const ops = operationLogs.filter((o) => o.taskId === task.id)
  const docs = taskDocuments.filter((d) => d.taskId === task.id)
  const chats = chatMessages.filter((m) => m.taskId === task.id)

  const tabItems = [
    {
      key: 'info',
      label: '基本信息',
      children: (
        <Descriptions column={2} bordered size="small">
          <Descriptions.Item label="任务名称">{task.name}</Descriptions.Item>
          <Descriptions.Item label="状态"><TaskStatusTag status={task.status} /></Descriptions.Item>
          <Descriptions.Item label="优先级"><PriorityTag priority={task.priority} /></Descriptions.Item>
          <Descriptions.Item label="进度"><Progress percent={task.progress} style={{ width: 120 }} /></Descriptions.Item>
          <Descriptions.Item label="负责人">{task.owner}</Descriptions.Item>
          <Descriptions.Item label="参与人">{task.participants.join('、') || '—'}</Descriptions.Item>
          <Descriptions.Item label="开始时间">{task.startDate}</Descriptions.Item>
          <Descriptions.Item label="截止时间">{task.endDate}</Descriptions.Item>
          <Descriptions.Item label="描述" span={2}>{task.description ?? '—'}</Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      key: 'subtasks',
      label: `子任务 (${children.length})`,
      children: children.length > 0 ? (
        <Table size="small" rowKey="id" dataSource={children} pagination={false} columns={[
          { title: '名称', dataIndex: 'name' },
          { title: '负责人', dataIndex: 'owner' },
          { title: '进度', dataIndex: 'progress', render: (p: number) => `${p}%` },
          { title: '状态', dataIndex: 'status', render: (s: typeof task.status) => <TaskStatusTag status={s} /> },
          { title: '操作', render: (_: unknown, r: typeof children[0]) => <Button type="link" size="small" onClick={() => navigate(`/task/task/${r.id}`)}>查看</Button> },
        ]} />
      ) : <span style={{ color: 'var(--color-text-secondary)' }}>暂无子任务</span>,
    },
    {
      key: 'progress',
      label: '进度日志',
      children: <Timeline items={logs.map((l) => ({ children: `${l.time} · ${l.operator} 更新至 ${l.progress}%：${l.note}` }))} />,
    },
    {
      key: 'docs',
      label: '关联资料',
      children: <Table size="small" rowKey="id" dataSource={docs} pagination={false} columns={[
        { title: '文件名', dataIndex: 'name' }, { title: '目录', dataIndex: 'folder' }, { title: '大小', dataIndex: 'size' },
      ]} />,
    },
    {
      key: 'chat',
      label: '沟通记录',
      children: chats.map((m) => <div key={m.id} style={{ marginBottom: 8 }}><Tag>{m.sender}</Tag> {m.content} <span style={{ color: '#999', fontSize: 12 }}>{m.time}</span></div>),
    },
    {
      key: 'ops',
      label: '操作日志',
      children: <Table size="small" rowKey="id" dataSource={ops} pagination={false} columns={[
        { title: '时间', dataIndex: 'time', width: 160 },
        { title: '操作', dataIndex: 'action' },
        { title: '操作人', dataIndex: 'operator', width: 100 },
        { title: '详情', dataIndex: 'detail', render: (d: string) => d ?? '—' },
      ]} />,
    },
  ]

  return (
    <div>
      <Button type="link" onClick={() => navigate('/task/tasks')} style={{ padding: 0, marginBottom: 16 }}>← 返回任务列表</Button>
      <Card title={task.name} bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
        <Tabs items={tabItems} />
      </Card>
    </div>
  )
}

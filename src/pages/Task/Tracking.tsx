import { useState, useCallback } from 'react'
import { Card, Radio, Progress, Table, Button, Modal, Form, InputNumber, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import TaskSubNav from './components/TaskSubNav'
import TaskStatusTag, { PriorityTag } from './components/TaskStatusTag'
import { useTaskContext } from './TaskContext'
import { teamStats } from '@/mock/task'
import { useDeepLinkAction } from '@/utils/deepLink'
import { generateId, delay } from '@/utils/mockApi'
import type { CollabTask, CollabTaskStatus } from '@/types'
import styles from './index.module.css'

const kanbanColumns: { key: CollabTaskStatus; title: string }[] = [
  { key: 'not_started', title: '未开始' },
  { key: 'in_progress', title: '进行中' },
  { key: 'completed', title: '已完成' },
  { key: 'pending_acceptance', title: '待验收' },
  { key: 'overdue', title: '已超时' },
]

export default function Tracking() {
  const navigate = useNavigate()
  const { tasks, updateTask, addProgressLog } = useTaskContext()
  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const [updateModal, setUpdateModal] = useState<CollabTask | null>(null)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  useDeepLinkAction('update', useCallback(() => {
    const target = tasks.find((t) => t.status === 'in_progress') ?? tasks[0]
    if (target) {
      setUpdateModal(target)
      form.setFieldsValue({ progress: target.progress, note: '' })
    }
  }, [tasks, form]))

  const handleUpdateProgress = async () => {
    if (!updateModal) return
    const values = await form.validateFields()
    setLoading(true)
    await delay(400)
    updateTask(updateModal.id, { progress: values.progress, status: values.progress >= 100 ? 'pending_acceptance' : 'in_progress' })
    addProgressLog({
      id: generateId(),
      taskId: updateModal.id,
      progress: values.progress,
      note: values.note,
      operator: '当前用户',
      time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
    })
    setLoading(false)
    setUpdateModal(null)
    message.success('进度已更新并通知参与人')
  }

  const listColumns = [
    { title: '任务', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '负责人', dataIndex: 'owner', key: 'owner' },
    { title: '优先级', dataIndex: 'priority', key: 'priority', render: (p: string) => <PriorityTag priority={p} /> },
    { title: '进度', dataIndex: 'progress', key: 'progress', render: (p: number) => <Progress percent={p} size="small" style={{ width: 100 }} /> },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: CollabTaskStatus) => <TaskStatusTag status={s} /> },
    { title: '截止', dataIndex: 'endDate', key: 'endDate' },
    { title: '操作', key: 'action', render: (_: unknown, r: CollabTask) => (
      <Button type="link" size="small" onClick={() => { setUpdateModal(r); form.setFieldsValue({ progress: r.progress, note: '' }) }}>更新进度</Button>
    ) },
  ]

  return (
    <div>
      <TaskSubNav />
      <PageHeader title="进度实时跟踪" description="看板/列表双视图，进度透明化管控" extra={
        <Radio.Group value={view} onChange={(e) => setView(e.target.value)} optionType="button" buttonStyle="solid" options={[{ label: '看板', value: 'kanban' }, { label: '列表', value: 'list' }]} />
      } />
      <div className={styles.statRow}>
        <div className={styles.statBox}><div className={styles.statValue}>{teamStats.completionRate}%</div><div className={styles.statLabel}>团队完成率</div></div>
        <div className={styles.statBox}><div className={styles.statValue}>{teamStats.inProgress}</div><div className={styles.statLabel}>进行中</div></div>
        <div className={styles.statBox}><div className={styles.statValue}>{teamStats.overdue}</div><div className={styles.statLabel}>超时任务</div></div>
      </div>
      {view === 'kanban' ? (
        <div className={styles.kanban}>
          {kanbanColumns.map((col) => (
            <div key={col.key} className={styles.kanbanCol}>
              <div className={styles.kanbanColTitle}>{col.title} ({tasks.filter((t) => t.status === col.key).length})</div>
              {tasks.filter((t) => t.status === col.key).map((t) => (
                <div key={t.id} className={styles.taskCard} onClick={() => navigate(`/task/task/${t.id}`)}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{t.owner} · {t.endDate}</div>
                  <Progress percent={t.progress} size="small" style={{ marginTop: 8 }} />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <Card bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
          <Table columns={listColumns} dataSource={tasks} rowKey="id" size="small" pagination={{ pageSize: 8 }} />
        </Card>
      )}
      <Modal title="更新任务进度" open={!!updateModal} onCancel={() => setUpdateModal(null)} onOk={handleUpdateProgress} confirmLoading={loading}>
        <Form form={form} layout="vertical">
          <Form.Item name="progress" label="进度 (%)" rules={[{ required: true }]}><InputNumber min={0} max={100} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="note" label="进度说明"><Input.TextArea rows={3} placeholder="阶段性成果说明" /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

import { useState, useCallback } from 'react'
import { Card, Table, Button, Modal, Form, Input, Select, Tag, message } from 'antd'
import { ExportOutlined, AuditOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import TaskSubNav from './components/TaskSubNav'
import { useTaskContext } from './TaskContext'
import { taskLedgers } from '@/mock/task'
import TaskStatusTag from './components/TaskStatusTag'
import { useDeepLinkAction } from '@/utils/deepLink'
import { delay } from '@/utils/mockApi'

export default function Closure() {
  const navigate = useNavigate()
  const { tasks, updateTask } = useTaskContext()
  const [acceptModal, setAcceptModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const pendingTasks = tasks.filter((t) => t.status === 'pending_acceptance')

  useDeepLinkAction('accept', useCallback(() => {
    if (pendingTasks.length > 0) setAcceptModal(true)
  }, [pendingTasks.length]))

  const handleSubmitAccept = async () => {
    const values = await form.validateFields()
    setLoading(true)
    await delay(500)
    const task = pendingTasks[0]
    if (task) updateTask(task.id, { status: 'archived' })
    setLoading(false)
    setAcceptModal(false)
    message.success(`验收${values.result === 'pass' ? '通过' : '驳回'}`)
  }

  const ledgerColumns = [
    { title: '任务名称', dataIndex: 'taskName', key: 'taskName', ellipsis: true },
    { title: '负责人', dataIndex: 'owner', key: 'owner' },
    { title: '参与人', dataIndex: 'participants', key: 'participants', render: (p: string[]) => p.join('、') },
    { title: '计划完成', dataIndex: 'plannedEnd', key: 'plannedEnd' },
    { title: '实际完成', dataIndex: 'actualEnd', key: 'actualEnd' },
    { title: '验收结果', dataIndex: 'acceptResult', key: 'acceptResult', render: (r: string) => <Tag color="success">{r}</Tag> },
    { title: '归档时间', dataIndex: 'archivedAt', key: 'archivedAt' },
    { title: '操作', key: 'action', render: (_: unknown, r: typeof taskLedgers[0]) => (
      <Button type="link" size="small" onClick={() => navigate(`/task/task/${r.taskId}`)}>查看详情</Button>
    ) },
  ]

  return (
    <div>
      <TaskSubNav />
      <PageHeader title="成果闭环反馈" description="验收提交、自动归档与工作台账" extra={
        <Button icon={<ExportOutlined />} onClick={() => message.success('台账已导出 Excel')}>导出台账</Button>
      } />
      <Card title="待验收任务" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }} extra={
        <Button type="primary" icon={<AuditOutlined />} disabled={pendingTasks.length === 0} onClick={() => setAcceptModal(true)}>审核验收</Button>
      }>
        {pendingTasks.length > 0 ? pendingTasks.map((t) => (
          <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--color-border)' }}>
            <div><strong>{t.name}</strong> · {t.owner} · <TaskStatusTag status={t.status} /></div>
            <Button type="link" onClick={() => navigate(`/task/task/${t.id}`)}>查看</Button>
          </div>
        )) : <span style={{ color: 'var(--color-text-secondary)' }}>暂无待验收任务</span>}
      </Card>
      <Card title="工作台账" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
        <Table columns={ledgerColumns} dataSource={taskLedgers} rowKey="id" size="middle" pagination={false} />
      </Card>
      <Modal title="验收审核" open={acceptModal} onCancel={() => setAcceptModal(false)} onOk={handleSubmitAccept} confirmLoading={loading}>
        <Form form={form} layout="vertical" initialValues={{ result: 'pass' }}>
          <Form.Item name="comment" label="验收说明"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="result" label="验收结果"><Select options={[{ label: '通过', value: 'pass' }, { label: '驳回', value: 'reject' }]} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

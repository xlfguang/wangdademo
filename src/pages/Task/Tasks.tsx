import { useState, useCallback } from 'react'
import { Card, Tree, Button, Modal, Form, Input, Select, DatePicker, Tag, Space, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import type { DataNode } from 'antd/es/tree'
import PageHeader from '@/components/PageHeader'
import TaskSubNav from './components/TaskSubNav'
import TaskStatusTag, { PriorityTag } from './components/TaskStatusTag'
import { useTaskContext } from './TaskContext'
import { useDeepLinkAction } from '@/utils/deepLink'
import { generateId, delay } from '@/utils/mockApi'
import type { CollabTask, TaskPriority } from '@/types'

const members = ['张明', '李华', '王芳', '赵强', '陈伟', '刘洋']

function buildTree(tasks: CollabTask[], parentId?: string): DataNode[] {
  return tasks
    .filter((t) => t.parentId === parentId)
    .map((t) => ({
      key: t.id,
      title: (
        <Space>
          <span>{t.name}</span>
          <TaskStatusTag status={t.status} />
          <PriorityTag priority={t.priority} />
          <Tag>{t.owner}</Tag>
        </Space>
      ),
      children: buildTree(tasks, t.id),
    }))
}

export default function Tasks() {
  const navigate = useNavigate()
  const { tasks, addTask } = useTaskContext()
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [parentId, setParentId] = useState<string | undefined>()
  const [form] = Form.useForm()

  const treeData = buildTree(tasks)

  const openCreate = (pid?: string) => {
    setParentId(pid)
    form.resetFields()
    setModalOpen(true)
  }

  useDeepLinkAction('create', useCallback(() => openCreate(), []))

  const handleCreate = async () => {
    const values = await form.validateFields()
    setLoading(true)
    await delay(400)
    const task: CollabTask = {
      id: generateId(),
      parentId,
      name: values.name,
      description: values.description,
      priority: values.priority as TaskPriority,
      status: 'not_started',
      progress: 0,
      owner: values.owner,
      participants: values.participants ?? [],
      watchers: values.watchers ?? [],
      startDate: values.dates?.[0]?.format('YYYY-MM-DD') ?? '',
      endDate: values.dates?.[1]?.format('YYYY-MM-DD') ?? '',
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
      createdBy: '当前用户',
    }
    addTask(task)
    setLoading(false)
    setModalOpen(false)
    message.success(parentId ? '子任务创建成功' : '总任务创建成功')
  }

  return (
    <div>
      <TaskSubNav />
      <PageHeader title="任务拆解分配" description="新建总任务、多级拆解子任务，配置负责人与时间节点" extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={() => openCreate()}>新建总任务</Button>
      } />
      <Card title="任务树形结构" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }} extra={
        <Button size="small" onClick={() => openCreate('t1')}>拆解子任务（示例）</Button>
      }>
        <Tree
          showLine
          treeData={treeData}
          onSelect={(keys) => keys[0] && navigate(`/task/task/${keys[0]}`)}
        />
      </Card>
      <Modal title={parentId ? '拆解子任务' : '新建总任务'} open={modalOpen} onCancel={() => setModalOpen(false)} onOk={handleCreate} confirmLoading={loading} width={560}>
        <Form form={form} layout="vertical" initialValues={{ priority: 'medium', owner: '张明' }}>
          <Form.Item name="name" label="任务名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="description" label="任务描述"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="priority" label="优先级"><Select options={[{ label: '高', value: 'high' }, { label: '中', value: 'medium' }, { label: '低', value: 'low' }]} /></Form.Item>
          <Form.Item name="owner" label="负责人" rules={[{ required: true }]}><Select options={members.map((m) => ({ label: m, value: m }))} /></Form.Item>
          <Form.Item name="participants" label="参与人"><Select mode="multiple" options={members.map((m) => ({ label: m, value: m }))} /></Form.Item>
          <Form.Item name="watchers" label="围观人"><Select mode="multiple" options={members.map((m) => ({ label: m, value: m }))} /></Form.Item>
          <Form.Item name="dates" label="起止时间"><DatePicker.RangePicker style={{ width: '100%' }} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

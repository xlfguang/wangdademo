import { useState } from 'react'
import { Row, Col, Card, List, Tag, Select, Button, Input, message } from 'antd'
import { BellOutlined, LinkOutlined } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import TaskSubNav from './components/TaskSubNav'
import { useTaskContext } from './TaskContext'
import { chatMessages, collabTasks } from '@/mock/task'
import styles from './index.module.css'

export default function Collab() {
  const { notifications, markNotificationRead } = useTaskContext()
  const [taskId, setTaskId] = useState('t1-2')
  const [msg, setMsg] = useState('')
  const messages = chatMessages.filter((m) => m.taskId === taskId)

  return (
    <div>
      <TaskSubNav />
      <PageHeader title="跨角色联动" description="任务会话、变更通知与上下游任务链动" />
      <Row gutter={16}>
        <Col span={14}>
          <Card title="任务沟通会话" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }} extra={
            <Select value={taskId} onChange={setTaskId} style={{ width: 200 }} options={collabTasks.map((t) => ({ label: t.name, value: t.id }))} />
          }>
            <div className={styles.chatPanel}>
              {messages.map((m) => (
                <div key={m.id} className={styles.chatBubble}>
                  <div className={styles.chatMeta}>{m.sender} · {m.time}</div>
                  <div>{m.content}</div>
                </div>
              ))}
            </div>
            <Input.TextArea rows={2} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="输入消息，支持 @成员" style={{ marginTop: 12 }} />
            <Button type="primary" style={{ marginTop: 8 }} onClick={() => { setMsg(''); message.success('消息已发送') }}>发送</Button>
          </Card>
        </Col>
        <Col span={10}>
          <Card title={<><BellOutlined /> 变更通知</>} bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
            <List dataSource={notifications} renderItem={(n) => (
              <List.Item actions={[!n.read && <Button type="link" size="small" onClick={() => markNotificationRead(n.id)}>标为已读</Button>]}>
                <List.Item.Meta
                  title={<>{n.type === 'warning' ? <Tag color="error">预警</Tag> : <Tag color="blue">变更</Tag>} {n.content}</>}
                  description={`${n.operator} · ${n.time}`}
                />
              </List.Item>
            )} />
          </Card>
          <Card title={<><LinkOutlined /> 上下游任务链</>} bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
            {collabTasks.filter((t) => t.upstreamIds && t.upstreamIds.length > 0).map((t) => (
              <div key={t.id} style={{ marginBottom: 12, fontSize: 13 }}>
                <strong>{t.name}</strong>
                <div style={{ color: 'var(--color-text-secondary)' }}>上游：{t.upstreamIds!.map((id) => collabTasks.find((x) => x.id === id)?.name).join(' → ')}</div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

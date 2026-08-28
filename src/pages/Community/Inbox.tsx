import { useState } from 'react'
import { Card, Table, Tag, Select, Space } from 'antd'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import CommunitySubNav from './components/CommunitySubNav'
import { useCommunityContext } from './CommunityContext'
import type { AggregatedMessage, MessageChannel } from '@/types'
import styles from './index.module.css'

const channelColors: Record<MessageChannel, string> = {
  wework: 'blue',
  wechat: 'green',
  sms: 'orange',
  email: 'purple',
  telegram: 'cyan',
  web: 'geekblue',
}

const statusLabels: Record<AggregatedMessage['status'], { color: string; label: string }> = {
  unread: { color: 'red', label: '未读' },
  read: { color: 'default', label: '已读' },
  replied: { color: 'success', label: '已回复' },
  transferred: { color: 'warning', label: '已转人工' },
}

export default function Inbox() {
  const navigate = useNavigate()
  const { messages, setSelectedMessage } = useCommunityContext()
  const [channelFilter, setChannelFilter] = useState<string | undefined>()
  const [statusFilter, setStatusFilter] = useState<string | undefined>()

  const filtered = messages.filter((m) => {
    if (channelFilter && m.channelType !== channelFilter) return false
    if (statusFilter && m.status !== statusFilter) return false
    return true
  })

  const handleRowClick = (record: AggregatedMessage) => {
    setSelectedMessage(record)
    navigate('/community/ai-reply')
  }

  const columns = [
    { title: '发送者', dataIndex: 'sender', key: 'sender', width: 120 },
    {
      title: '消息内容', dataIndex: 'content', key: 'content', ellipsis: true,
      render: (text: string) => <span style={{ color: 'var(--color-dark)' }}>{text}</span>,
    },
    {
      title: '渠道', dataIndex: 'channelType', key: 'channel',
      width: 110,
      render: (_: MessageChannel, r: AggregatedMessage) => (
        <Tag color={channelColors[r.channelType]}>{r.channel}</Tag>
      ),
    },
    { title: '所属社群', dataIndex: 'groupName', key: 'groupName', width: 160, render: (v?: string) => v ?? '—' },
    { title: '接收时间', dataIndex: 'receivedAt', key: 'receivedAt', width: 150 },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 100,
      render: (s: AggregatedMessage['status']) => {
        const cfg = statusLabels[s]
        return <Tag color={cfg.color}>{cfg.label}</Tag>
      },
    },
  ]

  return (
    <div>
      <CommunitySubNav />
      <PageHeader title="消息收件箱" description="多平台消息统一聚合，支持渠道与状态筛选" />
      <Card bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
        <Space style={{ marginBottom: 16 }}>
          <Select
            allowClear
            placeholder="渠道筛选"
            style={{ width: 140 }}
            value={channelFilter}
            onChange={setChannelFilter}
            options={[
              { label: '企业微信', value: 'wework' },
              { label: '微信公众号', value: 'wechat' },
              { label: '短信', value: 'sms' },
              { label: '邮件', value: 'email' },
              { label: 'Web', value: 'web' },
            ]}
          />
          <Select
            allowClear
            placeholder="状态筛选"
            style={{ width: 140 }}
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: '未读', value: 'unread' },
              { label: '已读', value: 'read' },
              { label: '已回复', value: 'replied' },
              { label: '已转人工', value: 'transferred' },
            ]}
          />
        </Space>
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          size="middle"
          pagination={{ pageSize: 8 }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            className: styles.messageRow,
          })}
        />
      </Card>
    </div>
  )
}

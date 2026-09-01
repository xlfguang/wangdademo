import { useState, useEffect } from 'react'
import { Card, Input, Button, Progress, Tag, Space, message } from 'antd'
import { RobotOutlined, SendOutlined, UserSwitchOutlined, ThunderboltOutlined } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import CommunitySubNav from './components/CommunitySubNav'
import { useCommunityContext } from './CommunityContext'
import { useMenuData } from '@/mock/useMenuData'
import type { CommunityData } from '@/mock/community'
import { delay } from '@/utils/mockApi'
import styles from './index.module.css'

const { TextArea } = Input

export default function AiReply() {
  const {
    selectedMessage,
    setSelectedMessage,
    intents,
    setIntents,
    autoReply,
    setAutoReply,
    updateMessageStatus,
  } = useCommunityContext()
  const { data } = useMenuData<CommunityData>('community')
  const { intentTop3Mock, autoReplyMock } = data

  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    if (selectedMessage) {
      setInputText(selectedMessage.content)
    }
  }, [selectedMessage])

  const handleRecognize = async () => {
    if (!inputText.trim()) {
      message.warning('请输入或选择一条消息')
      return
    }
    setLoading(true)
    setIntents([])
    setAutoReply('')
    setReplyText('')
    await delay(800)
    setIntents(intentTop3Mock)
    setAutoReply(autoReplyMock)
    setReplyText(autoReplyMock)
    setLoading(false)
    message.success('意图识别完成')
  }

  const handleAutoReply = async () => {
    if (!replyText.trim()) {
      message.warning('请先生成回复内容')
      return
    }
    await delay(500)
    if (selectedMessage) {
      updateMessageStatus(selectedMessage.id, 'replied')
    }
    message.success('自动回复已发送')
  }

  const handleTransfer = async () => {
    await delay(400)
    if (selectedMessage) {
      updateMessageStatus(selectedMessage.id, 'transferred')
    }
    message.success('已转接人工客服')
  }

  return (
    <div>
      <CommunitySubNav />
      <PageHeader title="AI 智能回复" description="意图识别 Top-3，支持自动回复与转人工" />
      <div className={styles.aiPanel}>
        <div style={{ fontSize: 18, fontWeight: 600, color: '#7c5cfc', marginBottom: 12 }}>
          <ThunderboltOutlined /> AI 意图识别引擎
        </div>
        {selectedMessage && (
          <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--color-text-secondary)' }}>
            当前消息来自 <Tag color="blue">{selectedMessage.channel}</Tag>
            <span style={{ marginLeft: 8 }}>{selectedMessage.sender}</span>
            <Button type="link" size="small" onClick={() => setSelectedMessage(null)}>清除选择</Button>
          </div>
        )}
        <TextArea
          rows={3}
          placeholder="输入用户消息，或从收件箱选择一条消息..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ marginBottom: 12 }}
        />
        <Button
          type="primary"
          loading={loading}
          icon={<RobotOutlined />}
          onClick={handleRecognize}
          style={{ background: 'linear-gradient(135deg, #7c5cfc, #1677ff)', border: 'none' }}
        >
          识别意图
        </Button>
      </div>

      {intents.length > 0 && (
        <Card title="意图识别 Top-3" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          {intents.map((item, i) => (
            <div key={item.intent} className={styles.intentItem}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span><Tag color={i === 0 ? 'purple' : 'default'}>#{i + 1}</Tag> <strong>{item.intent}</strong></span>
                <span style={{ color: '#7c5cfc', fontWeight: 600 }}>{(item.confidence * 100).toFixed(0)}%</span>
              </div>
              <Progress percent={Math.round(item.confidence * 100)} showInfo={false} strokeColor="#7c5cfc" size="small" />
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4 }}>{item.description}</div>
            </div>
          ))}
        </Card>
      )}

      {autoReply && (
        <Card title="AI 生成回复" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <TextArea rows={4} value={replyText} onChange={(e) => setReplyText(e.target.value)} />
          <Space style={{ marginTop: 16 }}>
            <Button type="primary" icon={<SendOutlined />} onClick={handleAutoReply}>发送自动回复</Button>
            <Button icon={<UserSwitchOutlined />} onClick={handleTransfer}>转人工</Button>
          </Space>
        </Card>
      )}
    </div>
  )
}

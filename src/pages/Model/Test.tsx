import { useState } from 'react'
import { Select, Button, Input, Tag, Spin, Card, Typography } from 'antd'
import PageHeader from '@/components/PageHeader'
import StatusTag from '@/components/StatusTag'
import ModelSubNav from './components/ModelSubNav'
import { useModelContext } from './ModelContext'
import { useMenuData } from '@/mock/useMenuData'
import type { ModelData } from '@/mock/model'
import { formatNumber } from '@/utils/format'
import { delay } from '@/utils/mockApi'
import styles from './index.module.css'

const { TextArea } = Input
const { Text } = Typography

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export default function Test() {
  const { models } = useModelContext()
  const { data } = useMenuData<ModelData>('model')
  const { testScenarios, testScenarioPrompts, mockTestResponses, modelTypeLabels, modelTypeColors } = data
  const enabledModels = models.filter((m) => m.status === 'enabled')
  const [selectedId, setSelectedId] = useState(enabledModels[0]?.id ?? '')
  const [scenario, setScenario] = useState(testScenarios[0])
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)

  const selectedModel = models.find((m) => m.id === selectedId)

  const handleScenarioChange = (s: string) => {
    setScenario(s)
    setInput(testScenarioPrompts[s] ?? '')
  }

  const handleClear = () => {
    setMessages([])
    setInput('')
  }

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)
    await delay(800)
    const response = mockTestResponses[scenario] ?? '模型响应：已收到您的测试请求，功能正常运行。'
    setMessages((prev) => [...prev, { role: 'assistant', content: response }])
    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div>
      <ModelSubNav />
      <PageHeader
        title="模型测试"
        description="选择模型与测试场景，验证模型性能"
        extra={
          <>
            <Select
              style={{ width: 240 }}
              value={selectedId}
              onChange={setSelectedId}
              options={enabledModels.map((m) => ({ label: m.name, value: m.id }))}
            />
            <Button onClick={handleClear} style={{ marginLeft: 8 }}>清空</Button>
          </>
        }
      />

      <div className={styles.testLayout}>
        <div className={styles.testMain}>
          <div className={styles.scenarioTabs}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingBottom: 12 }}>
              {testScenarios.map((s) => (
                <Button
                  key={s}
                  type={scenario === s ? 'primary' : 'default'}
                  size="small"
                  onClick={() => handleScenarioChange(s)}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
          <div className={styles.chatArea}>
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginTop: 120 }}>
                选择测试场景或直接输入提示词开始测试
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`${styles.chatMessage} ${msg.role === 'user' ? styles.chatMessageUser : ''}`}
              >
                <div className={`${styles.chatBubble} ${msg.role === 'user' ? styles.chatBubbleUser : styles.chatBubbleAssistant}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className={styles.chatMessage}>
                <Spin size="small" /> <Text type="secondary" style={{ marginLeft: 8 }}>模型响应中...</Text>
              </div>
            )}
          </div>
          <div className={styles.chatInputArea}>
            <div className={styles.chatInputRow}>
              <TextArea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入测试提示词... (Enter 发送, Shift+Enter 换行)"
                autoSize={{ minRows: 2, maxRows: 4 }}
                style={{ flex: 1 }}
              />
              <Button type="primary" loading={loading} onClick={handleSend}>发送</Button>
            </div>
          </div>
        </div>

        <div className={styles.testSidebar}>
          {selectedModel && (
            <Card title="模型信息" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
              <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{selectedModel.name}</div>
              <div style={{ marginBottom: 12 }}>
                <Tag color={modelTypeColors[selectedModel.type]}>{modelTypeLabels[selectedModel.type]}</Tag>
                <StatusTag status={selectedModel.status} />
              </div>
              <div className={styles.infoLabel}>服务地址</div>
              <div className={styles.infoValue}>{selectedModel.url}</div>
              <div className={styles.infoLabel}>API Key</div>
              <div className={styles.infoValue}>{selectedModel.apiKey}</div>
              <div className={styles.infoLabel}>累计调用</div>
              <div className={styles.infoValue}>{formatNumber(selectedModel.callCount)} 次</div>
              <div className={styles.infoLabel}>最后调用</div>
              <div className={styles.infoValue}>{selectedModel.lastCallAt}</div>
              <div className={styles.infoLabel}>平均延迟</div>
              <div className={styles.infoValue}>{selectedModel.avgLatency}</div>
            </Card>
          )}
          <Card title="性能指标" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>
              暂无性能数据，完成测试后将展示延迟与成功率
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

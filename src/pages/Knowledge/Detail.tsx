import { useState } from 'react'
import { Row, Col, Card, Statistic, Table, Steps, Button, Input, Spin, Result, Tag } from 'antd'
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design/icons'
import { useParams, useNavigate } from 'react-router-dom'
import StatusTag from '@/components/StatusTag'
import { useKnowledgeContext } from './KnowledgeContext'
import { docProcessSteps, qaPairs } from '@/mock/knowledge'
import { delay } from '@/utils/mockApi'
import styles from './index.module.css'

interface ChatMessage {
  role: 'user' | 'ai'
  content: string
}

export default function KnowledgeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getBase, getDocs } = useKnowledgeContext()
  const kb = getBase(id ?? '')
  const docs = getDocs(id ?? '')

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  if (!kb) {
    return (
      <Result
        status="404"
        title="知识库不存在"
        extra={<Button type="primary" onClick={() => navigate('/knowledge/bases')}>返回列表</Button>}
      />
    )
  }

  const handleAsk = async (question: string) => {
    if (!question.trim()) return
    setMessages((prev) => [...prev, { role: 'user', content: question }])
    setInput('')
    setLoading(true)
    await delay(800)
    const match = qaPairs.find((q) => q.question.includes(question) || question.includes(q.question.slice(0, 4)))
    const answer = match?.answer ?? '根据当前知识库内容，暂未找到与您问题完全匹配的信息。建议您查阅相关文档或联系管理员获取更多信息。'
    setMessages((prev) => [...prev, { role: 'ai', content: answer }])
    setLoading(false)
  }

  const docColumns = [
    { title: '文档名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '文件类型', dataIndex: 'fileType', key: 'fileType' },
    { title: '大小', dataIndex: 'size', key: 'size' },
    { title: '切片数量', dataIndex: 'sliceCount', key: 'sliceCount' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <StatusTag status={s} /> },
    { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt' },
  ]

  const runningDoc = docs.find((d) => d.status === 'running')
  const currentStep = runningDoc?.processStep ?? 5

  return (
    <div>
      <Button type="link" onClick={() => navigate('/knowledge/bases')} style={{ padding: 0, marginBottom: 16 }}>← 返回知识库列表</Button>
      <Row gutter={16}>
        <Col span={16}>
          <Card title={kb.name} bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
            {kb.description && <p style={{ color: 'var(--color-text-secondary)', marginBottom: 16 }}>{kb.description}</p>}
            <Row gutter={16}>
              <Col span={6}><Statistic title="文档数量" value={kb.docCount} /></Col>
              <Col span={6}><Statistic title="知识片段" value={kb.fragmentCount ?? Math.round(kb.vectorCount * 0.8)} /></Col>
              <Col span={6}><Statistic title="向量数量" value={kb.vectorCount} /></Col>
              <Col span={6}><Statistic title="存储空间" value={kb.storage} /></Col>
            </Row>
            <div style={{ marginTop: 12 }}>
              {kb.category && <Tag>{kb.category}</Tag>}
              {kb.embeddingModel && <Tag color="blue">{kb.embeddingModel}</Tag>}
              <StatusTag status={kb.status} />
            </div>
          </Card>
          <Card title="文档处理流程" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
            <Steps size="small" current={currentStep} items={docProcessSteps.map((t) => ({ title: t }))} />
          </Card>
          <Card title="文档列表" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
            <Table columns={docColumns} dataSource={docs} rowKey="id" pagination={false} size="small" />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title={<><RobotOutlined /> AI 知识库问答</>}
            bordered={false}
            className={styles.chatCard}
          >
            <div className={styles.chatMessages}>
              {messages.length === 0 && (
                <div className={styles.chatEmpty}>
                  <p>向「{kb.name}」提问，获取 AI 智能回答</p>
                  <div className={styles.quickQuestions}>
                    {qaPairs.slice(0, 3).map((q) => (
                      <Button key={q.question} size="small" type="dashed" block style={{ marginBottom: 8, textAlign: 'left', height: 'auto', whiteSpace: 'normal' }} onClick={() => handleAsk(q.question)}>
                        {q.question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={msg.role === 'user' ? styles.userMsg : styles.aiMsg}>
                  {msg.role === 'user' ? <UserOutlined className={styles.msgIcon} /> : <RobotOutlined className={styles.msgIcon} />}
                  <div className={styles.msgBubble}>{msg.content}</div>
                </div>
              ))}
              {loading && <div className={styles.loadingWrap}><Spin size="small" /> AI 正在思考...</div>}
            </div>
            <div className={styles.chatInput}>
              <Input placeholder="输入你的问题..." value={input} onChange={(e) => setInput(e.target.value)} onPressEnter={() => handleAsk(input)} />
              <Button type="primary" icon={<SendOutlined />} onClick={() => handleAsk(input)} loading={loading} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

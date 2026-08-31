import { useState } from 'react'
import { Row, Col, Card, Form, Input, Select, Radio, Button, Table, Tag, Spin, message } from 'antd'
import { SendOutlined, RobotOutlined, UserOutlined, LinkOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import KnowledgeSubNav from './components/KnowledgeSubNav'
import { useKnowledgeContext, searchHitsMock } from './KnowledgeContext'
import { qaPairs, ragSources } from '@/mock/knowledge'
import { delay } from '@/utils/mockApi'
import styles from './index.module.css'

interface ChatMessage {
  role: 'user' | 'ai'
  content: string
  sources?: typeof ragSources
}

export default function SearchPage() {
  const navigate = useNavigate()
  const { bases, searchHits, setSearchHits } = useKnowledgeContext()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)

  const handleSearch = async () => {
    const values = await form.validateFields()
    setLoading(true)
    await delay(600)
    const mode = values.searchMode as 'keyword' | 'semantic'
    const kbId = values.kbScope
    let hits = searchHitsMock.map((h) => ({ ...h, searchType: mode }))
    if (kbId && kbId !== 'all') {
      hits = hits.filter((h) => h.kbId === kbId)
    }
    if (values.keyword) {
      hits = hits.filter((h) =>
        h.title.includes(values.keyword) || h.snippet.includes(values.keyword) || mode === 'semantic',
      )
    }
    setSearchHits(hits)
    setLoading(false)
    message.success(`检索完成，找到 ${hits.length} 条结果`)
  }

  const handleAsk = async (question: string) => {
    if (!question.trim()) return
    setMessages((prev) => [...prev, { role: 'user', content: question }])
    setChatInput('')
    setChatLoading(true)
    await delay(800)
    const match = qaPairs.find((q) => q.question.includes(question) || question.includes(q.question.slice(0, 4)))
    const answer = match?.answer ?? '根据当前知识库内容，暂未找到与您问题完全匹配的信息。建议您查阅相关文档或联系管理员获取更多信息。'
    setMessages((prev) => [...prev, { role: 'ai', content: answer, sources: ragSources.slice(0, 3) }])
    setChatLoading(false)
  }

  const resultColumns = [
    { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: '摘要', dataIndex: 'snippet', key: 'snippet', ellipsis: true, width: 280 },
    { title: '来源文档', dataIndex: 'docName', key: 'docName', ellipsis: true },
    { title: '知识库', dataIndex: 'kbName', key: 'kbName' },
    {
      title: '相关度',
      dataIndex: 'score',
      key: 'score',
      render: (s: number) => <Tag color="blue" className={styles.scoreTag}>{(s * 100).toFixed(0)}%</Tag>,
    },
    {
      title: '检索类型',
      dataIndex: 'searchType',
      key: 'searchType',
      render: (t: string) => <Tag color={t === 'semantic' ? 'purple' : 'default'}>{t === 'semantic' ? '语义' : '关键词'}</Tag>,
    },
  ]

  return (
    <div>
      <KnowledgeSubNav />
      <PageHeader title="知识检索" description="关键词与语义检索，结合 AI 问答获取精准知识" />
      <Row gutter={16}>
        <Col span={14}>
          <Card title="检索配置" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
            <Form form={form} layout="vertical" initialValues={{ searchMode: 'semantic', kbScope: 'all' }}>
              <Form.Item name="keyword" label="检索关键词" rules={[{ required: true, message: '请输入关键词' }]}>
                <Input placeholder="如：RAG 知识库、AI 能力" />
              </Form.Item>
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item name="searchMode" label="检索模式">
                    <Radio.Group options={[{ label: '语义检索', value: 'semantic' }, { label: '关键词检索', value: 'keyword' }]} optionType="button" buttonStyle="solid" size="small" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="kbScope" label="知识库范围">
                    <Select options={[{ label: '全部知识库', value: 'all' }, ...bases.map((b) => ({ label: b.name, value: b.id }))]} />
                  </Form.Item>
                </Col>
              </Row>
              <Button type="primary" loading={loading} onClick={handleSearch}>开始检索</Button>
            </Form>
          </Card>
          <Card title="检索结果" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
            <Table columns={resultColumns} dataSource={searchHits} rowKey="id" pagination={{ pageSize: 8 }} size="middle" locale={{ emptyText: '请输入关键词开始检索' }} />
          </Card>
        </Col>
        <Col span={10}>
          <Card
            title={<><RobotOutlined /> AI 知识库问答</>}
            bordered={false}
            className={styles.chatCard}
          >
            <div className={styles.chatMessages}>
              {messages.length === 0 && (
                <div className={styles.chatEmpty}>
                  <p>向知识库提问，获取 AI 智能回答</p>
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
                <div key={i}>
                  <div className={msg.role === 'user' ? styles.userMsg : styles.aiMsg}>
                    {msg.role === 'user' ? <UserOutlined className={styles.msgIcon} /> : <RobotOutlined className={styles.msgIcon} />}
                    <div className={styles.msgBubble}>{msg.content}</div>
                  </div>
                  {msg.role === 'ai' && msg.sources && (
                    <div className={styles.ragSources}>
                      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
                        <LinkOutlined /> RAG 引用溯源
                      </div>
                      {msg.sources.map((src) => (
                        <Card
                          key={src.id}
                          size="small"
                          style={{ marginBottom: 8, cursor: 'pointer' }}
                          onClick={() => navigate(`/knowledge/base/${src.kbId}`)}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <Tag color="blue">{src.kbName}</Tag>
                            <Tag color="green">置信度 {(src.score * 100).toFixed(0)}%</Tag>
                          </div>
                          <div style={{ fontWeight: 500, fontSize: 13 }}>{src.docName}</div>
                          <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>{src.snippet}</div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {chatLoading && <div className={styles.loadingWrap}><Spin size="small" /> AI 正在思考...</div>}
            </div>
            <div className={styles.chatInput}>
              <Input placeholder="输入你的问题..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} onPressEnter={() => handleAsk(chatInput)} />
              <Button type="primary" icon={<SendOutlined />} onClick={() => handleAsk(chatInput)} loading={chatLoading} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

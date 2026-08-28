import { useState } from 'react'
import { Row, Col, Card, Progress, Table, Button, Tag, message } from 'antd'
import DataCleanSubNav from './components/DataCleanSubNav'
import { qualityReport, qualityCheckItems as initialItems } from '@/mock/dataClean'
import type { QualityCheckItem } from '@/types'
import styles from './index.module.css'

const categoryLabel: Record<string, string> = {
  dedupe: '去重',
  format: '格式统一',
  structure: '结构化',
}

const severityColor: Record<string, string> = {
  low: 'default',
  medium: 'warning',
  high: 'error',
}

export default function Quality() {
  const [items, setItems] = useState<QualityCheckItem[]>(initialItems)

  const handleReview = (id: string) => {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, status: 'passed' as const } : item))
    message.success('复核通过')
  }

  const scores = [
    { label: '去重质量', value: qualityReport.dedupeScore, color: '#1677ff' },
    { label: '格式统一', value: qualityReport.formatScore, color: '#7C5CFC' },
    { label: '结构化', value: qualityReport.structureScore, color: '#22c55e' },
  ]

  const columns = [
    { title: '字段', dataIndex: 'field', key: 'field', width: 100 },
    { title: '文档', dataIndex: 'document', key: 'document', ellipsis: true },
    { title: '问题描述', dataIndex: 'issue', key: 'issue', ellipsis: true },
    {
      title: '置信度', dataIndex: 'confidence', key: 'confidence', width: 90,
      render: (v: number) => <span className={v < 75 ? styles.lowConfidence : ''}>{v}%</span>,
    },
    {
      title: '类别', dataIndex: 'category', key: 'category', width: 90,
      render: (c: string) => <Tag>{categoryLabel[c] ?? c}</Tag>,
    },
    {
      title: '严重程度', dataIndex: 'severity', key: 'severity', width: 90,
      render: (s: string) => <Tag color={severityColor[s]}>{s === 'low' ? '低' : s === 'medium' ? '中' : '高'}</Tag>,
    },
    {
      title: '状态', dataIndex: 'status', key: 'status', width: 90,
      render: (s: string) => {
        const map: Record<string, { color: string; text: string }> = {
          pending: { color: 'warning', text: '待复核' },
          reviewed: { color: 'processing', text: '已复核' },
          passed: { color: 'success', text: '已通过' },
        }
        const m = map[s] ?? { color: 'default', text: s }
        return <Tag color={m.color}>{m.text}</Tag>
      },
    },
    {
      title: '操作', key: 'action', width: 100,
      render: (_: unknown, r: QualityCheckItem) => (
        r.status === 'pending'
          ? <Button type="link" size="small" onClick={() => handleReview(r.id)}>复核通过</Button>
          : '—'
      ),
    },
  ]

  return (
    <div>
      <DataCleanSubNav />
      <Card bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
        <Row gutter={16} align="middle">
          <Col span={6} className={styles.qualityScore}>
            <Progress type="dashboard" percent={qualityReport.overallScore} strokeColor="#1677ff" size={140} />
            <div style={{ marginTop: 8, fontWeight: 600 }}>整体质量评分</div>
          </Col>
          {scores.map((s) => (
            <Col span={6} key={s.label} className={styles.qualityScore}>
              <Progress type="circle" percent={s.value} size={100} strokeColor={s.color} />
              <div style={{ marginTop: 8, color: 'var(--color-text-secondary)' }}>{s.label}</div>
            </Col>
          ))}
        </Row>
      </Card>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card className={`${styles.metricCard} ${styles.valid}`} bordered={false}><div className={styles.qualityValue} style={{ color: '#22c55e' }}>{qualityReport.valid.toLocaleString()}</div><div>有效数据</div></Card></Col>
        <Col span={6}><Card className={`${styles.metricCard} ${styles.duplicate}`} bordered={false}><div className={styles.qualityValue} style={{ color: '#f59e0b' }}>{qualityReport.duplicate.toLocaleString()}</div><div>重复数据</div></Card></Col>
        <Col span={6}><Card className={`${styles.metricCard} ${styles.abnormal}`} bordered={false}><div className={styles.qualityValue} style={{ color: '#ef4444' }}>{qualityReport.abnormal.toLocaleString()}</div><div>异常数据</div></Card></Col>
        <Col span={6}><Card className={`${styles.metricCard} ${styles.quality}`} bordered={false}><div className={styles.qualityValue}>{qualityReport.qualityRate}%</div><div>数据质量</div></Card></Col>
      </Row>
      <Card title="低置信项清单" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }} extra={<Tag color="warning">{items.filter((i) => i.status === 'pending').length} 项待复核</Tag>}>
        <Table columns={columns} dataSource={items} rowKey="id" pagination={{ pageSize: 10 }} />
      </Card>
    </div>
  )
}

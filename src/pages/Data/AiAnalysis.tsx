import { useState } from 'react'
import { Card, Input, Button, Steps, Tag, Spin, Row } from 'antd'
import { ThunderboltOutlined } from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import DataSubNav from './components/DataSubNav'
import ExportReportButton from '@/components/ExportReportButton'
import { aiAnalysisPairs, salesTrend } from '@/mock/data'
import { delay } from '@/utils/mockApi'
import type { AiAnalysisResult } from '@/types'
import styles from './index.module.css'

const { TextArea } = Input

export default function AiAnalysis() {
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(-1)
  const [result, setResult] = useState<AiAnalysisResult | null>(null)

  const runAnalysis = async (q: string) => {
    if (!q.trim()) return
    setLoading(true)
    setResult(null)
    setStep(0)
    const steps = ['理解问题', '识别数据源', '生成分析方案', '执行数据分析', '生成可视化结果']
    for (let i = 0; i < steps.length; i++) {
      setStep(i)
      await delay(600)
    }
    const match = aiAnalysisPairs.find((p) => q.includes(p.question.slice(0, 4)) || p.question.includes(q.slice(0, 4))) ?? aiAnalysisPairs[0]
    setResult({ ...match, question: q })
    setLoading(false)
    setStep(steps.length)
  }

  const lineOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: salesTrend.months },
    yAxis: { type: 'value' },
    series: [{ type: 'line', smooth: true, data: salesTrend.values, lineStyle: { color: '#7c5cfc' }, areaStyle: { color: 'rgba(124,92,252,0.1)' } }],
  }

  return (
    <div>
      <DataSubNav />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <ExportReportButton
          filename="data-ai-analysis"
          data={result ? { question: result.question, conclusion: result.conclusion, findings: result.findings, suggestion: result.suggestion } : { status: '未分析' }}
        />
      </div>
      <div className={styles.aiPanel}>
        <div className={styles.aiTitle}><ThunderboltOutlined /> AI 数据分析助手</div>
        <TextArea rows={3} placeholder="输入你想分析的问题，例如：分析近6个月销售额下降的原因" value={question} onChange={(e) => setQuestion(e.target.value)} style={{ marginBottom: 12 }} />
        <Row gutter={[8, 8]} style={{ marginBottom: 12 }}>
          {aiAnalysisPairs.map((p) => (
            <Tag key={p.question} color="purple" style={{ cursor: 'pointer' }} onClick={() => { setQuestion(p.question); runAnalysis(p.question) }}>{p.question}</Tag>
          ))}
        </Row>
        <Button type="primary" loading={loading} onClick={() => runAnalysis(question)} style={{ background: 'linear-gradient(135deg, #7c5cfc, #1677ff)', border: 'none' }}>开始分析</Button>
      </div>

      {loading && step >= 0 && (
        <Card bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Steps current={step} size="small" items={['理解问题', '识别数据源', '生成分析方案', '执行数据分析', '生成可视化结果'].map((t) => ({ title: t }))} />
          <div style={{ textAlign: 'center', padding: 24 }}><Spin tip="AI 正在分析..." /></div>
        </Card>
      )}

      {result && !loading && (
        <Card title="AI 分析结果" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>分析结论</div>
          <div className={styles.summaryBlock}>{result.conclusion}</div>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>关键发现</div>
          <ul>{result.findings.map((f) => <li key={f} style={{ marginBottom: 4 }}>{f}</li>)}</ul>
          <div style={{ fontWeight: 600, margin: '16px 0 8px' }}>建议</div>
          <div className={styles.summaryBlock}>{result.suggestion}</div>
          <ReactECharts option={lineOption} style={{ height: 260, marginTop: 16 }} />
        </Card>
      )}
    </div>
  )
}

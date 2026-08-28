import { useState } from 'react'
import { Card, Button, Steps, Tabs, Tag, List, Tooltip, Progress, message } from 'antd'
import { ThunderboltOutlined } from '@ant-design/icons'
import AudioSubNav from './components/AudioSubNav'
import { useAudioContext } from './AudioContext'
import { delay } from '@/utils/mockApi'
import styles from './index.module.css'

export default function Extraction() {
  const { extraction } = useAudioContext()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(-1)
  const [done, setDone] = useState(true)

  const handleExtract = async () => {
    setLoading(true)
    setDone(false)
    const steps = ['理解文本', '识别实体', '生成要点', '完成']
    for (let i = 0; i < steps.length; i++) {
      setStep(i)
      await delay(600)
    }
    setDone(true)
    setLoading(false)
    message.success('关键信息提取完成')
  }

  const tabItems = [
    {
      key: 'keywords',
      label: '关键词',
      children: (
        <List dataSource={extraction.keywords} renderItem={(item) => (
          <List.Item><Tag color="blue">{item.text}</Tag><Tooltip title={`来源 ${item.source}`}><span style={{ color: 'var(--color-text-secondary)', fontSize: 12 }}>{item.source}</span></Tooltip></List.Item>
        )} />
      ),
    },
    {
      key: 'points',
      label: '核心要点',
      children: (
        <List dataSource={extraction.points} renderItem={(item) => (
          <List.Item><div className={styles.summaryBlock}>{item.text}<div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>来源 {item.source}</div></div></List.Item>
        )} />
      ),
    },
    {
      key: 'entities',
      label: '实体信息',
      children: (
        <List dataSource={extraction.entities} renderItem={(item) => (
          <List.Item><Tag>{item.type}</Tag> {item.text} <span style={{ color: 'var(--color-text-secondary)', fontSize: 12, marginLeft: 8 }}>{item.source}</span></List.Item>
        )} />
      ),
    },
    {
      key: 'tasks',
      label: '任务信息',
      children: (
        <List dataSource={extraction.tasks} renderItem={(item) => (
          <List.Item>
            <div>
              <div><strong>{item.text}</strong></div>
              {item.assignee && <div style={{ fontSize: 13 }}>责任人：{item.assignee}</div>}
              {item.deadline && <div style={{ fontSize: 13 }}>时间节点：{item.deadline}</div>}
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>来源 {item.source}</div>
            </div>
          </List.Item>
        )} />
      ),
    },
  ]

  return (
    <div>
      <AudioSubNav />
      <div className={styles.aiPanel}>
        <div style={{ fontSize: 18, fontWeight: 600, color: '#7c5cfc', marginBottom: 12 }}><ThunderboltOutlined /> 关键信息提取</div>
        <Button type="primary" loading={loading} onClick={handleExtract} style={{ background: 'linear-gradient(135deg, #7c5cfc, #1677ff)', border: 'none' }}>开始提取</Button>
        {loading && <Progress style={{ marginTop: 12 }} percent={((step + 1) / 4) * 100} showInfo={false} />}
      </div>
      {step >= 0 && !done && (
        <Card bordered={false} style={{ marginBottom: 16 }}>
          <Steps current={step} size="small" items={['理解文本', '识别实体', '生成要点', '完成'].map((t) => ({ title: t }))} />
        </Card>
      )}
      {done && (
        <Card title="提取结果" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }} extra={
          <Button onClick={() => message.success('已导出 TXT')}>导出 TXT</Button>
        }>
          <Tabs items={tabItems} />
        </Card>
      )}
    </div>
  )
}

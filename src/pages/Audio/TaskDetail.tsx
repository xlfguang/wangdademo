import { Card, Descriptions, Progress, Button, Result, Row, Col, Tag } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import StatusTag from '@/components/StatusTag'
import { useAudioContext } from './AudioContext'
import { extractionMock } from '@/mock/audio'
import styles from './index.module.css'

export default function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTask } = useAudioContext()
  const task = getTask(id ?? '')

  if (!task) {
    return <Result status="404" title="任务不存在" extra={<Button type="primary" onClick={() => navigate('/audio/overview')}>返回概览</Button>} />
  }

  return (
    <div>
      <Button type="link" onClick={() => navigate('/audio/overview')} style={{ padding: 0, marginBottom: 16 }}>← 返回概览</Button>
      <Card title={task.name} bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
        <Descriptions column={3}>
          <Descriptions.Item label="Task ID">{task.taskId}</Descriptions.Item>
          <Descriptions.Item label="音频文件">{task.audioFile}</Descriptions.Item>
          <Descriptions.Item label="处理类型">{task.processType}</Descriptions.Item>
          <Descriptions.Item label="格式">{task.format}</Descriptions.Item>
          <Descriptions.Item label="时长">{task.duration}</Descriptions.Item>
          <Descriptions.Item label="文件大小">{task.fileSize}</Descriptions.Item>
          <Descriptions.Item label="裁剪片段">{task.clipCount ?? 0} 个</Descriptions.Item>
          <Descriptions.Item label="状态"><StatusTag status={task.status} /></Descriptions.Item>
          <Descriptions.Item label="进度"><Progress percent={task.progress ?? 0} style={{ width: 120 }} /></Descriptions.Item>
          <Descriptions.Item label="创建时间">{task.createdAt}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{task.updatedAt}</Descriptions.Item>
        </Descriptions>
      </Card>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="转写摘要" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className={styles.summaryBlock}>各位同事大家好，今天我们主要讨论 Q3 产品路线图和 AI 能力插件的交付计划……</div>
            <Button type="link" onClick={() => navigate('/audio/transcription')}>查看完整转写</Button>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="关键信息预览" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
            {extractionMock.keywords.slice(0, 5).map((k) => <Tag key={k.text} color="purple" style={{ marginBottom: 4 }}>{k.text}</Tag>)}
            <div style={{ marginTop: 12 }}><Button type="link" onClick={() => navigate('/audio/extraction')}>查看完整提取结果</Button></div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

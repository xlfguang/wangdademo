import { Card, Descriptions, Steps, Progress, Row, Col, Button, Result, Table, Tag } from 'antd'
import { useParams, useNavigate } from 'react-router-dom'
import StatusTag from '@/components/StatusTag'
import { DataCleanProvider, useDataCleanContext } from './DataCleanContext'
import { useMenuData } from '@/mock/useMenuData'
import type { DataCleanData } from '@/mock/dataClean'
import styles from './index.module.css'

const categoryLabel: Record<string, string> = {
  office: '办公文档',
  multimodal: '多模态',
}

export default function DataCleanTaskDetail() {
  return (
    <DataCleanProvider>
      <TaskDetailContent />
    </DataCleanProvider>
  )
}

function TaskDetailContent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getTask, getBatch } = useDataCleanContext()
  const { data } = useMenuData<DataCleanData>('dataClean')
  const { pipelineLayers, qualityCheckItems, cleanDocuments } = data
  const task = getTask(id ?? '')
  const batch = task?.batchId ? getBatch(task.batchId) : undefined

  if (!task) {
    return <Result status="404" title="任务不存在" extra={<Button type="primary" onClick={() => navigate('/data-clean/overview')}>返回概览</Button>} />
  }

  const currentStep = task.status === 'completed' ? 5 : Math.floor(task.progress / 20)
  const batchDocs = cleanDocuments.filter((d) => d.batchId === task.batchId)

  const pipelineColumns = [
    { title: '层级', dataIndex: 'layer', key: 'layer', width: 80 },
    { title: '步骤', dataIndex: 'name', key: 'name' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <StatusTag status={s === 'completed' ? 'completed' : s === 'running' ? 'running' : 'queued'} /> },
    { title: '进度', dataIndex: 'progress', key: 'progress', render: (p: number) => <Progress percent={p} size="small" style={{ width: 120 }} /> },
  ]

  const docColumns = [
    { title: '文档名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '类型', dataIndex: 'fileType', key: 'fileType', width: 80 },
    { title: '页数/时长', key: 'pages', width: 100, render: (_: unknown, r: typeof batchDocs[0]) => r.duration ?? `${r.pages ?? '—'} 页` },
    { title: '置信度', dataIndex: 'confidence', key: 'confidence', width: 80, render: (v: number) => v ? `${v}%` : '—' },
    { title: '状态', dataIndex: 'status', key: 'status', width: 90, render: (s: string) => <StatusTag status={s} /> },
  ]

  const lowConfidence = qualityCheckItems.filter((q) => q.status === 'pending').slice(0, 3)

  return (
    <div>
      <Button type="link" onClick={() => navigate('/data-clean/overview')} style={{ padding: 0, marginBottom: 16 }}>← 返回概览</Button>
      <Card title={task.name} bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
        <Descriptions column={3}>
          <Descriptions.Item label="Task ID">{task.taskId}</Descriptions.Item>
          <Descriptions.Item label="批次号">{task.batchNo ?? '—'}</Descriptions.Item>
          <Descriptions.Item label="数据源">{task.dataSource}</Descriptions.Item>
          <Descriptions.Item label="文档类型">
            {task.category ? <Tag color={task.category === 'office' ? 'blue' : 'purple'}>{categoryLabel[task.category]}</Tag> : '—'}
          </Descriptions.Item>
          <Descriptions.Item label="状态"><StatusTag status={task.status} /></Descriptions.Item>
          <Descriptions.Item label="进度"><Progress percent={task.progress} style={{ width: 160 }} /></Descriptions.Item>
          <Descriptions.Item label="创建时间">{task.createdAt}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{task.updatedAt}</Descriptions.Item>
        </Descriptions>
      </Card>

      {batch && (
        <Card title="批次信息" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Descriptions column={3}>
            <Descriptions.Item label="批次名称">{batch.name}</Descriptions.Item>
            <Descriptions.Item label="提交方">{batch.submitter}</Descriptions.Item>
            <Descriptions.Item label="业务线">{batch.businessLine}</Descriptions.Item>
            <Descriptions.Item label="文件数">{batch.fileCount} 份</Descriptions.Item>
            <Descriptions.Item label="总页数">{batch.totalPages} 页</Descriptions.Item>
            <Descriptions.Item label="批次状态"><StatusTag status={batch.status} /></Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      <Card title="清洗流程" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
        <Steps current={currentStep} items={['数据导入', '类型识别', '清洗转化', '结构化', '质量校验', '清洗完成'].map((t) => ({ title: t }))} />
      </Card>

      <Card title="六层流水线步骤" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }} extra={
        <Button type="link" onClick={() => navigate('/data-clean/pipeline')}>查看完整流水线</Button>
      }>
        <Table columns={pipelineColumns} dataSource={pipelineLayers} rowKey="id" size="small" pagination={false} />
      </Card>

      <Card title="质量评分" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
        <Row gutter={16}>
          <Col span={6} className={styles.qualityScore}>
            <Progress type="circle" percent={task.qualityRate} size={100} strokeColor="#1677ff" />
            <div style={{ marginTop: 8 }}>整体质量</div>
          </Col>
          <Col span={6} className={styles.qualityScore}>
            <Progress type="circle" percent={task.dedupeScore ?? 0} size={80} strokeColor="#1677ff" />
            <div style={{ marginTop: 8, color: 'var(--color-text-secondary)' }}>去重质量</div>
          </Col>
          <Col span={6} className={styles.qualityScore}>
            <Progress type="circle" percent={task.formatScore ?? 0} size={80} strokeColor="#7C5CFC" />
            <div style={{ marginTop: 8, color: 'var(--color-text-secondary)' }}>格式统一</div>
          </Col>
          <Col span={6} className={styles.qualityScore}>
            <Progress type="circle" percent={task.structureScore ?? 0} size={80} strokeColor="#22c55e" />
            <div style={{ marginTop: 8, color: 'var(--color-text-secondary)' }}>结构化</div>
          </Col>
        </Row>
      </Card>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}><Card bordered={false}><div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 600 }}>{task.originalCount}</div><div style={{ color: 'var(--color-text-secondary)' }}>原始文档</div></div></Card></Col>
        <Col span={6}><Card bordered={false}><div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 600, color: '#22c55e' }}>{task.validCount}</div><div style={{ color: 'var(--color-text-secondary)' }}>有效数据</div></div></Card></Col>
        <Col span={6}><Card bordered={false}><div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 600, color: '#f59e0b' }}>{task.duplicateCount ?? 0}</div><div style={{ color: 'var(--color-text-secondary)' }}>重复剔除</div></div></Card></Col>
        <Col span={6}><Card bordered={false}><div style={{ textAlign: 'center' }}><div style={{ fontSize: 24, fontWeight: 600, color: '#ef4444' }}>{task.abnormalCount ?? 0}</div><div style={{ color: 'var(--color-text-secondary)' }}>异常标记</div></div></Card></Col>
      </Row>

      {batchDocs.length > 0 && (
        <Card title="批次文档" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Table columns={docColumns} dataSource={batchDocs} rowKey="id" size="small" pagination={false} />
        </Card>
      )}

      {lowConfidence.length > 0 && (
        <Card title="待复核低置信项" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }} extra={
          <Button type="link" onClick={() => navigate('/data-clean/quality')}>查看全部</Button>
        }>
          {lowConfidence.map((q) => (
            <div key={q.id} style={{ padding: '8px 0', borderBottom: '1px dashed var(--color-border)' }}>
              <strong>{q.document}</strong> — {q.field !== '—' ? q.field : q.category}：
              <span className={styles.lowConfidence}> {q.issue}（{q.confidence}%）</span>
            </div>
          ))}
        </Card>
      )}

      <Button type="primary" onClick={() => navigate('/data-clean/batches')}>查看批次列表</Button>
    </div>
  )
}

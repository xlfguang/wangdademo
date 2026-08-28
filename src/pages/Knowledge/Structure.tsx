import { useState, useMemo } from 'react'
import { Card, Upload, Select, Steps, Progress, Table, Button, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import StatusTag from '@/components/StatusTag'
import KnowledgeSubNav from './components/KnowledgeSubNav'
import { useKnowledgeContext } from './KnowledgeContext'
import { docProcessSteps, getAllKnowledgeDocs } from '@/mock/knowledge'
import { delay, generateId } from '@/utils/mockApi'
import type { KnowledgeDoc } from '@/types'

const { Dragger } = Upload

export default function Structure() {
  const { bases, addDoc, docs } = useKnowledgeContext()
  const [selectedKb, setSelectedKb] = useState(bases[0]?.id ?? '')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const processingDocs = useMemo(() => {
    const all = Object.values(docs).flat()
    return all.filter((d) => d.status === 'running' || d.processStep !== undefined && d.processStep < 5)
  }, [docs])

  const handleUpload = async () => {
    if (!selectedKb) {
      message.warning('请先选择目标知识库')
      return
    }
    setUploading(true)
    setProgress(0)
    setCurrentStep(0)
    for (let step = 0; step < docProcessSteps.length; step++) {
      setCurrentStep(step)
      for (let p = 0; p <= 100; p += 25) {
        setProgress(p)
        await delay(200)
      }
    }
    const newDoc: KnowledgeDoc = {
      id: generateId(),
      kbId: selectedKb,
      name: `新上传文档_${Date.now()}.pdf`,
      fileType: 'PDF',
      size: '4.2 MB',
      sliceCount: 18,
      status: 'completed',
      processStep: 5,
      updatedAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
    }
    addDoc(selectedKb, newDoc)
    setUploading(false)
    message.success('文档处理完成，已入库')
  }

  const columns = [
    { title: '文档名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '类型', dataIndex: 'fileType', key: 'fileType' },
    {
      title: '当前步骤',
      key: 'step',
      render: (_: unknown, r: KnowledgeDoc) => docProcessSteps[r.processStep ?? 0] ?? '—',
    },
    {
      title: '进度',
      key: 'progress',
      render: (_: unknown, r: KnowledgeDoc) => {
        const pct = r.status === 'completed' ? 100 : ((r.processStep ?? 0) + 1) / docProcessSteps.length * 100
        return <Progress percent={Math.round(pct)} size="small" style={{ minWidth: 120 }} />
      },
    },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <StatusTag status={s} /> },
  ]

  return (
    <div>
      <KnowledgeSubNav />
      <PageHeader title="文档结构化" description="上传文档并模拟切片、Embedding 与向量入库流程" />
      <Card title="文档上传" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
        <Select
          style={{ width: 280, marginBottom: 16 }}
          placeholder="选择目标知识库"
          value={selectedKb || undefined}
          onChange={setSelectedKb}
          options={bases.map((b) => ({ label: b.name, value: b.id }))}
        />
        <Dragger
          multiple={false}
          showUploadList={false}
          beforeUpload={() => false}
          disabled={uploading}
        >
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p className="ant-upload-hint">支持 PDF、Word、Excel、Markdown、PPT 等格式</p>
        </Dragger>
        <Button type="primary" style={{ marginTop: 16 }} loading={uploading} onClick={handleUpload}>
          开始处理
        </Button>
      </Card>
      {uploading && (
        <Card title="处理进度" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Steps size="small" current={currentStep} items={docProcessSteps.map((t) => ({ title: t }))} style={{ marginBottom: 16 }} />
          <Progress percent={progress} status="active" />
        </Card>
      )}
      <Card title="处理中的文档" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
        <Table
          columns={columns}
          dataSource={processingDocs.length > 0 ? processingDocs : getAllKnowledgeDocs().filter((d) => d.status === 'running')}
          rowKey="id"
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  )
}

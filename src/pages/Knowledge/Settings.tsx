import { useState } from 'react'
import { Card, Form, InputNumber, Select, Switch, Button, message } from 'antd'
import KnowledgeSubNav from './components/KnowledgeSubNav'
import { knowledgeSettingsDefault } from '@/mock/knowledge'

export default function Settings() {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    setSaving(false)
    message.success('设置保存成功')
  }

  return (
    <div>
      <KnowledgeSubNav />
      <Form form={form} layout="vertical" initialValues={knowledgeSettingsDefault}>
        <Card title="向量化配置" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Form.Item name="embeddingModel" label="Embedding 模型">
            <Select options={[
              { label: 'text-embedding-v3', value: 'text-embedding-v3' },
              { label: 'text-embedding-v2', value: 'text-embedding-v2' },
              { label: 'bge-large-zh', value: 'bge-large-zh' },
            ]} />
          </Form.Item>
          <Form.Item name="chunkSize" label="切片大小（Token）"><InputNumber min={128} max={2048} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="chunkOverlap" label="切片重叠（Token）"><InputNumber min={0} max={256} style={{ width: '100%' }} /></Form.Item>
        </Card>
        <Card title="检索配置" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Form.Item name="topK" label="Top-K 召回数"><InputNumber min={1} max={20} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="scoreThreshold" label="相关度阈值"><InputNumber min={0} max={1} step={0.05} style={{ width: '100%' }} /></Form.Item>
        </Card>
        <Card title="流程与协同" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Form.Item name="autoSync" label="自动同步" valuePropName="checked"><Switch /></Form.Item>
          <Form.Item name="auditRequired" label="入库前需审核" valuePropName="checked"><Switch /></Form.Item>
          <Form.Item name="agentEnabled" label="智能体 RAG 接入" valuePropName="checked"><Switch /></Form.Item>
        </Card>
        <Button type="primary" loading={saving} onClick={handleSave}>保存设置</Button>
      </Form>
    </div>
  )
}

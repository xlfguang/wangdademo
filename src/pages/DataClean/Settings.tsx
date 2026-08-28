import { useState } from 'react'
import { Card, Form, InputNumber, Select, Switch, Button, Table, message } from 'antd'
import DataCleanSubNav from './components/DataCleanSubNav'
import { dataCleanSettingsDefault, negotiationRecords } from '@/mock/dataClean'

export default function Settings() {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    setSaving(false)
    message.success('设置保存成功')
  }

  const negotiationColumns = [
    { title: '批次号', dataIndex: 'batchNo', key: 'batchNo' },
    { title: '协商原因', dataIndex: 'reason', key: 'reason', ellipsis: true },
    { title: '状态', dataIndex: 'status', key: 'status' },
    { title: '协商结果', dataIndex: 'result', key: 'result', ellipsis: true },
    { title: '时间', dataIndex: 'time', key: 'time' },
  ]

  return (
    <div>
      <DataCleanSubNav />
      <Form form={form} layout="vertical" initialValues={dataCleanSettingsDefault}>
        <Card title="配额配置" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Form.Item name="officeMaxFiles" label="办公文档单批次最大份数"><InputNumber min={1} max={100} style={{ width: '100%' }} addonAfter="份" /></Form.Item>
          <Form.Item name="officeMaxPagesPerFile" label="办公文档单份最大页数"><InputNumber min={1} max={200} style={{ width: '100%' }} addonAfter="页" /></Form.Item>
          <Form.Item name="multimodalMaxPages" label="多模态单批次最大等效页数"><InputNumber min={1} max={50} style={{ width: '100%' }} addonAfter="页" /></Form.Item>
          <Form.Item name="minutesPerPage" label="音视频等效页折算（分钟/页）"><InputNumber min={0.5} max={5} step={0.5} style={{ width: '100%' }} addonAfter="分钟" /></Form.Item>
        </Card>
        <Card title="清洗规则" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Form.Item name="dedupeThreshold" label="语义去重相似度阈值"><InputNumber min={0.8} max={0.99} step={0.01} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="formatRules" label="格式统一规则集"><Select options={[{ label: '标准规范', value: 'standard' }, { label: '金融行业', value: 'finance' }, { label: '政务行业', value: 'gov' }]} /></Form.Item>
          <Form.Item name="structureConfidenceThreshold" label="结构化置信度阈值（%）"><InputNumber min={50} max={99} style={{ width: '100%' }} /></Form.Item>
        </Card>
        <Card title="协商机制" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Form.Item name="enableNegotiation" label="启用超配额人工协商" valuePropName="checked"><Switch /></Form.Item>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, marginBottom: 12 }}>
            超配额或特殊格式需求时，系统拦截提交并引导发起协商，协商结果须书面确认后方可处理。
          </p>
          <Table columns={negotiationColumns} dataSource={negotiationRecords} rowKey="id" size="small" pagination={false} />
          <Button style={{ marginTop: 12 }} onClick={() => message.info('协商申请已创建')}>新建协商申请</Button>
        </Card>
        <Card title="SLA 与重试" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Form.Item name="regularSlaHours" label="常规批次 SLA"><InputNumber min={1} max={72} style={{ width: '100%' }} addonAfter="小时" /></Form.Item>
          <Form.Item name="urgentSlaHours" label="加急批次 SLA"><InputNumber min={1} max={24} style={{ width: '100%' }} addonAfter="小时" /></Form.Item>
          <Form.Item name="autoRetry" label="失败自动重试" valuePropName="checked"><Switch /></Form.Item>
          <Form.Item name="maxRetry" label="最大重试次数"><InputNumber min={0} max={5} style={{ width: '100%' }} /></Form.Item>
        </Card>
        <Button type="primary" loading={saving} onClick={handleSave}>保存设置</Button>
      </Form>
    </div>
  )
}

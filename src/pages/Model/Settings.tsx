import { useState } from 'react'
import { Card, Form, Select, Switch, InputNumber, Button, Tag, Table, message } from 'antd'
import ModelSubNav from './components/ModelSubNav'
import { useModelContext } from './ModelContext'
import {
  modelSettingsDefault,
  allocatablePlugins,
  modelOperationLogs,
} from '@/mock/model'
import { delay } from '@/utils/mockApi'

export default function Settings() {
  const { models } = useModelContext()
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  const llmOptions = models.filter((m) => m.type === 'llm' && m.status === 'enabled').map((m) => ({ label: m.name, value: m.name }))
  const embeddingOptions = models.filter((m) => m.type === 'embedding' && m.status === 'enabled').map((m) => ({ label: m.name, value: m.name }))

  const handleSave = async () => {
    setSaving(true)
    await delay(500)
    setSaving(false)
    message.success('设置保存成功')
  }

  const logColumns = [
    { title: '时间', dataIndex: 'time', key: 'time', width: 160 },
    { title: '操作人', dataIndex: 'operator', key: 'operator', width: 80 },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text: string) => <span style={{ color: '#1677ff' }}>{text}</span>,
    },
    { title: '对象', dataIndex: 'target', key: 'target' },
    { title: '详情', dataIndex: 'detail', key: 'detail', ellipsis: true },
  ]

  return (
    <div>
      <ModelSubNav />
      <Form form={form} layout="vertical" initialValues={modelSettingsDefault}>
        <Card title="基础设置" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Form.Item name="defaultLlm" label="默认大语言模型">
            <Select options={llmOptions} />
          </Form.Item>
          <Form.Item name="defaultEmbedding" label="默认向量嵌入模型">
            <Select options={embeddingOptions} />
          </Form.Item>
          <Form.Item name="timeout" label="调用超时 (秒)">
            <InputNumber min={5} max={120} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="maxRetries" label="最大重试次数">
            <InputNumber min={0} max={10} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="qpsLimit" label="单 AppKey 限流 (QPS)">
            <InputNumber min={1} max={1000} style={{ width: '100%' }} />
          </Form.Item>

          <div style={{ fontWeight: 600, marginBottom: 16, marginTop: 8 }}>开关设置</div>
          <Form.Item name="monitoringEnabled" label="调用监控开关" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="logEnabled" label="调用日志开关" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="auditEnabled" label="操作审计开关" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Button type="primary" loading={saving} onClick={handleSave}>保存设置</Button>
        </Card>

        <Card
          title="可分配插件"
          bordered={false}
          style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}
          extra={<Tag color="success">{allocatablePlugins.length} 个插件已接入</Tag>}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {allocatablePlugins.map((p) => (
              <Tag key={p} color="processing">{p}</Tag>
            ))}
          </div>
        </Card>

        <Card title="操作日志" bordered={false} style={{ boxShadow: 'var(--shadow-card)' }}>
          <Table
            columns={logColumns}
            dataSource={modelOperationLogs}
            rowKey="id"
            pagination={false}
            size="middle"
          />
        </Card>
      </Form>
    </div>
  )
}

import { useState } from 'react'
import { Card, Form, Input, InputNumber, Switch, Button, message } from 'antd'
import StatusTag from '@/components/StatusTag'
import VideoSubNav from './components/VideoSubNav'
import { videoPluginConfig } from '@/mock/video'

export default function Config() {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    setSaving(false)
    message.success('配置保存成功')
  }

  return (
    <div>
      <VideoSubNav />
      <Form form={form} layout="vertical" initialValues={videoPluginConfig}>
        <Card title="基础信息" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Form.Item name="name" label="插件名称">
            <Input />
          </Form.Item>
          <Form.Item name="version" label="版本">
            <Input disabled />
          </Form.Item>
          <Form.Item label="服务状态">
            <StatusTag status={videoPluginConfig.status} />
          </Form.Item>
        </Card>

        <Card title="鉴权" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Form.Item name="appKey" label="AppKey">
            <Input />
          </Form.Item>
          <Form.Item name="appSecret" label="AppSecret">
            <Input.Password />
          </Form.Item>
          <Form.Item name="signMethod" label="签名方式">
            <Input />
          </Form.Item>
        </Card>

        <Card title="访问控制" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Form.Item name="ipWhitelist" label="IP 白名单">
            <Input.TextArea rows={2} placeholder="192.168.1.0/24, 10.0.0.0/8" />
          </Form.Item>
          <Form.Item name="rateLimit" label="请求频率 (次/分钟)">
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="maxConcurrency" label="最大并发">
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Card>

        <Card title="Callback" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Form.Item name="callbackUrl" label="Callback URL">
            <Input placeholder="https://agent.example.com/callback/video" />
          </Form.Item>
          <Form.Item name="successCallback" label="成功回调" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="failCallback" label="失败回调" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Card>

        <Button type="primary" loading={saving} onClick={handleSave}>保存配置</Button>
      </Form>
    </div>
  )
}

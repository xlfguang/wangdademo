import { useState } from 'react'
import { Card, Form, InputNumber, TimePicker, Switch, Input, Button, message } from 'antd'
import dayjs from 'dayjs'
import CommunitySubNav from './components/CommunitySubNav'
import { communitySettingsDefault } from '@/mock/community'

export default function Settings() {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)

  const initialValues = {
    ...communitySettingsDefault,
    quietStart: dayjs(communitySettingsDefault.quietStart, 'HH:mm'),
    quietEnd: dayjs(communitySettingsDefault.quietEnd, 'HH:mm'),
  }

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    setSaving(false)
    message.success('设置保存成功')
  }

  return (
    <div>
      <CommunitySubNav />
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Card title="频率限制" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Form.Item name="userDailyLimit" label="单用户日推送上限">
            <InputNumber min={1} max={50} style={{ width: '100%' }} addonAfter="条/天" />
          </Form.Item>
          <Form.Item name="channelDailyLimit" label="单渠道日推送上限">
            <InputNumber min={100} max={100000} style={{ width: '100%' }} addonAfter="条/天" />
          </Form.Item>
          <Form.Item name="channelHourlyLimit" label="单渠道小时推送上限">
            <InputNumber min={10} max={5000} style={{ width: '100%' }} addonAfter="条/小时" />
          </Form.Item>
        </Card>
        <Card title="静默时段" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Form.Item name="quietHoursEnabled" label="启用静默时段" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="quietStart" label="静默开始时间">
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="quietEnd" label="静默结束时间">
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, margin: 0 }}>
            静默时段内不发送营销类推送，紧急通知除外。
          </p>
        </Card>
        <Card title="退订规则" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Form.Item name="unsubscribeKeywords" label="退订关键词（逗号分隔）">
            <Input placeholder="退订,取消订阅,STOP" />
          </Form.Item>
          <Form.Item name="globalUnsubscribe" label="全局退订开关" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="unsubscribeConfirm" label="退订需二次确认" valuePropName="checked">
            <Switch />
          </Form.Item>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 13, margin: 0 }}>
            用户发送退订关键词后，系统将自动停止向该用户发送营销消息。
          </p>
        </Card>
        <Button type="primary" loading={saving} onClick={handleSave}>保存设置</Button>
      </Form>
    </div>
  )
}

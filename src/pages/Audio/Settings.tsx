import { useState } from 'react'
import { Card, Form, Select, Switch, InputNumber, Button, Checkbox, message } from 'antd'
import AudioSubNav from './components/AudioSubNav'
import { audioSettingsDefault } from '@/mock/audio'

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
      <AudioSubNav />
      <Form form={form} layout="vertical" initialValues={audioSettingsDefault}>
        <Card title="基础设置" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Form.Item name="exportFormat" label="默认导出格式"><Select options={[{ label: 'TXT', value: 'txt' }, { label: 'Word', value: 'docx' }]} /></Form.Item>
          <Form.Item name="saveFormat" label="裁剪后默认保存格式"><Select options={[{ label: 'MP3', value: 'mp3' }, { label: 'WAV', value: 'wav' }]} /></Form.Item>
        </Card>
        <Card title="识别设置" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Form.Item name="language" label="识别语言"><Select options={[{ label: '中文（普通话）', value: 'zh-CN' }, { label: '英文', value: 'en-US' }]} /></Form.Item>
          <Form.Item name="multiSpeaker" label="多说话人区分" valuePropName="checked"><Switch /></Form.Item>
        </Card>
        <Card title="提取设置" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Form.Item name="extractCategories" label="默认提取类别">
            <Checkbox.Group options={[
              { label: '关键词', value: 'keywords' },
              { label: '核心要点', value: 'points' },
              { label: '实体信息', value: 'entities' },
              { label: '任务信息', value: 'tasks' },
            ]} />
          </Form.Item>
        </Card>
        <Card title="缓存设置" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Form.Item name="cacheLimit" label="缓存大小限制 (MB)"><InputNumber min={100} max={2000} style={{ width: '100%' }} /></Form.Item>
          <Button onClick={() => message.success('缓存已清理')}>手动清理缓存</Button>
        </Card>
        <Button type="primary" loading={saving} onClick={handleSave}>保存设置</Button>
      </Form>
    </div>
  )
}

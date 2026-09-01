import { useState } from 'react'
import { Card, Form, InputNumber, Select, Switch, Button, Checkbox, message } from 'antd'
import CrawlerSubNav from './components/CrawlerSubNav'
import { useMenuData } from '@/mock/useMenuData'
import type { CrawlerData } from '@/mock/crawler'

export default function Settings() {
  const [form] = Form.useForm()
  const [saving, setSaving] = useState(false)
  const { data } = useMenuData<CrawlerData>('crawler')
  const crawlerSettingsDefault = data.crawlerSettingsDefault

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 500))
    setSaving(false)
    message.success('设置保存成功')
  }

  return (
    <div>
      <CrawlerSubNav />
      <Form form={form} layout="vertical" initialValues={crawlerSettingsDefault}>
        <Card title="抓取规则" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Form.Item name="threads" label="抓取线程数"><InputNumber min={1} max={50} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="interval" label="抓取间隔（毫秒）"><InputNumber min={100} max={5000} step={100} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="maxCollect" label="单任务最大抓取量"><InputNumber min={10} max={10000} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="dedupeLevel" label="去重精度"><Select options={[{ label: '高精度', value: 'high' }, { label: '中精度', value: 'medium' }, { label: '低精度', value: 'low' }]} /></Form.Item>
          <Form.Item name="sourceFilter" label="信源筛选"><Select options={[{ label: '优先保留权威信源', value: 'priority' }, { label: '仅保留权威信源', value: 'only' }, { label: '不筛选', value: 'none' }]} /></Form.Item>
        </Card>
        <Card title="舆情预警" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Form.Item name="alertUrgentThreshold" label="紧急热点阈值（条/小时）"><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="alertImportantThreshold" label="重要热点阈值（条/小时）"><InputNumber min={1} style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="alertChannel" label="预警渠道"><Select options={[{ label: '企业微信', value: 'wecom' }, { label: '邮件', value: 'email' }, { label: '钉钉', value: 'dingtalk' }]} /></Form.Item>
        </Card>
        <Card title="存储备份" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Form.Item name="storagePath" label="本地存储路径"><Select options={[{ label: '/data/crawler', value: '/data/crawler' }, { label: '/Users/data/crawler', value: '/Users/data/crawler' }]} /></Form.Item>
          <Form.Item name="cloudSync" label="云端自动同步" valuePropName="checked"><Switch /></Form.Item>
          <Form.Item name="backupFreq" label="自动备份频率"><Select options={[{ label: '每天', value: 'daily' }, { label: '每周', value: 'weekly' }, { label: '每月', value: 'monthly' }]} /></Form.Item>
          <Button onClick={() => message.success('备份已发起')}>立即备份</Button>
        </Card>
        <Card title="智能体协同" bordered={false} style={{ marginBottom: 16, boxShadow: 'var(--shadow-card)' }}>
          <Form.Item name="agentSync" label="任务状态实时同步" valuePropName="checked"><Switch /></Form.Item>
          <Form.Item name="agentFeatures" label="启用的反馈能力">
            <Checkbox.Group options={[
              { label: 'JSON 标准化输出', value: 'json' },
              { label: '数据摘要生成', value: 'summary' },
              { label: '实时进度反馈', value: 'progress' },
            ]} defaultValue={['json', 'summary', 'progress']} />
          </Form.Item>
        </Card>
        <Button type="primary" loading={saving} onClick={handleSave}>保存设置</Button>
      </Form>
    </div>
  )
}

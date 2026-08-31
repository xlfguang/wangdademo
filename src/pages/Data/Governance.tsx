import { useState, useCallback } from 'react'
import { Card, Table, Button, Steps, Progress, Drawer, Form, Select, Checkbox, Radio, Input, message, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import ExportReportButton from '@/components/ExportReportButton'
import StatusTag from '@/components/StatusTag'
import DataSubNav from './components/DataSubNav'
import { useDataContext } from './DataContext'
import { useDeepLinkAction } from '@/utils/deepLink'
import { delay, generateId } from '@/utils/mockApi'
import type { GovernanceTask } from '@/types'

export default function Governance() {
  const navigate = useNavigate()
  const { sources, governanceTasks, addGovernanceTask } = useDataContext()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  useDeepLinkAction('create', useCallback(() => setDrawerOpen(true), []))

  const handleStart = async () => {
    const values = await form.validateFields()
    setLoading(true)
    await delay(500)
    const task: GovernanceTask = {
      id: generateId(),
      name: values.name ?? `${values.dataSource} 治理任务`,
      dataSource: values.dataSource,
      dataVolume: '128,420 条',
      cleanRules: (values.rules ?? []).join('+') || '缺失值+去重',
      abnormalCount: 0,
      qualityScore: 0,
      status: 'running',
      progress: 0,
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
    }
    addGovernanceTask(task)
    setLoading(false)
    setDrawerOpen(false)
    form.resetFields()
    message.success('治理任务已创建，正在处理中')
  }

  const columns = [
    { title: '任务名称', dataIndex: 'name', key: 'name' },
    { title: '数据源', dataIndex: 'dataSource', key: 'dataSource' },
    { title: '数据量', dataIndex: 'dataVolume', key: 'dataVolume' },
    { title: '清洗规则', dataIndex: 'cleanRules', key: 'cleanRules', ellipsis: true },
    { title: '异常数据', dataIndex: 'abnormalCount', key: 'abnormalCount', render: (v: number) => v.toLocaleString() },
    { title: '质量评分', dataIndex: 'qualityScore', key: 'qualityScore', render: (v: number) => v ? `${v}` : '-' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <StatusTag status={s} /> },
    { title: '进度', dataIndex: 'progress', key: 'progress', render: (p: number) => <Progress percent={p} size="small" style={{ width: 80 }} /> },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: GovernanceTask) =>
        record.status === 'completed' ? (
          <Button type="link" size="small" onClick={() => navigate('/data/governance/result')}>查看结果</Button>
        ) : null,
    },
  ]

  return (
    <div>
      <DataSubNav />
      <PageHeader
        title="数据治理"
        description="数据接入 → 清洗 → 标准化 → 异常检测 → 质量校验 → 输出"
        extra={
          <Space>
            <ExportReportButton filename="data-governance" data={governanceTasks as unknown as Record<string, unknown>[]} />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerOpen(true)}>创建治理任务</Button>
          </Space>
        }
      />
      <Card bordered={false} style={{ marginBottom: 24, boxShadow: 'var(--shadow-card)' }}>
        <Steps current={2} size="small" items={['数据接入', '数据清洗', '数据标准化', '异常检测', '质量校验', '输出'].map((t) => ({ title: t }))} />
      </Card>
      <Table columns={columns} dataSource={governanceTasks} rowKey="id" pagination={{ pageSize: 10 }} />
      <Drawer title="创建治理任务" open={drawerOpen} onClose={() => setDrawerOpen(false)} width={480} footer={
        <Space><Button onClick={() => setDrawerOpen(false)}>取消</Button><Button type="primary" loading={loading} onClick={handleStart}>开始治理</Button></Space>
      }>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="任务名称"><Input placeholder="可选" /></Form.Item>
          <Form.Item name="dataSource" label="数据源" rules={[{ required: true }]}>
            <Select options={sources.map((s) => ({ label: s.name, value: s.name }))} />
          </Form.Item>
          <Form.Item name="rules" label="清洗规则" initialValue={['missing', 'duplicate', 'abnormal', 'format', 'type']}>
            <Checkbox.Group options={[
              { label: '缺失值处理', value: 'missing' },
              { label: '重复数据处理', value: 'duplicate' },
              { label: '异常值检测', value: 'abnormal' },
              { label: '数据格式标准化', value: 'format' },
              { label: '字段类型转换', value: 'type' },
            ]} />
          </Form.Item>
          <Form.Item name="algorithm" label="检测算法" initialValue="iqr">
            <Radio.Group options={[{ label: 'IQR', value: 'iqr' }, { label: 'Z-Score', value: 'zscore' }]} />
          </Form.Item>
          <Form.Item name="missingHandle" label="缺失值处理" initialValue="mean">
            <Select options={[{ label: '删除', value: 'delete' }, { label: '均值填充', value: 'mean' }, { label: '中位数填充', value: 'median' }, { label: '默认值', value: 'default' }]} />
          </Form.Item>
          <Form.Item name="abnormalHandle" label="异常值处理" initialValue="mark">
            <Select options={[{ label: '删除', value: 'delete' }, { label: '修正', value: 'fix' }, { label: '标记', value: 'mark' }]} />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  )
}

import { useState, useMemo } from 'react'
import { Table, Button, Modal, Form, Input, Select, InputNumber, Checkbox, message, Popconfirm, Space, Typography } from 'antd'
import { PlusOutlined, KeyOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import SearchForm from '@/components/SearchForm'
import { projectPluginOptions } from '@/mock/project'
import { useProjectContext } from './ProjectContext'
import { delay, generateId, filterBySearch, filterByStatus, paginate } from '@/utils/mockApi'
import type { Project, SearchParams } from '@/types'

const statusOptions = [
  { label: '规划中', value: 'planning' },
  { label: '实施中', value: 'implementing' },
  { label: '运营中', value: 'operating' },
  { label: '已完成', value: 'completed' },
  { label: '已暂停', value: 'paused' },
]

function createAppKey() {
  return `wd-app-${generateId().replace(/-/g, '').slice(-16)}`
}

export default function ProjectPage() {
  const navigate = useNavigate()
  const { projects, addProject, removeProject } = useProjectContext()
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState<SearchParams>({})
  const [page, setPage] = useState(1)
  const [form] = Form.useForm()
  const selectedPlugins: string[] = Form.useWatch('plugins', form) ?? []

  const filtered = useMemo(() => {
    let result = filterBySearch(projects, search.keyword, ['name', 'industry', 'manager', 'appKey'])
    result = filterByStatus(result, search.status)
    return result
  }, [projects, search])

  const paged = paginate(filtered, page, 10)

  const handleGenerateAppKey = async () => {
    const plugins: string[] = form.getFieldValue('plugins') ?? []
    if (plugins.length === 0) {
      message.warning('请先勾选至少一个插件')
      return
    }
    const quotas = form.getFieldValue('callQuotas') ?? {}
    const missing = plugins.filter((name) => !quotas[name] || quotas[name] <= 0)
    if (missing.length > 0) {
      message.warning(`请填写 ${missing.join('、')} 的调用次数`)
      return
    }
    form.setFieldValue('appKey', createAppKey())
    message.success('AppKey 已生成')
  }

  const handleCreate = async () => {
    const values = await form.validateFields()
    if (!values.appKey) {
      message.warning('请先生成 AppKey')
      return
    }
    setLoading(true)
    await delay(500)
    const pluginConfigs = (values.plugins as string[]).map((name) => ({
      name,
      callQuota: values.callQuotas[name] as number,
    }))
    addProject({
      id: generateId(),
      name: values.name,
      industry: values.industry,
      manager: values.manager,
      status: 'planning',
      progress: 0,
      startDate: values.startDate,
      endDate: values.endDate,
      description: values.description ?? '',
      appKey: values.appKey,
      pluginConfigs,
    })
    setLoading(false)
    setModalOpen(false)
    form.resetFields()
    message.success('项目创建成功')
  }

  const columns = [
    { title: '项目名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '所属行业', dataIndex: 'industry', key: 'industry' },
    { title: '项目负责人', dataIndex: 'manager', key: 'manager' },
    { title: '开始时间', dataIndex: 'startDate', key: 'startDate' },
    {
      title: 'AppKey',
      dataIndex: 'appKey',
      key: 'appKey',
      width: 200,
      ellipsis: true,
      render: (key: string | undefined) =>
        key ? <Typography.Text copyable={{ text: key }}>{key}</Typography.Text> : '-',
    },
    { title: '结束时间', dataIndex: 'endDate', key: 'endDate' },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Project) => (
        <>
          <Button type="link" size="small" onClick={() => navigate(record.id)}>查看</Button>
          <Popconfirm title="确定删除该项目吗？" onConfirm={async () => { await delay(300); removeProject(record.id); message.success('删除成功') }}>
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="项目管理"
        description="行业解决方案交付与持续运营管理中心"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>新建项目</Button>}
      />
      <SearchForm onSearch={(p) => { setSearch(p); setPage(1) }} statusOptions={statusOptions} />
      <Table columns={columns} dataSource={paged} rowKey="id" pagination={{ current: page, pageSize: 10, total: filtered.length, onChange: setPage }} />
      <Modal
        title="新建项目"
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields() }}
        onOk={handleCreate}
        confirmLoading={loading}
        width={640}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="项目名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="industry" label="所属行业" rules={[{ required: true }]}>
            <Select options={['制造业', '政务', '金融', '零售', '新能源', '教育'].map((v) => ({ label: v, value: v }))} />
          </Form.Item>
          <Form.Item name="manager" label="项目负责人" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="startDate" label="开始时间" rules={[{ required: true }]}><Input placeholder="2026-01-01" /></Form.Item>
          <Form.Item name="endDate" label="结束时间" rules={[{ required: true }]}><Input placeholder="2026-12-31" /></Form.Item>
          <Form.Item name="description" label="项目描述"><Input.TextArea rows={3} /></Form.Item>
          <Form.Item name="plugins" label="勾选插件" rules={[{ required: true, message: '请至少选择一个插件' }]}>
            <Checkbox.Group
              options={projectPluginOptions.map((p) => ({ label: p, value: p }))}
              style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}
            />
          </Form.Item>
          {selectedPlugins.length > 0 && (
            <Form.Item label="调用次数配额">
              {selectedPlugins.map((name) => (
                <Form.Item
                  key={name}
                  name={['callQuotas', name]}
                  label={name}
                  rules={[{ required: true, message: '请填写调用次数' }]}
                  style={{ marginBottom: 12 }}
                >
                  <InputNumber min={1} step={1000} addonAfter="次" style={{ width: '100%' }} placeholder="如 10000" />
                </Form.Item>
              ))}
            </Form.Item>
          )}
          <Form.Item label="AppKey">
            <Space.Compact style={{ width: '100%' }}>
              <Form.Item name="appKey" noStyle rules={[{ required: true, message: '请生成 AppKey' }]}>
                <Input readOnly placeholder="勾选插件并填写调用次数后生成" />
              </Form.Item>
              <Button icon={<KeyOutlined />} onClick={handleGenerateAppKey}>生成 AppKey</Button>
            </Space.Compact>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

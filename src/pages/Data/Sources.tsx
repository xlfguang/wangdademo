import { useState, useMemo, useCallback } from 'react'
import { Table, Button, Form, Input, Select, Space, Drawer, message, Popconfirm } from 'antd'
import { PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import StatusTag from '@/components/StatusTag'
import DataSubNav from './components/DataSubNav'
import { useDataContext } from './DataContext'
import { useDeepLinkAction } from '@/utils/deepLink'
import { delay, generateId, filterBySearch, paginate } from '@/utils/mockApi'
import type { DataSourceItem } from '@/types'

const typeOptions = ['MySQL', 'PostgreSQL', 'Oracle', 'Excel', 'CSV', 'JSON', 'API', 'MQTT', 'OSS'].map((v) => ({ label: v, value: v }))
const statusOptions = [{ label: '正常', value: 'normal' }, { label: '异常', value: 'abnormal' }, { label: '已停用', value: 'disabled' }]
const categoryOptions = [
  { label: '数据库', value: 'db' },
  { label: '文件', value: 'file' },
  { label: 'API', value: 'api' },
  { label: '消息队列', value: 'mq' },
  { label: '对象存储', value: 'oss' },
]

export default function Sources() {
  const { sources, addSource, removeSource } = useDataContext()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [category, setCategory] = useState('db')
  const [keyword, setKeyword] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>()
  const [statusFilter, setStatusFilter] = useState<string>()
  const [page, setPage] = useState(1)
  const [testing, setTesting] = useState(false)
  const [form] = Form.useForm()

  const filtered = useMemo(() => {
    let r = filterBySearch(sources, keyword, ['name', 'type', 'address'])
    if (typeFilter) r = r.filter((s) => s.type === typeFilter)
    if (statusFilter) r = r.filter((s) => s.status === statusFilter)
    return r
  }, [sources, keyword, typeFilter, statusFilter])

  const paged = paginate(filtered, page, 10)

  useDeepLinkAction('create', useCallback(() => setDrawerOpen(true), []))

  const handleTest = async () => {
    setTesting(true)
    await delay(800)
    setTesting(false)
    message.success('连接成功，数据源可正常使用')
  }

  const handleSave = async () => {
    const values = await form.validateFields()
    await delay(500)
    addSource({
      id: generateId(),
      name: values.name,
      type: values.dbType ?? values.type ?? 'MySQL',
      address: values.host ? `${values.host}:${values.port}/${values.database ?? ''}` : values.address ?? '-',
      dataVolume: '0 条',
      accessMethod: category === 'db' ? 'JDBC' : category === 'api' ? 'REST API' : '文件上传',
      status: 'normal',
      lastSync: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
    })
    form.resetFields()
    setDrawerOpen(false)
    message.success('数据源保存成功')
  }

  const renderForm = () => {
    if (category === 'db') return (
      <>
        <Form.Item name="name" label="数据源名称" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="dbType" label="数据库类型" initialValue="MySQL"><Select options={typeOptions.slice(0, 3)} /></Form.Item>
        <Form.Item name="host" label="Host" rules={[{ required: true }]}><Input placeholder="192.168.1.101" /></Form.Item>
        <Form.Item name="port" label="Port" initialValue={3306}><Input /></Form.Item>
        <Form.Item name="username" label="用户名"><Input /></Form.Item>
        <Form.Item name="password" label="密码"><Input.Password /></Form.Item>
        <Form.Item name="database" label="数据库"><Input /></Form.Item>
      </>
    )
    if (category === 'api') return (
      <>
        <Form.Item name="name" label="数据源名称" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="address" label="API 地址" rules={[{ required: true }]}><Input placeholder="https://api.example.com" /></Form.Item>
      </>
    )
    return (
      <>
        <Form.Item name="name" label="数据源名称" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="address" label="路径/地址" rules={[{ required: true }]}><Input /></Form.Item>
      </>
    )
  }

  const columns = [
    { title: '数据源名称', dataIndex: 'name', key: 'name' },
    { title: '类型', dataIndex: 'type', key: 'type' },
    { title: '地址', dataIndex: 'address', key: 'address', ellipsis: true },
    { title: '数据量', dataIndex: 'dataVolume', key: 'dataVolume' },
    { title: '接入方式', dataIndex: 'accessMethod', key: 'accessMethod' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <StatusTag status={s} /> },
    { title: '最近同步', dataIndex: 'lastSync', key: 'lastSync' },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: DataSourceItem) => (
        <Popconfirm title="确定删除该数据源吗？" onConfirm={async () => { await delay(300); removeSource(record.id); message.success('删除成功') }}>
          <Button type="link" size="small" danger>删除</Button>
        </Popconfirm>
      ),
    },
  ]

  return (
    <div>
      <DataSubNav />
      <PageHeader title="数据源管理" description="多源数据接入与管理" extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setDrawerOpen(true)}>新增数据源</Button>} />
      <Form layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item><Input placeholder="搜索数据源" prefix={<SearchOutlined />} allowClear style={{ width: 200 }} value={keyword} onChange={(e) => { setKeyword(e.target.value); setPage(1) }} /></Form.Item>
        <Form.Item><Select placeholder="类型筛选" allowClear style={{ width: 120 }} options={typeOptions} value={typeFilter} onChange={(v) => { setTypeFilter(v); setPage(1) }} /></Form.Item>
        <Form.Item><Select placeholder="状态筛选" allowClear style={{ width: 120 }} options={statusOptions} value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(1) }} /></Form.Item>
        <Form.Item><Button icon={<ReloadOutlined />} onClick={() => { setKeyword(''); setTypeFilter(undefined); setStatusFilter(undefined); setPage(1) }}>重置</Button></Form.Item>
      </Form>
      <Table columns={columns} dataSource={paged} rowKey="id" pagination={{ current: page, pageSize: 10, total: filtered.length, onChange: setPage }} />
      <Drawer title="新增数据源" open={drawerOpen} onClose={() => setDrawerOpen(false)} width={480} footer={
        <Space>
          <Button onClick={() => setDrawerOpen(false)}>取消</Button>
          <Button loading={testing} onClick={handleTest}>测试连接</Button>
          <Button type="primary" onClick={handleSave}>保存</Button>
        </Space>
      }>
        <Form.Item label="数据源类型" style={{ marginBottom: 16 }}>
          <Select value={category} options={categoryOptions} onChange={setCategory} />
        </Form.Item>
        <Form form={form} layout="vertical">{renderForm()}</Form>
      </Drawer>
    </div>
  )
}

import { useState, useMemo } from 'react'
import { Table, Button, Modal, Form, Input, Select, Progress, message, Popconfirm } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import SearchForm from '@/components/SearchForm'
import StatusTag from '@/components/StatusTag'
import { projects as initialProjects } from '@/mock/project'
import { delay, generateId, filterBySearch, filterByStatus, paginate } from '@/utils/mockApi'
import type { Project, SearchParams } from '@/types'

const statusOptions = [
  { label: '规划中', value: 'planning' },
  { label: '实施中', value: 'implementing' },
  { label: '运营中', value: 'operating' },
  { label: '已完成', value: 'completed' },
  { label: '已暂停', value: 'paused' },
]

export default function ProjectPage() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState<SearchParams>({})
  const [page, setPage] = useState(1)
  const [form] = Form.useForm()

  const filtered = useMemo(() => {
    let result = filterBySearch(projects, search.keyword, ['name', 'industry', 'manager'])
    result = filterByStatus(result, search.status)
    return result
  }, [projects, search])

  const paged = paginate(filtered, page, 10)

  const handleCreate = async () => {
    const values = await form.validateFields()
    setLoading(true)
    await delay(500)
    setProjects([{
      id: generateId(),
      name: values.name,
      industry: values.industry,
      manager: values.manager,
      status: 'planning',
      progress: 0,
      startDate: values.startDate,
      endDate: values.endDate,
      description: values.description ?? '',
    }, ...projects])
    setLoading(false)
    setModalOpen(false)
    form.resetFields()
    message.success('项目创建成功')
  }

  const columns = [
    { title: '项目名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '所属行业', dataIndex: 'industry', key: 'industry' },
    { title: '项目负责人', dataIndex: 'manager', key: 'manager' },
    { title: '项目状态', dataIndex: 'status', key: 'status', render: (s: string) => <StatusTag status={s} /> },
    { title: '进度', dataIndex: 'progress', key: 'progress', render: (p: number) => <Progress percent={p} size="small" style={{ width: 100 }} /> },
    { title: '开始时间', dataIndex: 'startDate', key: 'startDate' },
    { title: '结束时间', dataIndex: 'endDate', key: 'endDate' },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Project) => (
        <>
          <Button type="link" size="small" onClick={() => navigate(`/project/${record.id}`)}>查看</Button>
          <Popconfirm title="确定删除该项目吗？" onConfirm={async () => { await delay(300); setProjects(projects.filter((p) => p.id !== record.id)); message.success('删除成功') }}>
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
      <Modal title="新建项目" open={modalOpen} onCancel={() => setModalOpen(false)} onOk={handleCreate} confirmLoading={loading} width={560}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="项目名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="industry" label="所属行业" rules={[{ required: true }]}>
            <Select options={['制造业', '政务', '金融', '零售', '新能源', '教育'].map((v) => ({ label: v, value: v }))} />
          </Form.Item>
          <Form.Item name="manager" label="项目负责人" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="startDate" label="开始时间" rules={[{ required: true }]}><Input placeholder="2026-01-01" /></Form.Item>
          <Form.Item name="endDate" label="结束时间" rules={[{ required: true }]}><Input placeholder="2026-12-31" /></Form.Item>
          <Form.Item name="description" label="项目描述"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

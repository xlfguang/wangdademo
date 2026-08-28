import { useState, useMemo, useCallback } from 'react'
import { Table, Button, Modal, Form, Input, message, Popconfirm } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import SearchForm from '@/components/SearchForm'
import StatusTag from '@/components/StatusTag'
import KnowledgeSubNav from './components/KnowledgeSubNav'
import { useKnowledgeContext } from './KnowledgeContext'
import { useDeepLinkAction } from '@/utils/deepLink'
import { delay, generateId, filterBySearch, filterByStatus, paginate } from '@/utils/mockApi'
import type { KnowledgeBase, SearchParams } from '@/types'

const statusOptions = [
  { label: '运行中', value: 'running' },
  { label: '已完成', value: 'completed' },
]

export default function Bases() {
  const navigate = useNavigate()
  const { bases, addBase, removeBase } = useKnowledgeContext()
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState<SearchParams>({})
  const [page, setPage] = useState(1)
  const [form] = Form.useForm()

  const filtered = useMemo(() => {
    let result = filterBySearch(bases, search.keyword, ['name'])
    result = filterByStatus(result, search.status)
    return result
  }, [bases, search])

  const paged = paginate(filtered, page, 10)

  useDeepLinkAction('create', useCallback(() => setModalOpen(true), []))

  const handleCreate = async () => {
    const values = await form.validateFields()
    setLoading(true)
    await delay(500)
    addBase({
      id: generateId(),
      name: values.name,
      description: values.description,
      category: '自定义',
      docCount: 0,
      vectorCount: 0,
      fragmentCount: 0,
      storage: '0 MB',
      embeddingModel: 'text-embedding-v3',
      status: 'running',
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
      updatedAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
    })
    setLoading(false)
    setModalOpen(false)
    form.resetFields()
    message.success('知识库创建成功')
  }

  const columns = [
    { title: '知识库名称', dataIndex: 'name', key: 'name' },
    { title: '文档数量', dataIndex: 'docCount', key: 'docCount', render: (v: number) => v.toLocaleString() },
    { title: '向量数量', dataIndex: 'vectorCount', key: 'vectorCount', render: (v: number) => v.toLocaleString() },
    { title: '存储空间', dataIndex: 'storage', key: 'storage' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => <StatusTag status={s} /> },
    { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt' },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: KnowledgeBase) => (
        <>
          <Button type="link" size="small" onClick={() => navigate(`/knowledge/base/${record.id}`)}>查看</Button>
          <Popconfirm title="确定删除该知识库吗？" onConfirm={async () => { await delay(300); removeBase(record.id); message.success('删除成功') }}>
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </>
      ),
    },
  ]

  return (
    <div>
      <KnowledgeSubNav />
      <PageHeader
        title="知识库管理"
        description="创建与管理企业知识库，支持多库并行与分类组织"
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>创建知识库</Button>}
      />
      <SearchForm onSearch={(p) => { setSearch(p); setPage(1) }} statusOptions={statusOptions} />
      <Table
        columns={columns}
        dataSource={paged}
        rowKey="id"
        pagination={{ current: page, pageSize: 10, total: filtered.length, onChange: setPage }}
      />
      <Modal title="创建知识库" open={modalOpen} onCancel={() => setModalOpen(false)} onOk={handleCreate} confirmLoading={loading}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="知识库名称" rules={[{ required: true }]}><Input placeholder="请输入知识库名称" /></Form.Item>
          <Form.Item name="description" label="描述"><Input.TextArea placeholder="可选，简要描述知识库用途" rows={3} /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

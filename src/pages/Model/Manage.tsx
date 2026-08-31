import { useState } from 'react'
import { Table, Button, Modal, Form, Input, Select, Tag, message, Popconfirm, Space } from 'antd'
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'
import StatusTag from '@/components/StatusTag'
import ModelSubNav from './components/ModelSubNav'
import { useModelContext } from './ModelContext'
import {
  modelTypeLabels,
  modelTypeColors,
  allocatablePlugins,
} from '@/mock/model'
import type { AiModel, ModelType } from '@/mock/model'
import { delay, generateId } from '@/utils/mockApi'

const typeOptions = Object.entries(modelTypeLabels).map(([value, label]) => ({ value, label }))

export default function Manage() {
  const navigate = useNavigate()
  const { models, addModel, updateModel, removeModel, toggleModelStatus } = useModelContext()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const openCreate = () => {
    setEditingId(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEdit = (record: AiModel) => {
    setEditingId(record.id)
    form.setFieldsValue({
      name: record.name,
      type: record.type,
      url: record.url,
      apiKey: record.apiKey,
      plugins: record.plugins,
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    const values = await form.validateFields()
    setLoading(true)
    await delay(500)
    if (editingId) {
      updateModel(editingId, {
        name: values.name,
        type: values.type,
        url: values.url,
        apiKey: values.apiKey,
        plugins: values.plugins ?? [],
      })
      message.success('模型更新成功')
    } else {
      addModel({
        id: generateId(),
        name: values.name,
        type: values.type as ModelType,
        url: values.url,
        apiKey: values.apiKey,
        plugins: values.plugins ?? [],
        status: 'enabled',
        createdAt: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
        lastCallAt: '-',
        callCount: 0,
        avgLatency: '-',
      })
      message.success('模型添加成功')
    }
    setLoading(false)
    setModalOpen(false)
  }

  const columns = [
    { title: '模型名称', dataIndex: 'name', key: 'name', ellipsis: true },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (t: AiModel['type']) => <Tag color={modelTypeColors[t]}>{modelTypeLabels[t]}</Tag>,
    },
    { title: '地址', dataIndex: 'url', key: 'url', ellipsis: true, width: 240 },
    { title: 'API Key', dataIndex: 'apiKey', key: 'apiKey', width: 140 },
    {
      title: '已分配插件',
      dataIndex: 'plugins',
      key: 'plugins',
      render: (plugins: string[]) =>
        plugins.length > 0
          ? plugins.map((p) => <Tag key={p} color="blue" style={{ marginBottom: 4 }}>{p}</Tag>)
          : <span style={{ color: 'var(--color-text-secondary)' }}>未分配</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (s: string) => <StatusTag status={s} />,
    },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_: unknown, record: AiModel) => (
        <Space size={0}>
          <Button type="link" size="small" onClick={() => navigate('/model/test')}>测试</Button>
          <Button type="link" size="small" onClick={() => openEdit(record)}>编辑</Button>
          <Button
            type="link"
            size="small"
            style={{ color: record.status === 'enabled' ? '#fa8c16' : undefined }}
            onClick={async () => {
              await delay(300)
              toggleModelStatus(record.id)
              message.success(record.status === 'enabled' ? '模型已停用' : '模型已启用')
            }}
          >
            {record.status === 'enabled' ? '停用' : '启用'}
          </Button>
          <Popconfirm
            title="确定删除该模型吗？"
            onConfirm={async () => {
              await delay(300)
              removeModel(record.id)
              message.success('删除成功')
            }}
          >
            <Button type="link" size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <ModelSubNav />
      <PageHeader
        title="模型管理"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => message.success('已刷新')}>刷新</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新增模型</Button>
          </Space>
        }
      />
      <Table
        columns={columns}
        dataSource={models}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />
      <Modal
        title={editingId ? '编辑模型' : '新增模型'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        confirmLoading={loading}
        width={560}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="模型名称" rules={[{ required: true, message: '请输入模型名称' }]}>
            <Input placeholder="如 Qwen2.5-72B-Instruct" />
          </Form.Item>
          <Form.Item name="type" label="模型类型" rules={[{ required: true, message: '请选择模型类型' }]}>
            <Select options={typeOptions} placeholder="选择类型" />
          </Form.Item>
          <Form.Item name="url" label="服务地址" rules={[{ required: true, message: '请输入服务地址' }]}>
            <Input placeholder="http://192.168.x.x:9001/v1/chat/completions" />
          </Form.Item>
          <Form.Item name="apiKey" label="API Key" rules={[{ required: true, message: '请输入 API Key' }]}>
            <Input placeholder="sk-xxx" />
          </Form.Item>
          <Form.Item name="plugins" label="分配插件">
            <Select mode="multiple" options={allocatablePlugins.map((p) => ({ label: p, value: p }))} placeholder="选择插件（可选）" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

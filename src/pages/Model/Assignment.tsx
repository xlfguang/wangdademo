import { useState } from 'react'
import { Table, Button, Modal, Select, Tag, message } from 'antd'
import { ApiOutlined } from '@ant-design/icons'
import PageHeader from '@/components/PageHeader'
import ModelSubNav from './components/ModelSubNav'
import { useModelContext } from './ModelContext'
import {
  pluginAssignments,
  dispatchStrategyLabels,
} from '@/mock/model'
import type { PluginAssignment, DispatchStrategy } from '@/mock/model'
import { delay } from '@/utils/mockApi'

const strategyOptions = Object.entries(dispatchStrategyLabels).map(([value, label]) => ({ value, label }))

export default function Assignment() {
  const { models } = useModelContext()
  const [assignments, setAssignments] = useState<PluginAssignment[]>(pluginAssignments)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<PluginAssignment | null>(null)
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [selectedStrategy, setSelectedStrategy] = useState<DispatchStrategy>('single')
  const [loading, setLoading] = useState(false)

  const enabledModels = models.filter((m) => m.status === 'enabled')

  const openAdjust = (record: PluginAssignment) => {
    setEditing(record)
    setSelectedModels(record.models)
    setSelectedStrategy(record.strategy)
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!editing) return
    setLoading(true)
    await delay(500)
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === editing.id ? { ...a, models: selectedModels, strategy: selectedStrategy } : a,
      ),
    )
    setLoading(false)
    setModalOpen(false)
    message.success('分配已更新')
  }

  const columns = [
    {
      title: '插件',
      dataIndex: 'plugin',
      key: 'plugin',
      render: (name: string) => (
        <span><ApiOutlined style={{ marginRight: 8, color: '#1677ff' }} />{name}</span>
      ),
    },
    {
      title: '已分配模型',
      dataIndex: 'models',
      key: 'models',
      render: (modelNames: string[]) =>
        modelNames.map((m) => <Tag key={m} color="blue" style={{ marginBottom: 4 }}>{m}</Tag>),
    },
    {
      title: '调度策略',
      dataIndex: 'strategy',
      key: 'strategy',
      render: (s: DispatchStrategy) => dispatchStrategyLabels[s],
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: PluginAssignment) => (
        <Button type="link" size="small" onClick={() => openAdjust(record)}>调整分配</Button>
      ),
    },
  ]

  return (
    <div>
      <ModelSubNav />
      <PageHeader
        title="插件分配"
        description="将模型分配给不同插件使用。分配后组件在调用 AI 能力时将按策略路由至对应模型。"
      />
      <Table
        columns={columns}
        dataSource={assignments}
        rowKey="id"
        pagination={false}
      />
      <Modal
        title={`调整分配 - ${editing?.plugin}`}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        confirmLoading={loading}
        width={520}
      >
        <div style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>选择模型</div>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            value={selectedModels}
            onChange={setSelectedModels}
            options={enabledModels.map((m) => ({ label: m.name, value: m.name }))}
            placeholder="选择要分配的模型"
          />
        </div>
        <div>
          <div style={{ marginBottom: 8, fontWeight: 500 }}>调度策略</div>
          <Select
            style={{ width: '100%' }}
            value={selectedStrategy}
            onChange={setSelectedStrategy}
            options={strategyOptions}
          />
        </div>
      </Modal>
    </div>
  )
}
